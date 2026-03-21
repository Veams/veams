/**
 * Common types and interfaces for state management.
 */

/**
 * Interface representing a standard state handler with subscription support.
 * Used by React hooks and other components to interact with the state store.
 * V: The type of the state value.
 * A: The type of the available actions.
 */
export interface StateSubscriptionHandler<V, A> {
  // Method to subscribe a listener to state changes.
  subscribe(listener: () => void): () => void;
  // Method to subscribe a listener that receives the updated state value.
  subscribe(listener: (value: V) => void): () => void;
  // Method to retrieve the current state snapshot.
  getSnapshot: () => V;
  // Method to clean up resources associated with the handler.
  destroy: () => void;
  // Method to retrieve the initial state value.
  getInitialState: () => V;
  // Method to retrieve the set of available actions for this handler.
  getActions: () => A;
}
