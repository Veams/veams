/**
 * Utility hook for subscribing to a state singleton within a component.
 */
import { useStateSubscription } from './state-subscription.js';

import type { StateSingleton } from '../../store/state-singleton.js';

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
 * Singleton hook to subscribe to a state singleton.
 */
export function useStateSingleton<V, A>(
  // The state singleton instance to subscribe to.
  singleton: StateSingleton<V, A>
): [V, A];
export function useStateSingleton<V, A, Sel>(
  // The state singleton instance to subscribe to.
  singleton: StateSingleton<V, A>,
  // Selector function to derive a specific value from the state.
  selector: StateSelector<V, Sel>,
  // Optional equality function to compare selected values.
  isEqual?: EqualityFn<Sel>
): [Sel, A];
export function useStateSingleton<V, A, Sel = V>(
  // Implementation of the overloaded useStateSingleton hook.
  singleton: StateSingleton<V, A>,
  // Mixed argument: can be a selector or equality function.
  selectorOrIsEqual: StateSelector<V, Sel> | EqualityFn<Sel> = identitySelector as StateSelector<
    V,
    Sel
  >,
  // Mixed argument: can be an equality function or undefined.
  isEqual: EqualityFn<Sel> = Object.is as EqualityFn<Sel>
) {
  // Determine whether a selector was provided as the first optional argument.
  const hasSelector = typeof selectorOrIsEqual === 'function' && selectorOrIsEqual.length === 1;
  // Fallback to identity selector if none is provided.
  const selector = (hasSelector ? selectorOrIsEqual : identitySelector) as StateSelector<V, Sel>;
  // Resolve the equality function to use.
  const equalityFn = (hasSelector ? isEqual : selectorOrIsEqual) as EqualityFn<Sel>;

  // Subscribe to the singleton state handler and return the selected state and actions.
  return useStateSubscription(singleton, selector, equalityFn);
}
