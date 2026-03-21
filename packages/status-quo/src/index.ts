/**
 * Main entry point for the Status Quo state management library.
 * Exports core functionality for both store and React integration.
 */

// Import internal setup functions and core state handlers.
import { setupStatusQuo } from './config/status-quo-config.js';
import {
  BaseStateHandler,
  makeStateSingleton,
  NativeStateHandler,
  ObservableStateHandler,
  SignalStateHandler,
} from './store';

// Import necessary types for external use.
import type {
  DevToolsOptions,
  GlobalDevToolsOptions,
  DistinctComparator,
  DistinctOptions,
  StatusQuoConfig,
} from './config/status-quo-config.js';
import type { StateSingleton, StateSingletonOptions } from './store';
import type { StateSubscriptionHandler } from './types/types.js';

/**
 * Core state management functions and classes.
 */
export {
  // Abstract base class for all state handlers.
  BaseStateHandler,
  // Factory function for creating singleton state handlers.
  makeStateSingleton,
  // Lightweight state handler using plain JavaScript.
  NativeStateHandler,
  // State handler powered by RxJS BehaviorSubjects.
  ObservableStateHandler,
  // Global configuration function for Status Quo.
  setupStatusQuo,
  // State handler powered by Preact Signals.
  SignalStateHandler,
};

/**
 * Type definitions for public API.
 */
export type {
  // Options for Redux DevTools integration.
  DevToolsOptions,
  // Global options for Redux DevTools.
  GlobalDevToolsOptions,
  // Function signature for state equality comparisons.
  DistinctComparator,
  // Options for configuring distinct updates.
  DistinctOptions,
  // Interface representing a singleton state handler.
  StateSingleton,
  // Options for configuring state singleton instances.
  StateSingletonOptions,
  // Interface representing a standard state subscription handler.
  StateSubscriptionHandler,
  // Main configuration object for the Status Quo system.
  StatusQuoConfig,
};
