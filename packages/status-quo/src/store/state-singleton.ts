/**
 * Import necessary type for state subscription management.
 */
import type { StateSubscriptionHandler } from '../types/types.js';

/**
 * Interface representing a singleton state handler.
 * Provides a method to get the single instance of a state handler.
 */
export interface StateSingleton<V, A> {
  // Access the singleton instance of the state handler.
  getInstance: () => StateSubscriptionHandler<V, A>;
}

/**
 * Options for configuring the behavior of a state singleton.
 */
export interface StateSingletonOptions {
  // Whether to automatically destroy the instance when no more consumers are active.
  destroyOnNoConsumers?: boolean;
}

/**
 * Factory function to create a singleton state handler.
 * Ensures only one instance of the state handler exists throughout the application.
 */
export function makeStateSingleton<S, A>(
  // Function responsible for creating the state handler instance when needed.
  stateHandlerFactory: () => StateSubscriptionHandler<S, A>,
  // Optional configuration for the singleton.
  { destroyOnNoConsumers = false }: StateSingletonOptions = {}
): StateSingleton<S, A> {
  // Internal variable to store the shared instance of the state handler.
  let instance: StateSubscriptionHandler<S, A> | null = null;

  // The singleton object with an added internal destroy method.
  const singleton: StateSingleton<S, A> & {
    destroyInstance: () => void;
    destroyOnNoConsumers: boolean;
  } = {
    // Expose whether this singleton should be destroyed when not in use.
    destroyOnNoConsumers,
    // Method to get or create the singleton instance.
    getInstance() {
      // If no instance exists, create it using the factory function.
      if (!instance) {
        instance = stateHandlerFactory();
      }

      // Return the current instance.
      return instance;
    },
    // Method to manually destroy the singleton instance and its resources.
    destroyInstance() {
      // If no instance exists, there's nothing to destroy.
      if (!instance) {
        return;
      }

      // Call the destroy method on the instance to clean up its resources.
      instance.destroy();
      // Clear the internal reference to the instance.
      instance = null;
    },
  };

  // Return the created singleton object.
  return singleton;
}
