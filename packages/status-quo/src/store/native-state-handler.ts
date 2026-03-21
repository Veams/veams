/**
 * Import internal configuration and the abstract base state handler.
 */
import { resolveDistinctOptions } from '../config/status-quo-config.js';
import { BaseStateHandler } from './base-state-handler.js';

/**
 * Import necessary types for DevTools and distinct update options.
 */
import type { DevToolsOptions, DistinctOptions } from '../config/status-quo-config.js';

/**
 * Props for configuring the NativeStateHandler instance.
 */
type NativeStateHandlerProps<S> = {
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
 * NativeStateHandler: A lightweight state handler using plain JavaScript.
 * Ideal for minimizing dependencies when neither RxJS nor Signals are required.
 */
export abstract class NativeStateHandler<S, A> extends BaseStateHandler<S, A> {
  // The actual state value stored in memory.
  private state: S;
  // A collection of active listeners to notify when the state changes.
  private readonly listeners: Set<(value: S) => void> = new Set();
  // Configuration to determine if and how state changes should trigger notifications.
  private readonly distinctOptions: ReturnType<typeof resolveDistinctOptions<S>>;

  /**
   * Initializes the native state handler with given state and configuration.
   */
  protected constructor({ initialState, options }: NativeStateHandlerProps<S>) {
    // Pass the initial state to the base handler.
    super(initialState);
    // Set the initial internal state.
    this.state = initialState;
    // Resolve the final distinct options based on provided configuration.
    this.distinctOptions = resolveDistinctOptions(
      options?.distinct,
      options?.useDistinctUntilChanged
    );
    // Initialize Redux DevTools integration.
    this.initDevTools(options?.devTools);
  }

  /**
   * Internal implementation of getting the state value.
   */
  protected getStateValue() {
    return this.state;
  }

  /**
   * Internal implementation of updating the state value.
   */
  protected setStateValue(nextState: S) {
    // Store the previous state to compare against the new state.
    const previousState = this.state;
    // Update the internal state storage.
    this.state = nextState;

    // If distinct mode is enabled and the state hasn't effectively changed, stop here.
    if (this.distinctOptions.enabled && this.distinctOptions.comparator(previousState, nextState)) {
      return;
    }

    // Notify all active listeners of the state update.
    this.listeners.forEach((listener) => listener(nextState));
  }

  /**
   * Subscribes a listener function to state changes.
   * Overloaded to handle both void and state-receiving listeners.
   */
  subscribe(listener: () => void): () => void;
  subscribe(listener: (value: S) => void): () => void;
  subscribe(listener: (value: S) => void) {
    // Register the listener to the active set.
    this.listeners.add(listener);

    // Call the listener immediately with the current state to ensure initial consistency.
    listener(this.state);

    // Return an unsubscribe function to remove the listener from the set.
    return () => {
      this.listeners.delete(listener);
    };
  }
}
