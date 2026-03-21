/**
 * Import signal-based state primitives from @preact/signals-core.
 */
import { signal } from '@preact/signals-core';

/**
 * Import internal configuration and the abstract base state handler.
 */
import { resolveDistinctOptions } from '../config/status-quo-config.js';
import { BaseStateHandler } from './base-state-handler.js';

/**
 * Import necessary types for DevTools, distinct update options, and Preact Signals.
 */
import type { DevToolsOptions, DistinctOptions } from '../config/status-quo-config.js';
import type { Signal } from '@preact/signals-core';

/**
 * Props for configuring the SignalStateHandler instance.
 */
type SignalStateHandlerProps<S> = {
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
 * SignalStateHandler: A state handler built on top of Preact Signals.
 * Provides fine-grained reactivity and efficient state updates.
 */
export abstract class SignalStateHandler<S, A> extends BaseStateHandler<S, A> {
  // Internal Signal to manage the state with high performance.
  private readonly state: Signal<S>;
  // Configuration to determine if and how state changes should trigger notifications.
  private readonly distinctOptions: ReturnType<typeof resolveDistinctOptions<S>>;

  /**
   * Initializes the signal state handler with given state and configuration.
   */
  protected constructor({ initialState, options }: SignalStateHandlerProps<S>) {
    // Pass the initial state to the base handler.
    super(initialState);
    // Initialize the internal Signal with the initial state.
    this.state = signal<S>(initialState);
    // Resolve the final distinct options based on provided configuration.
    this.distinctOptions = resolveDistinctOptions(
      options?.distinct,
      options?.useDistinctUntilChanged
    );
    // Initialize Redux DevTools integration.
    this.initDevTools(options?.devTools);
  }

  /**
   * Returns the underlying signal for external use (e.g., in reactive templates).
   */
  getSignal() {
    return this.state;
  }

  /**
   * Subscribes a listener function to state changes via the internal signal.
   * Overloaded to handle both void and state-receiving listeners.
   */
  subscribe(listener: () => void): () => void;
  subscribe(listener: (value: S) => void): () => void;
  subscribe(listener: (value: S) => void) {
    // Track whether the listener has been initialized during the first emission.
    let initialized = false;
    // Keep track of the previous state snapshot for comparison.
    let previousSnapshot = this.state.value;

    // Use the Signal's subscription method.
    return this.state.subscribe((nextState) => {
      // If this is the initial emission, notify the listener and mark as initialized.
      if (!initialized) {
        initialized = true;
        previousSnapshot = nextState;
        listener(nextState);
        return;
      }

      // If distinct mode is enabled and the state hasn't effectively changed, stop here.
      if (
        this.distinctOptions.enabled &&
        this.distinctOptions.comparator(previousSnapshot, nextState)
      ) {
        previousSnapshot = nextState;
        return;
      }

      // Update the previous snapshot and notify the listener.
      previousSnapshot = nextState;
      listener(nextState);
    });
  }

  /**
   * Internal implementation of getting the state value via the Signal's value property.
   */
  protected getStateValue() {
    return this.state.value;
  }

  /**
   * Internal implementation of updating the state value via the Signal's value property.
   */
  protected setStateValue(nextState: S) {
    // Update the Signal's value, which automatically notifies its subscribers.
    this.state.value = nextState;
  }
}
