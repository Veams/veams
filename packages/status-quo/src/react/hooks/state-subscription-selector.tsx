import { useCallback, useRef, useSyncExternalStore } from 'react';

import { createSelectorCache, selectWithCache } from '../../utils/selector-cache.js';

import type { StateSubscriptionHandler } from '../../types/types.js';
import type { EqualityFn, Selector } from '../../utils/selector-cache.js';

type Listener = () => void;
type SharedStateSubscriptionHandler = StateSubscriptionHandler<unknown, unknown>;
type DeferredDestroy = {
  refCount: number;
  timeoutId: ReturnType<typeof setTimeout> | null;
};
type SnapshotCacheEntry<Source, Selected> = {
  selectedSnapshot: Selected;
  sourceSnapshot: Source;
  version: number;
};
type ServerSnapshotCacheEntry<Source, Selected> = {
  selectedSnapshot: Selected;
  sourceSnapshot: Source;
};

const deferredDestroyMap = new WeakMap<SharedStateSubscriptionHandler, DeferredDestroy>();

function getDeferredDestroyState(
  stateSubscriptionHandler: SharedStateSubscriptionHandler
): DeferredDestroy {
  const existingState = deferredDestroyMap.get(stateSubscriptionHandler);

  if (existingState) {
    return existingState;
  }

  const nextState: DeferredDestroy = {
    refCount: 0,
    timeoutId: null,
  };

  deferredDestroyMap.set(stateSubscriptionHandler, nextState);

  return nextState;
}

export function useStateSubscriptionSelector<V, A, Sel>(
  stateSubscriptionHandler: StateSubscriptionHandler<V, A>,
  selector: Selector<V, Sel>,
  isEqual: EqualityFn<Sel> = Object.is,
  destroyOnCleanup = true
) {
  const selectorCacheRef = useRef<ReturnType<typeof createSelectorCache<Sel>> | null>(null);
  // Tracks store notifications so getSnapshot can reuse the same selected value
  // within one store version. This keeps useSyncExternalStore reads referentially stable.
  const snapshotVersionRef = useRef(0);
  // Client-side cache for selected snapshots per source snapshot/version pair.
  const snapshotCacheRef = useRef<SnapshotCacheEntry<V, Sel> | null>(null);
  // Separate cache for the server snapshot function used by SSR/hydration paths.
  const serverSnapshotCacheRef = useRef<ServerSnapshotCacheEntry<V, Sel> | null>(null);

  if (!selectorCacheRef.current) {
    selectorCacheRef.current = createSelectorCache<Sel>();
  }

  const selectorCache = selectorCacheRef.current;

  const subscribe = useCallback(
    (listener: Listener) => {
      const sharedStateSubscriptionHandler =
        stateSubscriptionHandler as unknown as SharedStateSubscriptionHandler;
      const deferredDestroyState = getDeferredDestroyState(sharedStateSubscriptionHandler);
      deferredDestroyState.refCount += 1;

      if (deferredDestroyState.timeoutId) {
        clearTimeout(deferredDestroyState.timeoutId);
        deferredDestroyState.timeoutId = null;
      }

      const unsubscribe = stateSubscriptionHandler.subscribe(() => {
        // Invalidate the selected snapshot cache before notifying React.
        // Any next getSnapshot call should recompute from the new store state.
        snapshotVersionRef.current += 1;
        snapshotCacheRef.current = null;
        listener();
      });

      return () => {
        unsubscribe();

        if (!destroyOnCleanup) {
          return;
        }

        const activeDeferredDestroyState = deferredDestroyMap.get(sharedStateSubscriptionHandler);

        if (!activeDeferredDestroyState) {
          return;
        }

        activeDeferredDestroyState.refCount -= 1;

        if (activeDeferredDestroyState.refCount > 0) {
          return;
        }

        activeDeferredDestroyState.refCount = 0;
        activeDeferredDestroyState.timeoutId = setTimeout(() => {
          const pendingDeferredDestroyState = deferredDestroyMap.get(
            sharedStateSubscriptionHandler
          );

          if (!pendingDeferredDestroyState || pendingDeferredDestroyState.refCount > 0) {
            return;
          }

          pendingDeferredDestroyState.timeoutId = null;
          stateSubscriptionHandler.destroy();
          deferredDestroyMap.delete(sharedStateSubscriptionHandler);
        }, 0);
      };
    },
    [destroyOnCleanup, stateSubscriptionHandler]
  );

  const selectSnapshot = useCallback(
    (snapshot: V) => {
      return selectWithCache(selectorCache, snapshot, selector, isEqual).value;
    },
    [isEqual, selector, selectorCache]
  );

  const selectorCacheControlRef = useRef(selectSnapshot);

  if (selectorCacheControlRef.current !== selectSnapshot) {
    // Selector/equality changes define a new selection strategy, so clear all caches.
    selectorCacheControlRef.current = selectSnapshot;
    snapshotVersionRef.current = 0;
    snapshotCacheRef.current = null;
    serverSnapshotCacheRef.current = null;
  }

  const getSnapshot = useCallback(
    () => {
      const sourceSnapshot = stateSubscriptionHandler.getSnapshot();
      const version = snapshotVersionRef.current;
      const cachedSnapshot = snapshotCacheRef.current;

      if (
        cachedSnapshot &&
        cachedSnapshot.version === version &&
        Object.is(cachedSnapshot.sourceSnapshot, sourceSnapshot)
      ) {
        // Same source snapshot in the same store version: return the exact same selected reference.
        return cachedSnapshot.selectedSnapshot;
      }

      const selectedSnapshot = selectSnapshot(sourceSnapshot);
      snapshotCacheRef.current = {
        selectedSnapshot,
        sourceSnapshot,
        version,
      };

      return selectedSnapshot;
    },
    [selectSnapshot, stateSubscriptionHandler]
  );

  const getServerSnapshot = useCallback(
    () => {
      const sourceSnapshot = stateSubscriptionHandler.getInitialState();
      const cachedSnapshot = serverSnapshotCacheRef.current;

      if (cachedSnapshot && Object.is(cachedSnapshot.sourceSnapshot, sourceSnapshot)) {
        // Keep server snapshot reads stable for hydration by reusing cached selection.
        return cachedSnapshot.selectedSnapshot;
      }

      const selectedSnapshot = selectSnapshot(sourceSnapshot);
      serverSnapshotCacheRef.current = {
        selectedSnapshot,
        sourceSnapshot,
      };

      return selectedSnapshot;
    },
    [selectSnapshot, stateSubscriptionHandler]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
