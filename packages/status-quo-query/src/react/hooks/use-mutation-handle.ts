// Import the React hooks needed to memoize callbacks, hold mutable cache state,
// and connect an external store to React rendering.
import { useCallback, useRef, useSyncExternalStore } from 'react';

// Import the mutation-handle contract and the stable snapshot shape the hook returns.
import type { MutationHandle, MutationHandleSnapshot } from '../../mutation.js';
// Describe the no-argument listener shape expected by useSyncExternalStore.
type Listener = () => void;

// Store one cached snapshot together with the store version it belongs to.
type SnapshotCacheEntry<TData, TError, TVariables> = {
  // Hold the snapshot returned by the mutation handle for this version.
  snapshot: MutationHandleSnapshot<TData, TError, TVariables>;
  // Track which subscription version produced the cached snapshot.
  version: number;
};

// Subscribe a React component to a MutationHandle and return its latest snapshot.
export function useMutationHandle<TData, TError = Error, TVariables = void>(
  // Receive the external mutation handle instance to subscribe to.
  mutationHandle: MutationHandle<TData, TError, TVariables>
) {
  // Count store notifications so we can tell when our cached snapshot is stale.
  const snapshotVersionRef = useRef(0);
  // Cache one client-side snapshot per observed version to keep getSnapshot stable.
  const snapshotCacheRef = useRef<SnapshotCacheEntry<TData, TError, TVariables> | null>(null);
  // Cache the server snapshot separately for the useSyncExternalStore SSR fallback.
  const serverSnapshotCacheRef = useRef<MutationHandleSnapshot<TData, TError, TVariables> | null>(
    null
  );

  // Create the subscribe function expected by useSyncExternalStore.
  const subscribe = useCallback(
    // React passes a listener that must run whenever the external store changes.
    (listener: Listener) =>
      // Forward the subscription to the mutation handle.
      mutationHandle.subscribe(() => {
        // Bump the version so later reads know the previous cache is outdated.
        snapshotVersionRef.current += 1;
        // Drop the cached client snapshot because the store just changed.
        snapshotCacheRef.current = null;
        // Drop the cached server snapshot for the same reason.
        serverSnapshotCacheRef.current = null;
        // Notify React that it should read a fresh snapshot.
        listener();
      }),
    // Recreate the subscription function only when the handle instance changes.
    [mutationHandle]
  );

  // Read the current client snapshot in a referentially stable way for React.
  const getSnapshot = useCallback(() => {
    // Read the latest store version number.
    const version = snapshotVersionRef.current;
    // Read the last cached client snapshot, if there is one.
    const cachedSnapshot = snapshotCacheRef.current;

    // Reuse the cached snapshot when it was produced for the current version.
    if (cachedSnapshot && cachedSnapshot.version === version) {
      // Return the cached snapshot so repeated reads in the same render stay stable.
      return cachedSnapshot.snapshot;
    }

    // Ask the mutation handle for the latest snapshot because the cache is empty or stale.
    const snapshot = mutationHandle.getSnapshot();
    // Store the new snapshot together with the version it belongs to.
    snapshotCacheRef.current = {
      snapshot,
      version,
    };

    // Return the freshly read snapshot to React.
    return snapshot;
  }, [mutationHandle]);

  // Read the server snapshot used by React during SSR or hydration fallback paths.
  const getServerSnapshot = useCallback(() => {
    // Read the cached server snapshot, if one was stored earlier.
    const cachedSnapshot = serverSnapshotCacheRef.current;

    // Reuse the cached server snapshot to keep server reads stable.
    if (cachedSnapshot) {
      // Return the cached server snapshot directly.
      return cachedSnapshot;
    }

    // Ask the mutation handle for a snapshot because no server cache exists yet.
    const snapshot = mutationHandle.getSnapshot();
    // Cache that snapshot for the next server read.
    serverSnapshotCacheRef.current = snapshot;

    // Return the freshly read server snapshot.
    return snapshot;
  }, [mutationHandle]);

  // Let React subscribe to the external store and read snapshots through the callbacks above.
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
