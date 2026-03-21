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
  // Import configuration options for the query observer.
  type QueryObserverOptions,
  // Import the result shape returned by the query observer.
  type QueryObserverResult,
  // Import options for manually refetching a query.
  type RefetchOptions,
  // Import the status enum for query results (pending, success, error).
  type QueryStatus as TanstackQueryStatus,
} from '@tanstack/query-core';

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
    // Create a new QueryObserver instance to manage this specific query's lifecycle.
    const observer = new QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>(
      queryClient,
      {
        ...options,
        queryFn,
        queryKey,
      }
    );

    // Return the implementation of the QueryService interface.
    return {
      // Map the current observer state to our service's snapshot format.
      getSnapshot: () => toQueryServiceSnapshot(observer.getCurrentResult()),
      // Subscribe to observer changes and notify the listener with updated snapshots.
      subscribe: (listener) =>
        observer.subscribe((result) => {
          listener(toQueryServiceSnapshot(result));
        }),
      // Proxy the refetch call and map the async result back to a snapshot.
      refetch: async (options) => toQueryServiceSnapshot(await observer.refetch(options)),
      // Trigger a targeted invalidation using the query's key and custom options.
      invalidate: (options) =>
        queryClient.invalidateQueries(
          {
            exact: true,
            queryKey,
            ...(options?.refetchType === undefined ? {} : { refetchType: options.refetchType }),
          },
          toInvalidateOptions(options)
        ),
      // Provide direct access to the raw observer result when needed.
      unsafe_getResult: () => observer.getCurrentResult(),
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
