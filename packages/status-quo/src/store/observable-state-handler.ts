/**
 * Import RxJS components for reactive state handling.
 */
import { BehaviorSubject, distinctUntilChanged, distinctUntilKeyChanged, map } from 'rxjs';

/**
 * Import internal configuration and the abstract base state handler.
 */
import { resolveDistinctOptions } from '../config/status-quo-config.js';
import { BaseStateHandler } from './base-state-handler.js';

/**
 * Import necessary types for DevTools, distinct update options, and RxJS Observable.
 */
import type { DevToolsOptions, DistinctOptions } from '../config/status-quo-config.js';
import type { Observable } from 'rxjs';

/**
 * Props for configuring the ObservableStateHandler instance.
 */
type ObservableStateHandlerProps<S> = {
  // The initial value for the state.
  initialState: S;
  // Optional configuration for DevTools and distinct update behaviors.
  options?: {
    devTools?: DevToolsOptions;
    distinct?: DistinctOptions<S>;
    useDistinctUntilChanged?: boolean;
  };
};

/**
 * Options for configuring state-related observables.
 */
type StateObservableOptions = { useDistinctUntilChanged?: boolean };

/**
 * ObservableStateHandler: A state handler built on top of RxJS BehaviorSubject.
 * Provides powerful reactive patterns and integration with RxJS pipelines.
 */
export abstract class ObservableStateHandler<S, A> extends BaseStateHandler<S, A> {
  // Internal BehaviorSubject to manage the state and provide current values to new subscribers.
  private readonly state$: BehaviorSubject<S>;
  // Configuration to determine if and how state changes should trigger notifications.
  private readonly distinctOptions: ReturnType<typeof resolveDistinctOptions<S>>;

  /**
   * Initializes the observable state handler with given state and configuration.
   */
  protected constructor({ initialState, options }: ObservableStateHandlerProps<S>) {
    // Pass the initial state to the base handler.
    super(initialState);
    // Initialize the internal BehaviorSubject with the initial state.
    this.state$ = new BehaviorSubject<S>(initialState);
    // Resolve the final distinct options based on provided configuration.
    this.distinctOptions = resolveDistinctOptions(
      options?.distinct,
      options?.useDistinctUntilChanged
    );
    // Initialize Redux DevTools integration.
    this.initDevTools(options?.devTools);
  }

  /**
   * Internal implementation of getting the state value via BehaviorSubject.
   */
  protected getStateValue() {
    return this.state$.getValue();
  }

  /**
   * Internal implementation of updating the state value via BehaviorSubject.
   */
  protected setStateValue(nextState: S) {
    // Notify the subject and all its subscribers of the new state.
    this.state$.next(nextState);
  }

  /**
   * Returns an observable tracking a specific key within the state object.
   * Only emits when the value of the specified key actually changes.
   */
  getObservableItem<K extends keyof S>(key: K): Observable<S[K]> {
    return this.state$.pipe(
      // Ensure we only emit if the value associated with the key has changed.
      distinctUntilKeyChanged(key),
      // Transform the state object into the specific key value.
      map((state) => state[key])
    );
  }

  /**
   * Returns an observable tracking the entire state object.
   * Can be configured to emit only when the state object effectively changes.
   */
  getObservable(options: StateObservableOptions = {}): Observable<S> {
    // Determine whether distinct emissions are enabled.
    const useDistinctUntilChanged = options.useDistinctUntilChanged ?? this.distinctOptions.enabled;

    // If distinct emissions are not enabled, return the subject as-is.
    if (!useDistinctUntilChanged) {
      return this.state$;
    }

    // Apply the distinctUntilChanged operator to filter out redundant updates.
    return this.state$.pipe(
      distinctUntilChanged((previous, next) => {
        // Use the resolved comparator to compare the previous and next states.
        return this.distinctOptions.comparator(previous, next);
      })
    );
  }

  /**
   * Subscribes a listener function to state changes via the internal observable.
   * Overloaded to handle both void and state-receiving listeners.
   */
  subscribe(listener: () => void): () => void;
  subscribe(listener: (value: S) => void): () => void;
  subscribe(listener: (value: S) => void) {
    // Subscribe to the state observable and call the listener on each emission.
    const subscription = this.getObservable().subscribe((nextState) => {
      listener(nextState);
    });
    // Return an unsubscribe function to properly clean up the RxJS subscription.
    return () => subscription.unsubscribe();
  }
}
