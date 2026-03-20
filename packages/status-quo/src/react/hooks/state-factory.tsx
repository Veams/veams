import { useStateHandler } from './state-handler.js';
import { useStateSubscription } from './state-subscription.js';

import type { StateSubscriptionHandler } from '../../types/types.js';

type StateSelector<State, SelectedState> = (state: State) => SelectedState;
type EqualityFn<SelectedState> = (current: SelectedState, next: SelectedState) => boolean;

const identitySelector = <State,>(state: State) => state;

export function useStateFactory<V, A, P extends unknown[]>(
  stateFactoryFunction: (...args: P) => StateSubscriptionHandler<V, A>,
  params?: P
): [V, A];
export function useStateFactory<V, A, P extends unknown[], Sel>(
  stateFactoryFunction: (...args: P) => StateSubscriptionHandler<V, A>,
  selector: StateSelector<V, Sel>,
  params?: P
): [Sel, A];
export function useStateFactory<V, A, P extends unknown[], Sel>(
  stateFactoryFunction: (...args: P) => StateSubscriptionHandler<V, A>,
  selector: StateSelector<V, Sel>,
  isEqual?: EqualityFn<Sel>,
  params?: P
): [Sel, A];
export function useStateFactory<V, A, P extends unknown[], Sel = V>(
  stateFactoryFunction: (...args: P) => StateSubscriptionHandler<V, A>,
  selectorOrParams: StateSelector<V, Sel> | P = [] as unknown as P,
  isEqualOrParams: EqualityFn<Sel> | P = Object.is as EqualityFn<Sel>,
  params: P = [] as unknown as P
) {
  const hasSelector = typeof selectorOrParams === 'function';
  const selector = (hasSelector ? selectorOrParams : identitySelector) as StateSelector<V, Sel>;
  const hasCustomEquality = hasSelector && typeof isEqualOrParams === 'function';
  const isEqual = (hasCustomEquality ? isEqualOrParams : Object.is);
  const stateFactoryParams = (
    hasSelector ? (hasCustomEquality ? params : isEqualOrParams) : selectorOrParams
  ) as P;
  const stateHandler = useStateHandler(stateFactoryFunction, stateFactoryParams);

  return useStateSubscription(stateHandler, selector, isEqual);
}
