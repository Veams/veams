import { useCallback, useMemo, useSyncExternalStore } from 'react';

import type { StateSubscriptionHandler } from '../types/types.js';

type SelectorCache<SelectedState> = {
  hasValue: boolean;
  value: SelectedState | undefined;
};

type SelectorFn<State, SelectedState> = (state: State) => SelectedState;
type EqualityFn<SelectedState> = (current: SelectedState, next: SelectedState) => boolean;
type Listener = () => void;

export function useStateSubscriptionSelector<V, A, Sel>(
  stateSubscriptionHandler: StateSubscriptionHandler<V, A>,
  selector: SelectorFn<V, Sel>,
  isEqual: EqualityFn<Sel> = Object.is,
  destroyOnCleanup = true
) {
  const selectorCache = useMemo<SelectorCache<Sel>>(
    () => ({
      hasValue: false,
      value: undefined,
    }),
    [stateSubscriptionHandler]
  );

  const subscribe = useCallback(
    (listener: Listener) => {
      const unsubscribe = stateSubscriptionHandler.subscribe(listener);

      return () => {
        unsubscribe();

        if (destroyOnCleanup) {
          stateSubscriptionHandler.destroy();
        }
      };
    },
    [destroyOnCleanup, stateSubscriptionHandler]
  );

  const selectSnapshot = useCallback(
    (snapshot: V) => {
      const nextSelection = selector(snapshot);

      if (selectorCache.hasValue && isEqual(selectorCache.value as Sel, nextSelection)) {
        return selectorCache.value as Sel;
      }

      selectorCache.hasValue = true;
      selectorCache.value = nextSelection;

      return nextSelection;
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
