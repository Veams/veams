/**
 * Utility hook for subscribing to a state handler or a state singleton.
 * Manages the lifecycle and reference counting for shared state handler instances.
 */
import { useEffect, useMemo } from 'react';

import { useStateActions } from './state-actions.js';
import { useStateSubscriptionSelector } from './state-subscription-selector.js';

import type { StateSingleton } from '../../store/state-singleton.js';
import type { StateSubscriptionHandler } from '../../types/types.js';
import { useProvidedStateHandler } from './state-provider.js';

/**
 * Type signatures for selector and equality functions.
 */
type StateSelector<State, SelectedState> = (state: State) => SelectedState;
type EqualityFn<SelectedState> = (current: SelectedState, next: SelectedState) => boolean;

/**
 * Interface representing a state singleton with optional internal management methods.
 */
type ManagedSingleton = StateSingleton<unknown, unknown> & {
  // Method to manually destroy the singleton instance.
  destroyInstance?: () => void;
  // Flag indicating if the instance should be destroyed when no more consumers are active.
  destroyOnNoConsumers?: boolean;
};

/**
 * Alias for a standard state handler instance.
 */
type SharedStateHandler = StateSubscriptionHandler<unknown, unknown>;

/**
 * Global map to track reference counts for singleton state handler instances.
 * Used to determine when it's safe to destroy a shared singleton.
 */
const singletonReferences = new WeakMap<
  StateSingleton<unknown, unknown>,
  { count: number; stateHandler: SharedStateHandler }
>();

/**
 * Default identity selector returns the whole state.
 */
const identitySelector = <State,>(state: State) => state;

/**
 * Type guard function to check if a source is a StateSingleton.
 */
function isStateSingleton<V, A>(
  source: StateSubscriptionHandler<V, A> | StateSingleton<V, A>
): source is StateSingleton<V, A> {
  // Check for the presence of the getInstance method.
  return 'getInstance' in source;
}

/**
 * Custom hook to subscribe to a state handler or singleton and receive its state and actions.
 * Correctly manages shared instances and reference counting.
 */
export function useStateSubscription<V, A>(source: StateSubscriptionHandler<V, A>): [V, A];
export function useStateSubscription<V, A, Sel>(
  source: StateSubscriptionHandler<V, A>,
  selector: StateSelector<V, Sel>,
  isEqual?: EqualityFn<Sel>
): [Sel, A];
export function useStateSubscription<V, A>(source: StateSingleton<V, A>): [V, A];
export function useStateSubscription<V, A, Sel>(
  source: StateSingleton<V, A>,
  selector: StateSelector<V, Sel>,
  isEqual?: EqualityFn<Sel>
): [Sel, A];
export function useStateSubscription<V, A, Sel = V>(
  // Implementation of the overloaded useStateSubscription hook.
  source: StateSubscriptionHandler<V, A> | StateSingleton<V, A>,
  // Selector function to derive a specific value from the state.
  selector: StateSelector<V, Sel> = identitySelector as StateSelector<V, Sel>,
  // Optional equality function to compare selected values for changes.
  isEqual: EqualityFn<Sel> = Object.is
) {
  // Determine if the source is a singleton instance or a direct state handler.
  const singletonSource = isStateSingleton(source) ? source : null;
  // Resolve the final state subscription handler instance to use.
  const stateSubscriptionHandler = useMemo<StateSubscriptionHandler<V, A>>(() => {
    // If it's a singleton, access its managed instance.
    if (singletonSource) {
      return singletonSource.getInstance();
    }

    // Otherwise, return the source handler instance directly.
    return source as StateSubscriptionHandler<V, A>;
  }, [singletonSource, source]);

  // Use an effect to manage the lifecycle and reference count of singleton instances.
  useEffect(() => {
    // If the source is not a singleton, no lifecycle management is needed here.
    if (!singletonSource) {
      return undefined;
    }

    // Cast the source to access management properties and retrieve the current reference.
    const singleton = singletonSource as ManagedSingleton;
    const sharedStateHandler = stateSubscriptionHandler as SharedStateHandler;
    const singletonReference = singletonReferences.get(singleton);

    // Update the reference count for the singleton instance.
    if (!singletonReference || singletonReference.stateHandler !== sharedStateHandler) {
      // Initialize the count if it doesn't already exist or has changed.
      singletonReferences.set(singleton, { count: 1, stateHandler: sharedStateHandler });
    } else {
      // Increment the consumer count.
      singletonReference.count += 1;
    }

    // Return an effect cleanup function to decrement the count when the component unmounts.
    return () => {
      // Access the active reference for the singleton.
      const activeReference = singletonReferences.get(singleton);

      // If no active reference is found, do nothing.
      if (!activeReference || activeReference.stateHandler !== sharedStateHandler) {
        return;
      }

      // Decrement the consumer count.
      activeReference.count -= 1;

      // If there are still active consumers, do not destroy the instance.
      if (activeReference.count <= 0) {
        // Remove the reference from the map when the count reaches zero.
        singletonReferences.delete(singleton);

        // Only proceed with destruction if destroyOnNoConsumers is explicitly enabled.
        if (singleton.destroyOnNoConsumers !== true) {
          return;
        }

        // Use the singleton's internal destroy method if available.
        if (singleton.destroyInstance) {
          singleton.destroyInstance();
          return;
        }

        // Otherwise, invoke the handler's destroy method directly.
        stateSubscriptionHandler.destroy();
      }
    };
  }, [singletonSource, stateSubscriptionHandler]);

  // Select and subscribe to the state value using the useStateSubscriptionSelector hook.
  const state = useStateSubscriptionSelector(
    stateSubscriptionHandler,
    selector,
    isEqual,
    !singletonSource
  );
  // Retrieve the set of actions from the state handler.
  const actions = useStateActions(stateSubscriptionHandler);

  // Return the selected state and its actions as a tuple.
  return [state, actions] as [Sel, A];
}

/**
 * Custom hook to subscribe to the state handler provided by the nearest StateProvider.
 */
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
