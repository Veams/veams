import {
  type DefaultError,
  type Query,
  type QueryClient,
  type QueryKey,
} from '@tanstack/query-core';

/**
 * Restrict tracked dependency values to stable primitive cache tokens.
 */
export type TrackedDependencyValue = string | number | boolean | null | undefined;

/**
 * Named dependency map used by tracked queries and mutations.
 */
export type TrackedDependencyRecord = Record<string, TrackedDependencyValue>;

/**
 * Supported tracked invalidation match strategies.
 */
export type TrackedMatchMode = 'intersection' | 'union';

/**
 * Supported tracked invalidation timing hooks.
 */
export type TrackedInvalidateOn = 'success' | 'error' | 'settled';

/**
 * Final tracked key segment that separates dependency and view semantics.
 */
export type TrackedQueryKeySegment<TDeps extends TrackedDependencyRecord = TrackedDependencyRecord> =
  {
    deps: TDeps;
    view?: Record<string, unknown>;
  } & Record<string, unknown>;

/**
 * Tracked query keys must end with a dependency-aware object segment.
 */
export type TrackedQueryKey<TDeps extends TrackedDependencyRecord = TrackedDependencyRecord> =
  readonly [...readonly unknown[], TrackedQueryKeySegment<TDeps>];

export interface TrackedDependencyEntry {
  // Pre-serialized dependency value used as the map key inside the registry.
  key: string;
  // The human-readable dependency name, for example `applicationId`.
  name: string;
  // The original primitive value preserved for debugging and error messages.
  value: TrackedDependencyValue;
}

export interface TrackingRegistry {
  // Quick reverse-index lookup used by tracked queries during re-registration.
  has: (queryHash: string) => boolean;
  // Resolves query hashes by dependency pairs and the chosen match strategy.
  match: (dependencies: readonly TrackedDependencyEntry[], mode: TrackedMatchMode) => Set<string>;
  // Adds or replaces all dependency registrations for a query hash.
  register: (queryHash: string, dependencies: readonly TrackedDependencyEntry[]) => void;
  // Removes a query hash from every dependency bucket it was registered in.
  unregister: (queryHash: string) => void;
}

/**
 * Builds the internal registry that connects named dependency values to TanStack query hashes.
 *
 * We intentionally keep two indexes:
 * - byDependencyName: fast forward lookup for invalidation
 * - byQueryHash: fast reverse lookup for cleanup when TanStack removes a query
 *
 * The reverse index is what lets us react to TanStack `removed` events without scanning the
 * entire registry and without leaking dead query hashes over time.
 */
export function createTrackingRegistry(): TrackingRegistry {
  // Forward index: dependency name -> serialized dependency value -> query hashes.
  const byDependencyName = new Map<string, Map<string, Set<string>>>();
  // Reverse index: query hash -> dependency entries originally registered for that query.
  const byQueryHash = new Map<string, readonly TrackedDependencyEntry[]>();

  return {
    has: (queryHash) => byQueryHash.has(queryHash),
    match: (dependencies, mode) => matchTrackedQueryHashes(byDependencyName, dependencies, mode),
    register: (queryHash, dependencies) => {
      // Re-registration should replace stale mappings instead of accumulating duplicates.
      if (byQueryHash.has(queryHash)) {
        unregisterTrackedQueryHash(byDependencyName, byQueryHash, queryHash);
      }

      byQueryHash.set(queryHash, dependencies);

      for (const dependency of dependencies) {
        // One query can be addressed through several dependency dimensions at once.
        const valueMap = getOrCreateMap(byDependencyName, dependency.name);
        const queryHashes = getOrCreateSet(valueMap, dependency.key);
        queryHashes.add(queryHash);
      }
    },
    unregister: (queryHash) => {
      unregisterTrackedQueryHash(byDependencyName, byQueryHash, queryHash);
    },
  };
}

/**
 * Extracts tracked dependency entries from the final query-key segment.
 *
 * The tracked contract is intentionally strict:
 * - the last query-key segment must be an object
 * - `deps` must exist on that object
 * - only `deps` participates in tracking
 *
 * Everything else in the key, including `view`, is still part of the TanStack cache key,
 * but is ignored for invalidation matching.
 */
export function extractTrackedDependencies(queryKey: QueryKey): readonly TrackedDependencyEntry[] {
  const finalSegment = queryKey.at(-1);

  if (!isPlainObject(finalSegment)) {
    throw new Error(
      'Tracked queries require the final queryKey segment to be an object with a deps property.'
    );
  }

  const dependencies = finalSegment.deps;

  if (!isPlainObject(dependencies)) {
    throw new Error(
      'Tracked queries require queryKey[queryKey.length - 1].deps to be a plain object.'
    );
  }

  return toTrackedDependencyEntries(dependencies, 'Tracked query dependencies');
}

/**
 * Converts a dependency record into normalized registry entries.
 *
 * Normalization happens here so the registry only ever works with one internal shape,
 * regardless of whether the dependencies came from a query key or a mutation resolver.
 */
export function toTrackedDependencyEntries(
  dependencies: Record<string, unknown>,
  contextLabel: string
): readonly TrackedDependencyEntry[] {
  return Object.entries(dependencies).map(([name, value]) => {
    assertTrackedDependencyValue(name, value, contextLabel);

    return {
      key: serializeTrackedDependencyValue(value),
      name,
      value,
    };
  });
}

/**
 * Default dependency resolver used by the paired helper.
 *
 * This is intentionally permissive with partial results. If a mutation variable object only
 * exposes some dependency keys, we track only those keys and let the chosen match mode decide
 * how broad the invalidation should be.
 */
export function pickTrackedDependencies<TVariables>(
  dependencyKeys: readonly string[],
  variables: TVariables
): Partial<Record<string, TrackedDependencyValue>> {
  if (!isRecordLike(variables)) {
    throw new Error(
      'Tracked mutations need object-like variables when using dependencyKeys without resolveDependencies.'
    );
  }

  const resolved: Partial<Record<string, TrackedDependencyValue>> = {};

  for (const dependencyKey of dependencyKeys) {
    if (!(dependencyKey in variables)) {
      continue;
    }

    const value = variables[dependencyKey];
    assertTrackedDependencyValue(
      dependencyKey,
      value,
      'Tracked mutation dependency resolution'
    );
    resolved[dependencyKey] = value;
  }

  return resolved;
}

/**
 * Resolves live TanStack queries from tracked query hashes.
 *
 * The registry may contain hashes that were valid when the invalidation pass started but have
 * already disappeared from TanStack's cache. Filtering to live queries here keeps invalidation
 * exact and avoids relying on stale registry state.
 */
export function resolveTrackedQueries(
  queryClient: QueryClient,
  queryHashes: Iterable<string>
): Array<Query<unknown, DefaultError, unknown, QueryKey>> {
  const queries: Array<Query<unknown, DefaultError, unknown, QueryKey>> = [];

  for (const queryHash of queryHashes) {
    const query = queryClient.getQueryCache().get(queryHash);

    if (query) {
      queries.push(query);
    }
  }

  return queries;
}

function assertTrackedDependencyValue(
  name: string,
  value: unknown,
  contextLabel: string
): asserts value is TrackedDependencyValue {
  if (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return;
  }

  throw new Error(
    `${contextLabel} only support primitive dependency values. "${name}" received ${typeof value}.`
  );
}

function getOrCreateMap<TKey, TValue>(
  map: Map<TKey, Map<string, TValue>>,
  key: TKey
): Map<string, TValue> {
  const existing = map.get(key);

  if (existing) {
    return existing;
  }

  const created = new Map<string, TValue>();
  map.set(key, created);
  return created;
}

function getOrCreateSet<TKey>(map: Map<TKey, Set<string>>, key: TKey): Set<string> {
  const existing = map.get(key);

  if (existing) {
    return existing;
  }

  const created = new Set<string>();
  map.set(key, created);
  return created;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!isRecordLike(value)) {
    return false;
  }

  return (
    Object.getPrototypeOf(value as object) === Object.prototype ||
    Object.getPrototypeOf(value as object) === null
  );
}

function isRecordLike(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function matchTrackedQueryHashes(
  byDependencyName: Map<string, Map<string, Set<string>>>,
  dependencies: readonly TrackedDependencyEntry[],
  mode: TrackedMatchMode
): Set<string> {
  // No dependency input means no automatic invalidation target.
  if (dependencies.length === 0) {
    return new Set<string>();
  }

  if (mode === 'union') {
    // Union broadens invalidation to any query that matches at least one dependency pair.
    const matches = new Set<string>();

    for (const dependency of dependencies) {
      for (const queryHash of getTrackedQueryHashes(byDependencyName, dependency)) {
        matches.add(queryHash);
      }
    }

    return matches;
  }

  // Intersection narrows invalidation to queries that match every provided dependency pair.
  let matches: Set<string> | undefined;

  for (const dependency of dependencies) {
    const queryHashes = getTrackedQueryHashes(byDependencyName, dependency);

    if (queryHashes.size === 0) {
      return new Set<string>();
    }

    if (!matches) {
      matches = new Set(queryHashes);
      continue;
    }

    for (const queryHash of [...matches]) {
      if (!queryHashes.has(queryHash)) {
        matches.delete(queryHash);
      }
    }
  }

  return matches ?? new Set<string>();
}

function getTrackedQueryHashes(
  byDependencyName: Map<string, Map<string, Set<string>>>,
  dependency: TrackedDependencyEntry
): ReadonlySet<string> {
  return byDependencyName.get(dependency.name)?.get(dependency.key) ?? new Set<string>();
}

function serializeTrackedDependencyValue(value: TrackedDependencyValue): string {
  // The registry stores values as strings, so include the primitive type to avoid collisions
  // such as `"1"` and `1` landing in the same bucket.
  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return 'undefined';
  }

  return `${typeof value}:${String(value)}`;
}

function unregisterTrackedQueryHash(
  byDependencyName: Map<string, Map<string, Set<string>>>,
  byQueryHash: Map<string, readonly TrackedDependencyEntry[]>,
  queryHash: string
): void {
  // If the query hash was never tracked or was already cleaned up, there is nothing to do.
  const dependencies = byQueryHash.get(queryHash);

  if (!dependencies) {
    return;
  }

  for (const dependency of dependencies) {
    const valueMap = byDependencyName.get(dependency.name);

    if (!valueMap) {
      continue;
    }

    const queryHashes = valueMap.get(dependency.key);

    if (!queryHashes) {
      continue;
    }

    queryHashes.delete(queryHash);

    // Prune empty buckets so the registry footprint follows the live TanStack cache.
    if (queryHashes.size === 0) {
      valueMap.delete(dependency.key);
    }

    if (valueMap.size === 0) {
      byDependencyName.delete(dependency.name);
    }
  }

  byQueryHash.delete(queryHash);
}
