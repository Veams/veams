/**
 * Redux DevTools extension types and constants.
 */

/**
 * Interface for messages dispatched from the Redux DevTools extension.
 */
export interface MessagePayload {
  // Type of the message (e.g., 'DISPATCH').
  type: string;
  // Details about the message, including action type and state.
  payload: {
    // Specific type of the dispatch action (e.g., 'RESET', 'JUMP_TO_STATE').
    type: string;
    // Index of the state in the history.
    stateIndex?: number;
    // Unique ID for the action.
    id?: string;
  };
  // Current state of the store in the DevTools as a JSON string.
  state: string;
}

/**
 * Interface for the Redux DevTools instance returned by the extension.
 */
export interface DevTools {
  // Method to send a new state update to the DevTools extension.
  send: (action: string, state: unknown) => void;
  // Method to subscribe to changes coming from the DevTools extension.
  subscribe: (listener: (message: MessagePayload) => void) => () => void;
  // Method to initialize the state in the DevTools extension.
  init: (state: unknown) => void;
}

/**
 * Interface for Redux DevTools connection options.
 */
export interface DevToolsConnectionOptions {
  // Name to be displayed for the store in the DevTools window.
  name?: string;
  // Unique ID for the DevTools instance.
  instanceId?: string;
  // Action creators that will be available in the DevTools UI.
  actionCreators?: unknown;
  // Configuration for specific DevTools features to enable or disable.
  features?: {
    pause?: boolean;
    lock?: boolean;
    persist?: boolean;
    export?: boolean | 'custom';
    import?: boolean | 'custom';
    jump?: boolean;
    skip?: boolean;
    reorder?: boolean;
    dispatch?: boolean;
    test?: boolean;
  };
}

/**
 * Connects the state handler to the Redux DevTools browser extension.
 * Returns a DevTools object to communicate with the extension.
 */
export function withDevTools(initialState: unknown, options: DevToolsConnectionOptions): DevTools | null {
  // Check if the Redux DevTools extension is available in the browser.
  const extension = (globalThis as any)?.__REDUX_DEVTOOLS_EXTENSION__;

  // If the extension is not found, we cannot connect.
  if (!extension) {
    return null;
  }

  // Connect to the extension and get an instance.
  const devTools = extension.connect(options);

  // Initialize the DevTools instance with the initial state.
  devTools.init(initialState);

  // Return an interface to interact with the extension.
  return {
    // Send a new action and state to the DevTools.
    send: (action: string, state: unknown) => devTools.send(action, state),
    // Subscribe to events coming from the DevTools.
    subscribe: (listener: (message: MessagePayload) => void) => devTools.subscribe(listener),
    // Re-initialize the state in the extension.
    init: (state: unknown) => devTools.init(state),
  };
}
