/**
 * Utility hook for accessing actions from a state handler instance.
 */
import { useMemo } from 'react';

import type { StateSubscriptionHandler } from '../../types/types.js';
import { useProvidedStateHandler } from './state-provider.js';

/**
 * Returns the actions of a state handler instance.
 * memoized based on the state handler instance itself.
 */
export function useStateActions<V, A>(stateHandler: StateSubscriptionHandler<V, A>): A {
  // Access and memoize the actions from the state handler.
  // This ensures the action object remains referentially stable as long as the state handler is the same.
  const actions = useMemo(() => stateHandler.getActions(), [stateHandler]);

  // Return the set of actions.
  return actions;
}

/**
 * Returns the actions of the state handler provided by the nearest StateProvider.
 */
export function useProvidedStateActions<V, A>(): A {
  const stateHandler = useProvidedStateHandler<V, A>();
  return useStateActions(stateHandler);
}
