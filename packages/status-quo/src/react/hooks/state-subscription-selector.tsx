/**
 * Utility hook for subscribing to a state handler and selecting a specific value from the state.
 * Uses useSyncExternalStore to ensure consistent state reads and avoid unnecessary re-renders.
 */
import { useCallback, useRef, useSyncExternalStore } from 'react';

import { createSelectorCache, selectWithCache } from '../../utils/selector-cache.js';

import type { StateSubscriptionHandler } from '../../types/types.js';
import type { EqualityFn, Selector } from '../../utils/selector-cache.js';

/**
 * Type signature for listener functions.
 */
type Listener = () => void;

/**
 * Represents a state subscription handler with unknown state and actions.
 */
type SharedStateSubscriptionHandler = StateSubscriptionHandler<unknown, unknown>;

/**
 * Tracks the reference count and deferred lifecycle cleanup status of a state handler.
 */
type DeferredLifecycle = {
  // Number of active consumers of the state handler.
  refCount: number;
  // ID of the timeout for deferred disconnect/destruction.
  timeoutId: ReturnType<typeof setTimeout> | null;
};

/**
 * Cache entry for a selected state snapshot.
 */
type SnapshotCacheEntry<Source, Selected> = {
  // The selected value derived from the source snapshot.
  selectedSnapshot: Selected;
  // The source snapshot from which the value was selected.
  sourceSnapshot: Source;
  // A version number to track state changes.
  version: number;
};

/**
 * Cache entry for a selected server state snapshot (SSR).
 */
type ServerSnapshotCacheEntry<Source, Selected> = {
  // The selected value derived from the source snapshot.
  selectedSnapshot: Selected;
  // The source snapshot from which the value was selected.
  sourceSnapshot: Source;
};

// Global map to track deferred lifecycle status for each state handler instance.
const deferredLifecycleMap = new WeakMap<SharedStateSubscriptionHandler, DeferredLifecycle>();

/**
 * Returns the deferred lifecycle status for a given state handler instance.
 * Initializes the status if it does not already exist.
 */
function getDeferredLifecycleState(
  stateSubscriptionHandler: SharedStateSubscriptionHandler
): DeferredLifecycle {
  // Retrieve the existing status from the map.
  const existingState = deferredLifecycleMap.get(stateSubscriptionHandler);

  // If status already exists, return it.
  if (existingState) {
    return existingState;
  }

  // Create and store a new status for the handler.
  const nextState: DeferredLifecycle = {
    refCount: 0,
    timeoutId: null,
  };

  deferredLifecycleMap.set(stateSubscriptionHandler, nextState);

  return nextState;
}

/**
 * Custom hook to select and subscribe to a specific piece of state from a handler.
 * Efficiently manages subscriptions and selector results.
 */
export function useStateSubscriptionSelector<V, A, Sel>(
  // The state handler instance to subscribe to.
  stateSubscriptionHandler: StateSubscriptionHandler<V, A>,
  // Selector function to derive a value from the state.
  selector: Selector<V, Sel>,
  // Equality function to compare selected values for changes.
  isEqual: EqualityFn<Sel> = Object.is,
  // Whether to automatically destroy the handler instance on component unmount.
  destroyOnCleanup = true
) {
  // Cache for the selector results to ensure referential stability.
  const selectorCacheRef = useRef<ReturnType<typeof createSelectorCache<Sel>> | null>(null);
  // Tracks store notifications so getSnapshot can reuse the same selected value within one store version.
  const snapshotVersionRef = useRef(0);
  // Client-side cache for selected snapshots per source snapshot/version pair.
  const snapshotCacheRef = useRef<SnapshotCacheEntry<V, Sel> | null>(null);
  // Separate cache for the server snapshot function used by SSR/hydration paths.
  const serverSnapshotCacheRef = useRef<ServerSnapshotCacheEntry<V, Sel> | null>(null);

  // Initialize the selector cache if it doesn't already exist.
  if (!selectorCacheRef.current) {
    selectorCacheRef.current = createSelectorCache<Sel>();
  }

  const selectorCache = selectorCacheRef.current;

  // Subscription function to be used by useSyncExternalStore.
  const subscribe = useCallback(
    (listener: Listener) => {
      // Access the deferred lifecycle status for this handler.
      const sharedStateSubscriptionHandler =
        stateSubscriptionHandler as unknown as SharedStateSubscriptionHandler;
      const deferredLifecycleState = getDeferredLifecycleState(sharedStateSubscriptionHandler);
      const hadPendingCleanup = deferredLifecycleState.timeoutId !== null;
      const wasIdle = deferredLifecycleState.refCount === 0;

      // Increment the consumer reference count.
      deferredLifecycleState.refCount += 1;

      // If a pending cleanup timeout is scheduled, cancel it.
      if (deferredLifecycleState.timeoutId) {
        clearTimeout(deferredLifecycleState.timeoutId);
        deferredLifecycleState.timeoutId = null;
      }

      // Subscribe to the state handler.
      const unsubscribe = stateSubscriptionHandler.subscribe(() => {
        // Invalidate the selected snapshot cache before notifying React of a change.
        snapshotVersionRef.current += 1;
        snapshotCacheRef.current = null;
        // Notify React to re-trigger a getSnapshot call.
        listener();
      });

      if (wasIdle && !hadPendingCleanup) {
        stateSubscriptionHandler.connect?.();
      }

      // Return an unsubscribe function to be called by React.
      return () => {
        // Execute the handler's unsubscribe method.
        unsubscribe();

        // Retrieve the current lifecycle status.
        const activeDeferredLifecycleState = deferredLifecycleMap.get(
          sharedStateSubscriptionHandler
        );

        // If no status is found, stop here.
        if (!activeDeferredLifecycleState) {
          return;
        }

        // Decrement the consumer reference count.
        activeDeferredLifecycleState.refCount -= 1;

        // If there are still active consumers, keep the handler connected.
        if (activeDeferredLifecycleState.refCount > 0) {
          return;
        }

        // Reset the reference count to zero.
        activeDeferredLifecycleState.refCount = 0;
        // Schedule deferred cleanup to allow for potential immediate re-subscriptions.
        activeDeferredLifecycleState.timeoutId = setTimeout(() => {
          // Check if the handler still has no consumers after the timeout.
          const pendingDeferredLifecycleState = deferredLifecycleMap.get(
            sharedStateSubscriptionHandler
          );

          // If consumers have reappeared, keep the handler connected.
          if (!pendingDeferredLifecycleState || pendingDeferredLifecycleState.refCount > 0) {
            return;
          }

          // Clear the pending timeout and disconnect the state handler.
          pendingDeferredLifecycleState.timeoutId = null;

          try {
            stateSubscriptionHandler.disconnect?.();
          } finally {
            if (destroyOnCleanup) {
              try {
                stateSubscriptionHandler.destroy();
              } finally {
                // Remove the status from the global map after final destruction.
                deferredLifecycleMap.delete(sharedStateSubscriptionHandler);
              }
            }
          }
        }, 0);
      };
    },
    [destroyOnCleanup, stateSubscriptionHandler]
  );

  // Helper to execute selection using the cache.
  const selectSnapshot = useCallback(
    (snapshot: V) => {
      return selectWithCache(selectorCache, snapshot, selector, isEqual).value;
    },
    [isEqual, selector, selectorCache]
  );

  // Reference to track changes in selection strategy.
  const selectorCacheControlRef = useRef(selectSnapshot);

  // If the selector or equality function changes, clear all caches.
  if (selectorCacheControlRef.current !== selectSnapshot) {
    selectorCacheControlRef.current = selectSnapshot;
    snapshotVersionRef.current = 0;
    snapshotCacheRef.current = null;
    serverSnapshotCacheRef.current = null;
  }

  // Snapshot retrieval function to be used by useSyncExternalStore.
  const getSnapshot = useCallback(
    () => {
      // Retrieve the current source state from the handler.
      const sourceSnapshot = stateSubscriptionHandler.getSnapshot();
      // Access the current version and cached value.
      const version = snapshotVersionRef.current;
      const cachedSnapshot = snapshotCacheRef.current;

      // If the cached selection is still valid for this version and source state, return it.
      if (
        cachedSnapshot &&
        cachedSnapshot.version === version &&
        Object.is(cachedSnapshot.sourceSnapshot, sourceSnapshot)
      ) {
        return cachedSnapshot.selectedSnapshot;
      }

      // Compute a new selection and update the cache.
      const selectedSnapshot = selectSnapshot(sourceSnapshot);
      snapshotCacheRef.current = {
        selectedSnapshot,
        sourceSnapshot,
        version,
      };

      // Return the new selection.
      return selectedSnapshot;
    },
    [selectSnapshot, stateSubscriptionHandler]
  );

  // Server snapshot retrieval function to be used for SSR/hydration.
  const getServerSnapshot = useCallback(
    () => {
      // Retrieve the initial source state from the handler.
      const sourceSnapshot = stateSubscriptionHandler.getInitialState();
      // Access the current cached server snapshot.
      const cachedSnapshot = serverSnapshotCacheRef.current;

      // If the cached server selection is still valid for the initial state, return it.
      if (cachedSnapshot && Object.is(cachedSnapshot.sourceSnapshot, sourceSnapshot)) {
        return cachedSnapshot.selectedSnapshot;
      }

      // Compute a new server selection and update its cache.
      const selectedSnapshot = selectSnapshot(sourceSnapshot);
      serverSnapshotCacheRef.current = {
        selectedSnapshot,
        sourceSnapshot,
      };

      // Return the initial selection result.
      return selectedSnapshot;
    },
    [selectSnapshot, stateSubscriptionHandler]
  );

  // Use the useSyncExternalStore hook to integrate the state with React's rendering lifecycle.
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
