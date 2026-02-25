import { useEffect, useMemo } from 'react';

import { useStateActions } from './state-actions.js';
import { useStateSubscriptionSelector } from './state-subscription-selector.js';

import type { StateSingleton } from '../store/state-singleton.js';
import type { StateSubscriptionHandler } from '../types/types.js';

type StateSelector<State, SelectedState> = (state: State) => SelectedState;
type EqualityFn<SelectedState> = (current: SelectedState, next: SelectedState) => boolean;
type ManagedSingleton = StateSingleton<unknown, unknown> & {
  destroyInstance?: () => void;
  destroyOnNoConsumers?: boolean;
};
type SharedStateHandler = StateSubscriptionHandler<unknown, unknown>;

const singletonReferences = new WeakMap<
  StateSingleton<unknown, unknown>,
  { count: number; stateHandler: SharedStateHandler }
>();

const identitySelector = <State,>(state: State) => state;

function isStateSingleton<V, A>(
  source: StateSubscriptionHandler<V, A> | StateSingleton<V, A>
): source is StateSingleton<V, A> {
  return 'getInstance' in source;
}

export function useStateSubscription<V, A>(
  source: StateSubscriptionHandler<V, A>
): [V, A];
export function useStateSubscription<V, A, Sel>(
  source: StateSubscriptionHandler<V, A>,
  selector: StateSelector<V, Sel>,
  isEqual?: EqualityFn<Sel>
): [Sel, A];
export function useStateSubscription<V, A>(
  source: StateSingleton<V, A>
): [V, A];
export function useStateSubscription<V, A, Sel>(
  source: StateSingleton<V, A>,
  selector: StateSelector<V, Sel>,
  isEqual?: EqualityFn<Sel>
): [Sel, A];
export function useStateSubscription<V, A, Sel = V>(
  source: StateSubscriptionHandler<V, A> | StateSingleton<V, A>,
  selector: StateSelector<V, Sel> = identitySelector as StateSelector<V, Sel>,
  isEqual: EqualityFn<Sel> = Object.is
) {
  const singletonSource = isStateSingleton(source) ? source : null;
  const stateSubscriptionHandler = useMemo<StateSubscriptionHandler<V, A>>(() => {
    if (singletonSource) {
      return singletonSource.getInstance();
    }

    return source as StateSubscriptionHandler<V, A>;
  }, [singletonSource, source]);

  useEffect(() => {
    if (!singletonSource) {
      return undefined;
    }

    const singleton = singletonSource as ManagedSingleton;
    const sharedStateHandler = stateSubscriptionHandler as SharedStateHandler;
    const singletonReference = singletonReferences.get(singleton);

    if (!singletonReference || singletonReference.stateHandler !== sharedStateHandler) {
      singletonReferences.set(singleton, { count: 1, stateHandler: sharedStateHandler });
    } else {
      singletonReference.count += 1;
    }

    return () => {
      const activeReference = singletonReferences.get(singleton);

      if (!activeReference || activeReference.stateHandler !== sharedStateHandler) {
        return;
      }

      activeReference.count -= 1;

      if (activeReference.count <= 0) {
        singletonReferences.delete(singleton);
        if (singleton.destroyOnNoConsumers === false) {
          return;
        }

        if (singleton.destroyInstance) {
          singleton.destroyInstance();
          return;
        }

        stateSubscriptionHandler.destroy();
      }
    };
  }, [singletonSource, stateSubscriptionHandler]);

  const state = useStateSubscriptionSelector(
    stateSubscriptionHandler,
    selector,
    isEqual,
    !singletonSource
  );
  const actions = useStateActions(stateSubscriptionHandler);

  return [state, actions] as [Sel, A];
}
