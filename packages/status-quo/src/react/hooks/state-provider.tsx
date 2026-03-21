/**
 * Utility hook for providing a state handler through React Context.
 * Allows components deep in the component tree to access a common state handler instance.
 */
import React, { createContext, useContext } from 'react';

import type { StateSubscriptionHandler } from '../../types/types.js';

/**
 * Interface for the state provider component props.
 */
interface StateProviderProps<V, A> {
  // Children components that will have access to the state handler.
  children: React.ReactNode;
  // The state handler instance to be provided to the component tree.
  instance: StateSubscriptionHandler<V, A>;
}

/**
 * Creates a React Context for storing and providing the state handler instance.
 * Initialized with null as there is no default state handler.
 */
const StateContext = createContext<StateSubscriptionHandler<unknown, unknown> | null>(null);

/**
 * Provides a state handler instance to its descendant components using React Context.
 */
export function StateProvider<V, A>({ children, instance }: StateProviderProps<V, A>) {
  // Use a context provider to share the state handler instance.
  return (
    <StateContext.Provider value={instance as StateSubscriptionHandler<unknown, unknown>}>
      {children}
    </StateContext.Provider>
  );
}

/**
 * Custom hook to access the state handler provided by the StateProvider.
 * Throws an error if the hook is used outside of a StateProvider.
 */
export function useProvidedStateHandler<V, A>(): StateSubscriptionHandler<V, A> {
  // Retrieve the state handler from the nearest context provider.
  const stateHandler = useContext(StateContext);

  // If no state handler is found, it means the hook is being used incorrectly.
  if (!stateHandler) {
    throw new Error('useProvidedStateHandler must be used within a StateProvider');
  }

  // Cast and return the state handler instance.
  return stateHandler as StateSubscriptionHandler<V, A>;
}
