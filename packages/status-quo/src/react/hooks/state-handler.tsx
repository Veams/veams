/**
 * Utility hook for managing the lifecycle of a state handler instance.
 * Ensures the instance is created once and persisted across component re-renders.
 */
import { useRef } from 'react';

import type { StateSubscriptionHandler } from '../../types/types.js';

/**
 * Returns a stable state handler instance based on a factory function.
 * Uses a ref to ensure the factory function is only executed during initial render.
 */
export function useStateHandler<V, A, P extends unknown[]>(
  // Function to create a new state handler instance.
  stateFactoryFunction: (...args: P) => StateSubscriptionHandler<V, A>,
  // Parameters to pass to the factory function.
  params: P = [] as unknown as P
) {
  // Use a ref to store the state handler instance.
  // This prevents the state handler from being recreated on every re-render.
  const stateHandlerRef = useRef<StateSubscriptionHandler<V, A> | null>(null);

  // If the ref is currently null, we create the instance for the first time.
  if (!stateHandlerRef.current) {
    // Invoke the factory function with the provided parameters.
    stateHandlerRef.current = stateFactoryFunction(...params);
  }

  // Return the stable state handler instance.
  return stateHandlerRef.current;
}
