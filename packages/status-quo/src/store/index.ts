/**
 * Export core state handler classes and factory functions.
 */

// Export the abstract base class for all state handlers.
export { BaseStateHandler } from './base-state-handler.js';
// Export the lightweight state handler using plain JavaScript.
export { NativeStateHandler } from './native-state-handler.js';
// Export the state handler powered by RxJS BehaviorSubjects.
export { ObservableStateHandler } from './observable-state-handler.js';
// Export the state handler powered by Preact Signals.
export { SignalStateHandler } from './signal-state-handler.js';

/**
 * Export singleton related types and factory function.
 */

// Export the StateSingleton and StateSingletonOptions interfaces for external typing.
export type { StateSingleton, StateSingletonOptions } from './state-singleton.js';
// Export the factory function to create singleton state handler instances.
export { makeStateSingleton } from './state-singleton.js';
