import React, { createContext, useContext } from 'react';

import { useStateActions } from './state-actions.js';
import { useStateSubscription } from './state-subscription.js';

import type { PropsWithChildren } from 'react';
import type { StateSubscriptionHandler } from '../../types/types.js';

type StateSelector<State, SelectedState> = (state: State) => SelectedState;
type EqualityFn<SelectedState> = (current: SelectedState, next: SelectedState) => boolean;
type SharedStateHandler = StateSubscriptionHandler<unknown, unknown>;

const StateProviderContext = createContext<SharedStateHandler | null>(null);
const identitySelector = <State,>(state: State) => state;

export type StateProviderProps<V, A> = PropsWithChildren<{
  instance: StateSubscriptionHandler<V, A>;
}>;

export function useProvidedStateHandler<V, A>() {
  const stateHandler = useContext(StateProviderContext);

  if (!stateHandler) {
    throw new Error('No StateProvider instance found in the current React tree.');
  }

  return stateHandler as StateSubscriptionHandler<V, A>;
}

export function StateProvider<V, A>({ children, instance }: StateProviderProps<V, A>) {
  return (
    <StateProviderContext.Provider value={instance as SharedStateHandler}>
      {children}
    </StateProviderContext.Provider>
  );
}

export function useProvidedStateActions<V, A>() {
  const stateHandler = useProvidedStateHandler<V, A>();

  return useStateActions(stateHandler);
}

export function useProvidedStateSubscription<V, A>(): [V, A];
export function useProvidedStateSubscription<V, A, Sel>(
  selector: StateSelector<V, Sel>,
  isEqual?: EqualityFn<Sel>
): [Sel, A];
export function useProvidedStateSubscription<V, A, Sel = V>(
  selector: StateSelector<V, Sel> = identitySelector as StateSelector<V, Sel>,
  isEqual: EqualityFn<Sel> = Object.is
) {
  const stateHandler = useProvidedStateHandler<V, A>();

  return useStateSubscription(stateHandler, selector, isEqual);
}
