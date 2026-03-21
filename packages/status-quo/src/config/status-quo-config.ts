/**
 * Global configuration and utility functions for Status Quo state management.
 */

// Function signature for comparing state objects to determine if they are distinct.
export type DistinctComparator<T = unknown> = (previous: T, next: T) => boolean;

// Options for configuring distinct emission behavior in state handlers.
export type DistinctOptions<T = unknown> = {
  // Whether distinct updates are enabled.
  enabled?: boolean;
  // Custom function to compare states for equality.
  comparator?: DistinctComparator<T>;
};

// Options for configuring Redux DevTools integration for a specific state handler.
export type DevToolsOptions = {
  // Whether DevTools integration is enabled for this handler.
  enabled?: boolean;
  // Namespace for the store in the DevTools window.
  namespace?: string;
};

// Global options for Redux DevTools integration across all handlers.
export type GlobalDevToolsOptions = {
  // Whether DevTools integration is enabled globally.
  enabled?: boolean;
};

// Main configuration object for the Status Quo system.
export type StatusQuoConfig<T = unknown> = {
  // Global DevTools configuration.
  devTools?: GlobalDevToolsOptions;
  // Global distinct emission configuration.
  distinct?: DistinctOptions<T>;
};

// Internal representation of resolved distinct options.
type ResolvedDistinctOptions<T = unknown> = {
  // Final enabled status for distinct updates.
  enabled: boolean;
  // Final comparator function to use for equality checks.
  comparator: DistinctComparator<T>;
};

// Internal representation of resolved DevTools options.
type ResolvedDevToolsOptions = {
  // Final enabled status for DevTools.
  enabled: boolean;
};

// Internal representation of the full resolved configuration.
type ResolvedStatusQuoConfig = {
  // Resolved global DevTools configuration.
  devTools: ResolvedDevToolsOptions;
  // Resolved global distinct emission configuration.
  distinct: ResolvedDistinctOptions;
};

/**
 * Default comparator function that uses referential equality (Object.is)
 * and falls back to JSON stringification for structural equality.
 */
function distinctAsJson(previous: unknown, next: unknown) {
  // Fast path for referential equality.
  if (Object.is(previous, next)) {
    return true;
  }

  // Structural comparison using JSON stringification as a fallback.
  try {
    return JSON.stringify(previous) === JSON.stringify(next);
  } catch {
    // If stringification fails, assume they are not equal.
    return false;
  }
}

/**
 * Creates the default Status Quo configuration.
 */
function createDefaultStatusQuoConfig(): ResolvedStatusQuoConfig {
  return {
    // DevTools integration is disabled by default.
    devTools: {
      enabled: false,
    },
    // Distinct emission is enabled by default with JSON-based structural equality.
    distinct: {
      enabled: true,
      comparator: distinctAsJson,
    },
  };
}

// Global configuration instance, initialized with defaults.
let statusQuoConfig = createDefaultStatusQuoConfig();

/**
 * Global setup function to configure Status Quo.
 */
export function setupStatusQuo<T = unknown>(config: StatusQuoConfig<T> = {}) {
  // Merge the provided configuration with the current global config.
  statusQuoConfig = {
    // Update global DevTools status.
    devTools: {
      enabled: config.devTools?.enabled ?? false,
    },
    // Update global distinct emission status and comparator.
    distinct: {
      enabled: config.distinct?.enabled ?? true,
      comparator: (config.distinct?.comparator ?? distinctAsJson) as DistinctComparator,
    },
  };
}

/**
 * Resolves the final distinct options for a specific state handler.
 * Combines global configuration with handler-specific overrides.
 */
export function resolveDistinctOptions<T>(
  // Handler-specific distinct options.
  options?: DistinctOptions<T>,
  // Boolean flag often used to override or determine enabled status.
  useDistinctUntilChanged?: boolean
): ResolvedDistinctOptions<T> {
  return {
    // Determine the enabled status for distinct emissions.
    enabled: options?.enabled ?? useDistinctUntilChanged ?? statusQuoConfig.distinct.enabled,
    // Determine the comparator function to use.
    comparator: (options?.comparator ??
      statusQuoConfig.distinct.comparator),
  };
}

/**
 * Resolves the final DevTools options for a specific state handler.
 * Combines global configuration with handler-specific overrides.
 */
export function resolveDevToolsOptions(options?: DevToolsOptions): ResolvedDevToolsOptions {
  return {
    // Determine the enabled status for DevTools integration.
    enabled: options?.enabled ?? statusQuoConfig.devTools.enabled,
  };
}

/**
 * Returns a copy of the current global configuration.
 */
export function getStatusQuoConfig() {
  return {
    devTools: {
      enabled: statusQuoConfig.devTools.enabled,
    },
    distinct: {
      enabled: statusQuoConfig.distinct.enabled,
      comparator: statusQuoConfig.distinct.comparator,
    },
  } as ResolvedStatusQuoConfig;
}

/**
 * Resets the Status Quo configuration to its default values.
 * Useful for ensuring test isolation in unit tests.
 * @internal testing helper
 */
export function resetStatusQuoForTests() {
  statusQuoConfig = createDefaultStatusQuoConfig();
}
