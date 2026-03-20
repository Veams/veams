import { useStateSubscription } from './state-subscription.js';

import type { StateSingleton } from '../../store/state-singleton.js';

type StateSelector<State, SelectedState> = (state: State) => SelectedState;
type EqualityFn<SelectedState> = (current: SelectedState, next: SelectedState) => boolean;

const identitySelector = <State,>(state: State) => state;

export function useStateSingleton<V, A>(stateSingleton: StateSingleton<V, A>): [V, A];
export function useStateSingleton<V, A, Sel>(
  stateSingleton: StateSingleton<V, A>,
  selector: StateSelector<V, Sel>,
  isEqual?: EqualityFn<Sel>
): [Sel, A];
export function useStateSingleton<V, A, Sel = V>(
  stateSingleton: StateSingleton<V, A>,
  selector: StateSelector<V, Sel> = identitySelector as StateSelector<V, Sel>,
  isEqual: EqualityFn<Sel> = Object.is
) {
  const [state, actions] = useStateSubscription(stateSingleton, selector, isEqual);

  return [state, actions] as [Sel, A];
}
