export type DistinctComparator<T = unknown> = (previous: T, next: T) => boolean;

export type DistinctOptions<T = unknown> = {
  enabled?: boolean;
  comparator?: DistinctComparator<T>;
};

export type StatusQuoConfig<T = unknown> = {
  distinct?: DistinctOptions<T>;
};

type ResolvedDistinctOptions<T = unknown> = {
  enabled: boolean;
  comparator: DistinctComparator<T>;
};

type ResolvedStatusQuoConfig = {
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
    distinct: {
      enabled: true,
      comparator: distinctAsJson,
    },
  };
}

let statusQuoConfig = createDefaultStatusQuoConfig();

export function setupStatusQuo<T = unknown>(config: StatusQuoConfig<T> = {}) {
  statusQuoConfig = {
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
      statusQuoConfig.distinct.comparator) as DistinctComparator<T>,
  };
}

export function getStatusQuoConfig() {
  return {
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
