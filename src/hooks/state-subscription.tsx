import { useCallback, useSyncExternalStore } from 'react';

import type { StateSubscriptionHandler } from '../types/types.js';
type Listener = () => void;

export function useStateSubscription<V, A>(
  stateSubscriptionHandler: StateSubscriptionHandler<V, A>
) {
  const subscribe = useCallback(
    (listener: Listener) => {
      const unsubscribe = stateSubscriptionHandler.subscribe(listener);

      return () => {
        unsubscribe();
        stateSubscriptionHandler.destroy();
      };
    },
    [stateSubscriptionHandler]
  );

  const getSnapshot = useCallback(
    () => stateSubscriptionHandler.getSnapshot(),
    [stateSubscriptionHandler]
  );

  const getServerSnapshot = useCallback(
    () => stateSubscriptionHandler.getInitialState(),
    [stateSubscriptionHandler]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
