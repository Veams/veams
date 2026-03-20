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

      const unsubscribe = stateSubscriptionHandler.subscribe(listener);

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

  const getSnapshot = useCallback(
    () => selectSnapshot(stateSubscriptionHandler.getSnapshot()),
    [selectSnapshot, stateSubscriptionHandler]
  );

  const getServerSnapshot = useCallback(
    () => selectSnapshot(stateSubscriptionHandler.getInitialState()),
    [selectSnapshot, stateSubscriptionHandler]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
