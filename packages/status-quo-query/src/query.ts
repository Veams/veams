import {
  type FetchStatus,
  type InvalidateOptions,
  type InvalidateQueryFilters,
  type QueryClient,
  type QueryFunction,
  type QueryKey,
  QueryObserver,
  type QueryObserverOptions,
  type QueryObserverResult,
  type RefetchOptions,
  type QueryStatus as TanstackQueryStatus,
} from '@tanstack/query-core';

export type QueryFetchStatus = FetchStatus;
export type QueryStatus = TanstackQueryStatus;

export interface QueryServiceSnapshot<TData, TError> {
  data: TData | undefined;
  error: TError | null;
  fetchStatus: QueryFetchStatus;
  status: QueryStatus;
  isError: boolean;
  isFetching: boolean;
  isPending: boolean;
  isSuccess: boolean;
}

export interface QueryMetaState {
  fetchStatus: QueryFetchStatus;
  status: QueryStatus;
}

export interface QueryService<TData, TError> {
  getSnapshot: () => QueryServiceSnapshot<TData, TError>;
  subscribe: (listener: (snapshot: QueryServiceSnapshot<TData, TError>) => void) => () => void;
  refetch: (options?: RefetchOptions) => Promise<QueryServiceSnapshot<TData, TError>>;
  invalidate: (options?: QueryInvalidateOptions) => Promise<void>;
  unsafe_getResult: () => QueryObserverResult<TData, TError>;
}

export interface QueryInvalidateOptions
  extends Pick<InvalidateOptions, 'cancelRefetch' | 'throwOnError'>,
    Pick<InvalidateQueryFilters, 'refetchType'> {}

export interface CreateQuery {
  <
    TQueryFnData = unknown,
    TError = Error,
    TData = TQueryFnData,
    TQueryData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    queryKey: TQueryKey,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: QueryServiceOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
  ): QueryService<TData, TError>;
}

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

export function toQueryMetaState<TData, TError>(
  snapshot: Pick<QueryServiceSnapshot<TData, TError>, 'fetchStatus' | 'status'>
): QueryMetaState {
  return {
    fetchStatus: snapshot.fetchStatus,
    status: snapshot.status,
  };
}

export function isQueryLoading(query: QueryMetaState): boolean {
  return query.status === 'pending' && query.fetchStatus === 'fetching';
}

export function setupQuery(queryClient: QueryClient): CreateQuery {
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
    const observer = new QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>(
      queryClient,
      {
        ...options,
        queryFn,
        queryKey,
      }
    );

    return {
      getSnapshot: () => toQueryServiceSnapshot(observer.getCurrentResult()),
      subscribe: (listener) =>
        observer.subscribe((result) => {
          listener(toQueryServiceSnapshot(result));
        }),
      refetch: async (options) => toQueryServiceSnapshot(await observer.refetch(options)),
      invalidate: (options) =>
        queryClient.invalidateQueries(
          {
            exact: true,
            queryKey,
            ...(options?.refetchType === undefined ? {} : { refetchType: options.refetchType }),
          },
          toInvalidateOptions(options)
        ),
      unsafe_getResult: () => observer.getCurrentResult(),
    };
  };
}

function toQueryServiceSnapshot<TData, TError>(
  result: QueryObserverResult<TData, TError>
): QueryServiceSnapshot<TData, TError> {
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

function toInvalidateOptions(options?: QueryInvalidateOptions): InvalidateOptions | undefined {
  if (options === undefined) {
    return undefined;
  }

  const invalidateOptions: InvalidateOptions = {
    ...(options.cancelRefetch === undefined ? {} : { cancelRefetch: options.cancelRefetch }),
    ...(options.throwOnError === undefined ? {} : { throwOnError: options.throwOnError }),
  };

  return Object.keys(invalidateOptions).length > 0 ? invalidateOptions : undefined;
}
