/**
 * Utility hook for creating and subscribing to a state handler within a component.
 * Combines creation and subscription logic in a single call.
 */
import { useStateHandler } from './state-handler.js';
import { useStateSubscription } from './state-subscription.js';

import type { StateSubscriptionHandler } from '../../types/types.js';

/**
 * Type signatures for selector and equality functions.
 */
type StateSelector<State, SelectedState> = (state: State) => SelectedState;
type EqualityFn<SelectedState> = (current: SelectedState, next: SelectedState) => boolean;

/**
 * Default identity selector returns the whole state.
 */
const identitySelector = <State,>(state: State) => state;

/**
 * Factory hook to create and subscribe to a state handler.
 * Manages the handler instance using useStateHandler and its subscription with useStateSubscription.
 */
export function useStateFactory<V, A, P extends unknown[]>(
  // Function to create a new state handler instance.
  stateFactoryFunction: (...args: P) => StateSubscriptionHandler<V, A>,
  // Parameters to pass to the factory function.
  params?: P
): [V, A];
export function useStateFactory<V, A, P extends unknown[], Sel>(
  // Function to create a new state handler instance.
  stateFactoryFunction: (...args: P) => StateSubscriptionHandler<V, A>,
  // Selector function to derive a specific value from the state.
  selector: StateSelector<V, Sel>,
  // Parameters to pass to the factory function.
  params?: P
): [Sel, A];
export function useStateFactory<V, A, P extends unknown[], Sel>(
  // Function to create a new state handler instance.
  stateFactoryFunction: (...args: P) => StateSubscriptionHandler<V, A>,
  // Selector function to derive a specific value from the state.
  selector: StateSelector<V, Sel>,
  // Optional equality function to compare selected values.
  isEqual?: EqualityFn<Sel>,
  // Parameters to pass to the factory function.
  params?: P
): [Sel, A];
export function useStateFactory<V, A, P extends unknown[], Sel = V>(
  // Implementation of the overloaded useStateFactory hook.
  stateFactoryFunction: (...args: P) => StateSubscriptionHandler<V, A>,
  // Mixed argument: can be a selector or params array.
  selectorOrParams: StateSelector<V, Sel> | P = [] as unknown as P,
  // Mixed argument: can be an equality function or params array.
  isEqualOrParams: EqualityFn<Sel> | P = Object.is as EqualityFn<Sel>,
  // Optional params array.
  params: P = [] as unknown as P
) {
  // Determine whether a selector was provided.
  const hasSelector = typeof selectorOrParams === 'function';
  // Fallback to identity selector if none is provided.
  const selector = (hasSelector ? selectorOrParams : identitySelector) as StateSelector<V, Sel>;
  // Determine whether a custom equality function was provided.
  const hasCustomEquality = hasSelector && typeof isEqualOrParams === 'function';
  // Fallback to default equality check (Object.is).
  const isEqual = (hasCustomEquality ? isEqualOrParams : Object.is);
  // Resolve the parameters for the state handler factory.
  const stateFactoryParams = (
    hasSelector ? (hasCustomEquality ? params : isEqualOrParams) : selectorOrParams
  ) as P;
  // Create and persist the state handler instance using its factory and parameters.
  const stateHandler = useStateHandler(stateFactoryFunction, stateFactoryParams);

  // Subscribe to the state handler and return the selected state and actions.
  return useStateSubscription(stateHandler, selector, isEqual);
}
