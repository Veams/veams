export type DistinctComparator<T = unknown> = (previous: T, next: T) => boolean;

export type DistinctOptions<T = unknown> = {
  enabled?: boolean;
  comparator?: DistinctComparator<T>;
};

export type DevToolsOptions = {
  enabled?: boolean;
  namespace?: string;
};

export type GlobalDevToolsOptions = {
  enabled?: boolean;
};

export type StatusQuoConfig<T = unknown> = {
  devTools?: GlobalDevToolsOptions;
  distinct?: DistinctOptions<T>;
};

type ResolvedDistinctOptions<T = unknown> = {
  enabled: boolean;
  comparator: DistinctComparator<T>;
};

type ResolvedDevToolsOptions = {
  enabled: boolean;
};

type ResolvedStatusQuoConfig = {
  devTools: ResolvedDevToolsOptions;
  distinct: ResolvedDistinctOptions;
};

function distinctAsJson(previous: unknown, next: unknown) {
  if (Object.is(previous, next)) {
    return true;
  }

  try {
    return JSON.stringify(previous) === JSON.stringify(next);
  } catch {
    return false;
  }
}

function createDefaultStatusQuoConfig(): ResolvedStatusQuoConfig {
  return {
    devTools: {
      enabled: false,
    },
    distinct: {
      enabled: true,
      comparator: distinctAsJson,
    },
  };
}

let statusQuoConfig = createDefaultStatusQuoConfig();

export function setupStatusQuo<T = unknown>(config: StatusQuoConfig<T> = {}) {
  statusQuoConfig = {
    devTools: {
      enabled: config.devTools?.enabled ?? false,
    },
    distinct: {
      enabled: config.distinct?.enabled ?? true,
      comparator: (config.distinct?.comparator ?? distinctAsJson) as DistinctComparator,
    },
  };
}

export function resolveDistinctOptions<T>(
  options?: DistinctOptions<T>,
  useDistinctUntilChanged?: boolean
): ResolvedDistinctOptions<T> {
  return {
    enabled: options?.enabled ?? useDistinctUntilChanged ?? statusQuoConfig.distinct.enabled,
    comparator: (options?.comparator ??
      statusQuoConfig.distinct.comparator),
  };
}

export function resolveDevToolsOptions(options?: DevToolsOptions): ResolvedDevToolsOptions {
  return {
    enabled: options?.enabled ?? statusQuoConfig.devTools.enabled,
  };
}

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

/** @internal testing helper */
export function resetStatusQuoForTests() {
  statusQuoConfig = createDefaultStatusQuoConfig();
}
