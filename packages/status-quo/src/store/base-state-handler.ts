/**
 * Import internal configuration and utility functions.
 */
import { resolveDevToolsOptions } from '../config/status-quo-config.js';
import { createSelectorCache, selectWithCache } from '../utils/selector-cache.js';
import { withDevTools } from './dev-tools.js';

/**
 * Import necessary types for state management and Redux DevTools integration.
 */
import type { StateSubscriptionHandler } from '../types/types.js';
import type { EqualityFn, Selector } from '../utils/selector-cache.js';
import type { DevTools, MessagePayload } from './dev-tools.js';
import type { DevToolsOptions } from '../config/status-quo-config.js';

/**
 * Interface for objects that can be subscribed to.
 */
type Subscribable<T> = {
  // Method to subscribe to changes.
  subscribe: (listener: (value: T) => void) => () => void;
  // Optional method to get the current snapshot of the state.
  getSnapshot?: () => T;
};

/**
 * Configuration for Redux DevTools features enabled in this handler.
 */
const devToolsFeatures = {
  pause: true, // Allow pausing the recording of actions.
  lock: true, // Allow locking the state.
  persist: false, // Do not persist state across reloads by default.
  export: true, // Allow exporting the state/actions.
  import: 'custom', // Use custom import logic.
  jump: true, // Allow jumping to specific states.
  skip: true, // Allow skipping specific actions.
  reorder: true, // Allow reordering actions.
  dispatch: false, // Do not allow dispatching actions from DevTools.
  test: false, // Do not generate tests.
};

/**
 * Abstract base class for all state handlers in the system.
 * Implements core logic for initialization, DevTools integration, and subscriptions.
 */
export abstract class BaseStateHandler<S, A> implements StateSubscriptionHandler<S, A> {
  // Stores the initial state passed during construction.
  protected readonly initialState: S;
  // Holds the Redux DevTools instance if enabled.
  protected devTools: DevTools | null = null;

  // Keeps track of active subscriptions to allow for cleanup.
  subscriptions: Array<{ unsubscribe: () => void }> = [];

  /**
   * Initializes the handler with the given initial state.
   */
  protected constructor(initialState: S) {
    this.initialState = initialState;
  }

  /**
   * Sets up Redux DevTools integration based on the provided options.
   */
  protected initDevTools(devToolsOptions?: DevToolsOptions) {
    // Resolve the final DevTools configuration.
    const resolvedOptions = resolveDevToolsOptions(devToolsOptions);

    // If DevTools is disabled, stop here.
    if (!resolvedOptions.enabled) {
      this.devTools = null;
      return;
    }

    // Determine the namespace for the DevTools instance.
    const namespace = devToolsOptions?.namespace ?? this.getDevToolsNamespace();

    // Connect to the Redux DevTools extension.
    this.devTools = withDevTools(this.initialState, {
      name: namespace,
      instanceId: namespace.toLowerCase().replaceAll(' ', '-'),
      actionCreators: this.getActions(),
      features: devToolsFeatures,
    });

    // Subscribe to events coming from the DevTools extension (e.g., time travel).
    this.devTools?.subscribe(this.handleDevToolsEvents);
  }

  /**
   * Returns the initial state of the handler.
   */
  getInitialState() {
    return this.initialState;
  }

  /**
   * Returns the current state.
   */
  getState() {
    return this.getStateValue();
  }

  /**
   * Alias for getState, often used by React's useSyncExternalStore.
   */
  getSnapshot() {
    return this.getState();
  }

  /**
   * Updates the state by merging the partial new state into the current one.
   * Also sends the update to DevTools if enabled.
   */
  setState(newState: Partial<S>, actionName = 'change') {
    // Merge current state with the new partial state.
    const nextState = { ...this.getState(), ...newState };
    // Update the underlying state value (implemented by subclasses).
    this.setStateValue(nextState);
    // Notify DevTools of the state change.
    this.devTools?.send(actionName, nextState);
  }

  /**
   * Cleans up all active subscriptions when the handler is destroyed.
   */
  destroy(): void {
    // Execute the unsubscribe function for each tracked subscription.
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  // Abstract methods to be implemented by concrete handlers for specific state engines (RxJS, Signals, etc.).
  protected abstract getStateValue(): S;
  protected abstract setStateValue(nextState: S): void;

  /**
   * Returns a default namespace for DevTools based on the class name.
   */
  protected getDevToolsNamespace() {
    return this.constructor.name || 'Store';
  }

  /**
   * Binds an external subscribable source to this handler's state.
   * Useful for bridging different state systems.
   */
  protected bindSubscribable<T, Sel>(
    service: Subscribable<T>,
    onChange: (value: Sel) => void,
    selector: Selector<T, Sel>,
    isEqual?: EqualityFn<Sel>
  ): void;
  protected bindSubscribable<T>(service: Subscribable<T>, onChange: (value: T) => void): void;
  protected bindSubscribable<T, Sel = T>(
    service: Subscribable<T>,
    onChange: (value: Sel) => void,
    selector?: Selector<T, Sel>,
    isEqual: EqualityFn<Sel> = Object.is
  ) {
    // Default to identity selector if none is provided.
    const selectorFn = (selector ?? ((value: T) => value as unknown as Sel));
    // Create a cache for selector results to avoid unnecessary updates.
    const selectorCache = createSelectorCache<Sel>();
    // Flag to track if we received an initial value synchronously during subscription.
    let receivedSyncValue = false;

    // Internal function to handle value changes from the external source.
    const notifySelectedValue = (value: T) => {
      receivedSyncValue = true;
      // Extract the selected value and check if it has actually changed.
      const { value: nextSelection, hasChanged } = selectWithCache(
        selectorCache,
        value,
        selectorFn,
        isEqual
      );

      // Only trigger the callback if the selected value changed.
      if (!hasChanged) {
        return;
      }

      onChange(nextSelection);
    };

    // Subscribe to the external source.
    const unsubscribe = service.subscribe(notifySelectedValue);
    // Track the subscription for later cleanup.
    this.subscriptions = [...(this.subscriptions ?? []), { unsubscribe }];

    // If the source has a getSnapshot method and we haven't received a value yet, pull it manually.
    if (service.getSnapshot && !receivedSyncValue) notifySelectedValue(service.getSnapshot());
  }

  // Abstract methods that must be defined by all concrete state handlers.
  abstract subscribe(listener: () => void): () => void;
  abstract subscribe(listener: (value: S) => void): () => void;
  abstract getActions(): A;

  /**
   * Handles messages dispatched from the Redux DevTools extension.
   */
  private handleDevToolsEvents = (message: MessagePayload) => {
    // We only care about DISPATCH type messages (e.g., reset, jump).
    if (message.type !== 'DISPATCH') {
      return;
    }

    switch (message.payload.type) {
      // Revert state to the initial state.
      case 'RESET':
        this.setStateValue(this.getInitialState());
        this.devTools?.init(this.getInitialState());
        break;

      // Commit the current state in DevTools.
      case 'COMMIT':
        this.setStateValue(this.getState());
        this.devTools?.init(this.getState());
        break;

      // Handle time travel actions.
      case 'JUMP_TO_STATE':
      case 'JUMP_TO_ACTION':
        this.setStateValue(JSON.parse(message.state) as S);
        break;

      default:
        break;
    }
  };
}
