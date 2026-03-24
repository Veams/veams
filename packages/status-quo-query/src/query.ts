import {
  // Import the fetch status enum (idle, fetching, paused).
  type FetchStatus,
  // Import options for invalidating queries from the cache.
  type InvalidateOptions,
  // Import filters to target specific queries during invalidation.
  type InvalidateQueryFilters,
  // Import the central QueryClient to interact with the cache.
  type QueryClient,
  // Import the function signature for an individual query.
  type QueryFunction,
  // Import the stable identifier for a specific query in the cache.
  type QueryKey,
  // Import QueryObserver to monitor and manage individual queries.
  QueryObserver,
  type QueryOptions,
  // Import configuration options for the query observer.
  type QueryObserverOptions,
  // Import the result shape returned by the query observer.
  type QueryObserverResult,
  // Import options for manually refetching a query.
  type RefetchOptions,
  // Import the status enum for query results (pending, success, error).
  type QueryStatus as TanstackQueryStatus,
} from '@tanstack/query-core';

import {
  type TrackedDependencyRecord,
  type TrackingRegistry,
  type TrackedQueryKey,
  extractTrackedDependencies,
} from './tracking';

// Re-export FetchStatus and QueryStatus for internal naming consistency.
export type QueryFetchStatus = FetchStatus;
export type QueryStatus = TanstackQueryStatus;

/**
 * Represents a stable snapshot of the query service's state.
 */
export interface QueryServiceSnapshot<TData, TError> {
  // The data retrieved from a successful query.
  data: TData | undefined;
  // The error object if the query failed.
  error: TError | null;
  // The current network fetch status (idle, fetching, paused).
  fetchStatus: QueryFetchStatus;
  // The current lifecycle status of the query (pending, success, error).
  status: QueryStatus;
  // Convenience flag: true if the status is 'error'.
  isError: boolean;
  // Convenience flag: true if the query is currently fetching data.
  isFetching: boolean;
  // Convenience flag: true if the query is in the pending state.
  isPending: boolean;
  // Convenience flag: true if the status is 'success'.
  isSuccess: boolean;
}

/**
 * Defines a subset of query state containing only the status and fetch status.
 */
export interface QueryMetaState {
  fetchStatus: QueryFetchStatus;
  status: QueryStatus;
}

/**
 * Defines the public API for a query service.
 */
export interface QueryService<TData, TError> {
  // Returns the current state snapshot of the query.
  getSnapshot: () => QueryServiceSnapshot<TData, TError>;
  // Subscribes a listener to state changes; returns an unsubscribe function.
  subscribe: (listener: (snapshot: QueryServiceSnapshot<TData, TError>) => void) => () => void;
  // Manually triggers a refetch of this query.
  refetch: (options?: RefetchOptions) => Promise<QueryServiceSnapshot<TData, TError>>;
  // Marks this specific query as invalid in the cache to trigger a refetch if active.
  invalidate: (options?: QueryInvalidateOptions) => Promise<void>;
  // Escape hatch: provides direct access to the underlying Tanstack Query observer result.
  unsafe_getResult: () => QueryObserverResult<TData, TError>;
}

/**
 * Combines options for invalidation behavior and filtering.
 */
export interface QueryInvalidateOptions
  extends Pick<InvalidateOptions, 'cancelRefetch' | 'throwOnError'>,
    Pick<InvalidateQueryFilters, 'refetchType'> {}

/**
 * Function signature for the query factory.
 */
export interface CreateQuery {
  <
    TQueryFnData = unknown,
    TError = Error,
    TData = TQueryFnData,
    TQueryData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    // The key that uniquely identifies the query in the cache.
    queryKey: TQueryKey,
    // The asynchronous function that performs the data fetch.
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    // Optional configuration for behavior like staleness, retry, and refetching.
    options?: QueryServiceOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
  ): QueryService<TData, TError>;
}

/**
 * Function signature for tracked queries that derive dependencies from the final query-key segment.
 *
 * The tracked query handle deliberately stays API-compatible with the normal query service.
 * The only extra behavior is invisible: dependency registration and on-demand re-registration.
 */
export interface CreateTrackedQuery {
  <
    TDeps extends TrackedDependencyRecord,
    TQueryFnData = unknown,
    TError = Error,
    TData = TQueryFnData,
    TQueryData = TQueryFnData,
    TQueryKey extends TrackedQueryKey<TDeps> = TrackedQueryKey<TDeps>,
  >(
    queryKey: TQueryKey,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: QueryServiceOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
  ): QueryService<TData, TError>;
}

/**
 * Configuration options for creating a query service, excluding function and key.
 */
export type QueryServiceOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
  'queryFn' | 'queryKey'
>;

/**
 * Extracts and maps status and fetchStatus to our QueryMetaState interface.
 */
export function toQueryMetaState<TData, TError>(
  snapshot: Pick<QueryServiceSnapshot<TData, TError>, 'fetchStatus' | 'status'>
): QueryMetaState {
  // Return a simplified state object for UI or other services.
  return {
    fetchStatus: snapshot.fetchStatus,
    status: snapshot.status,
  };
}

/**
 * Helper function to check if the query is in its initial loading state.
 */
export function isQueryLoading(query: QueryMetaState): boolean {
  // Returns true if the query is both pending and actively fetching.
  return query.status === 'pending' && query.fetchStatus === 'fetching';
}

/**
 * Prepares the query factory by binding it to a specific QueryClient instance.
 */
export function setupQuery(queryClient: QueryClient): CreateQuery {
  // Returns the actual factory function for creating individual query services.
  return function createQuery<
    TQueryFnData = unknown,
    TError = Error,
    TData = TQueryFnData,
    TQueryData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    queryKey: TQueryKey,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: QueryServiceOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
  ): QueryService<TData, TError> {
    return createQueryService(queryClient, queryKey, queryFn, options).service;
  };
}

/**
 * Prepares a tracked query factory that registers and re-registers query dependencies on demand.
 *
 * Tracked queries register immediately on creation, but TanStack is still free to garbage-collect
 * the underlying query when it becomes idle. When that happens, the provider-level cache
 * subscription removes the old query hash from the tracking registry.
 *
 * A later `refetch()` or first subscription can rebuild the TanStack query. That is why tracked
 * query handles call `ensureRegistered()` before they become active again.
 */
export function setupTrackedQuery(
  queryClient: QueryClient,
  trackingRegistry: TrackingRegistry
): CreateTrackedQuery {
  return function createTrackedQuery<
    TDeps extends TrackedDependencyRecord,
    TQueryFnData = unknown,
    TError = Error,
    TData = TQueryFnData,
    TQueryData = TQueryFnData,
    TQueryKey extends TrackedQueryKey<TDeps> = TrackedQueryKey<TDeps>,
  >(
    queryKey: TQueryKey,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: QueryServiceOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
  ): QueryService<TData, TError> {
    // Validate and normalize the dependency entries once when the handle is created.
    const dependencies = extractTrackedDependencies(queryKey);
    // Reuse the same core query service implementation as the untracked API.
    const service = createQueryService(queryClient, queryKey, queryFn, options);
    // We only need re-registration on the transition from zero to one subscribers.
    let subscriberCount = 0;

    // Register the current query hash immediately so future tracked mutations can find it.
    trackingRegistry.register(service.observer.getCurrentQuery().queryHash, dependencies);

    const ensureRegistered = () => {
      // Build resolves the current live TanStack query for the stored observer options. This is
      // the same mechanism TanStack uses internally when a query gets recreated after GC.
      const liveQuery = queryClient.getQueryCache().build(
        queryClient,
        toQueryOptions(queryKey, queryFn, options)
      );

      // Re-register only when TanStack has recreated the query and the registry has already
      // cleaned up the previous hash. This keeps the edge-case handling cheap in the common case.
      if (!trackingRegistry.has(liveQuery.queryHash)) {
        trackingRegistry.register(liveQuery.queryHash, dependencies);
      }
    };

    return {
      ...service.service,
      refetch: async (refetchOptions) => {
        // Refetch is one of the two explicit reactivation paths agreed on in the design.
        ensureRegistered();
        return service.service.refetch(refetchOptions);
      },
      subscribe: (listener) => {
        // The first active subscriber is the other reactivation path. Re-running registration
        // here makes a previously removed query visible to tracked invalidation again.
        if (subscriberCount === 0) {
          ensureRegistered();
        }

        subscriberCount += 1;

        const unsubscribe = service.service.subscribe(listener);

        return () => {
          // Keep the counter bounded so accidental double-unsubscribe cannot push it negative.
          subscriberCount = Math.max(0, subscriberCount - 1);
          unsubscribe();
        };
      },
    };
  };
}

/**
 * Internal helper to transform a raw Tanstack query result into our public snapshot format.
 */
function toQueryServiceSnapshot<TData, TError>(
  result: QueryObserverResult<TData, TError>
): QueryServiceSnapshot<TData, TError> {
  // Extract and return the relevant fields for the UI or other services.
  return {
    data: result.data,
    error: result.error,
    fetchStatus: result.fetchStatus,
    status: result.status,
    isError: result.isError,
    isFetching: result.isFetching,
    isPending: result.isPending,
    isSuccess: result.isSuccess,
  };
}

function createQueryService<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: QueryServiceOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
): {
  // Expose the observer internally so tracked queries can access the current query hash.
  observer: QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>;
  // Preserve the public query-service shape for all callers.
  service: QueryService<TData, TError>;
} {
  const observer = new QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>(
    queryClient,
    toQueryOptions(queryKey, queryFn, options)
  );

  return {
    observer,
    service: {
      getSnapshot: () => toQueryServiceSnapshot(observer.getCurrentResult()),
      subscribe: (listener) =>
        observer.subscribe((result) => {
          listener(toQueryServiceSnapshot(result));
        }),
      refetch: async (refetchOptions) =>
        toQueryServiceSnapshot(await observer.refetch(refetchOptions)),
      invalidate: (invalidateOptions) =>
        queryClient.invalidateQueries(
          {
            exact: true,
            queryKey,
            ...(invalidateOptions?.refetchType === undefined
              ? {}
              : { refetchType: invalidateOptions.refetchType }),
          },
          toInvalidateOptions(invalidateOptions)
        ),
      unsafe_getResult: () => observer.getCurrentResult(),
    },
  };
}

function toQueryOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: QueryServiceOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
): QueryOptions<TQueryFnData, TError, TQueryData, TQueryKey> &
  QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey> {
  // Centralize option assembly so both normal queries and tracked queries build observers and
  // live TanStack query instances from exactly the same inputs.
  return {
    ...options,
    queryFn,
    queryKey,
  };
}

/**
 * Internal helper to safely transform our QueryInvalidateOptions to Tanstack InvalidateOptions.
 */
function toInvalidateOptions(options?: QueryInvalidateOptions): InvalidateOptions | undefined {
  // Return undefined if no options were provided.
  if (options === undefined) {
    return undefined;
  }

  // Construct and filter the options object to avoid passing undefined values.
  const invalidateOptions: InvalidateOptions = {
    ...(options.cancelRefetch === undefined ? {} : { cancelRefetch: options.cancelRefetch }),
    ...(options.throwOnError === undefined ? {} : { throwOnError: options.throwOnError }),
  };

  // Return the resulting object if it contains any relevant properties.
  return Object.keys(invalidateOptions).length > 0 ? invalidateOptions : undefined;
}
