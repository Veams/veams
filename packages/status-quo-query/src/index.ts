// Re-export all mutation-related types and functions.
export * from './mutation.js';
// Re-export all query-related types and functions.
export * from './query.js';
// Re-export all provider-related types and functions for cache management.
export * from './provider.js';
// Re-export query registry helpers for memoizing query services by key.
export * from './query-registry.js';
// Re-export tracked dependency types used by the additive tracked facade.
export type {
  TrackedDependencyRecord,
  TrackedDependencyValue,
  TrackedInvalidateOn,
  TrackedMatchMode,
  TrackedQueryKey,
  TrackedQueryKeySegment,
} from './tracking.js';
