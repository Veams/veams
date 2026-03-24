import {
  // Import the central QueryClient to handle management and state management.
  type QueryClient,
  type MutationFunction,
} from '@tanstack/query-core';

// Import mutation and query setup functions and their factory types.
import {
  type CreateMutation,
  type CreateUntrackedMutation,
  type MutationService,
  type TrackedMutationServiceOptions,
  setupMutation,
  setupTrackedMutation,
} from './mutation';
import { type CreateQuery, type CreateUntrackedQuery, setupQuery, setupTrackedQuery } from './query';
import {
  createTrackingRegistry,
  type TrackedDependencyValue,
} from './tracking';

/**
 * Mutation factory returned by the paired tracked helper.
 *
 * This omits `dependencyKeys` on purpose because the paired helper already captured those keys
 * once at setup time and injects them automatically for each tracked mutation it creates.
 */
export interface CreateMutationWithDefaults<TDependencyKey extends string> {
  <TData = unknown, TError = Error, TVariables = void, TOnMutateResult = unknown>(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: Omit<
      TrackedMutationServiceOptions<
        Record<TDependencyKey, TrackedDependencyValue>,
        TData,
        TError,
        TVariables,
        TOnMutateResult
      >,
      'dependencyKeys'
    >
  ): MutationService<TData, TError, TVariables, TOnMutateResult>;
}

/**
 * Paired tracked helper that captures dependency keys once for default mutation resolution.
 */
export interface CreateQueryAndMutation {
  <const TDependencyKeys extends readonly string[]>(
    dependencyKeys: TDependencyKeys
  ): readonly [CreateQuery, CreateMutationWithDefaults<TDependencyKeys[number]>];
}

/**
 * Defines the public API for the query manager facade.
 */
export interface QueryManager {
  // Factory for creating a dependency-tracked mutation service within the context of this provider.
  createMutation: CreateMutation;
  // Factory for creating a dependency-tracked query service within the context of this provider.
  createQuery: CreateQuery;
  // Factory for creating an untracked query service within the context of this provider.
  createUntrackedQuery: CreateUntrackedQuery;
  // Factory for creating an untracked mutation service within the context of this provider.
  createUntrackedMutation: CreateUntrackedMutation;
  // Convenience helper that shares dependency keys between tracked queries and mutations.
  createQueryAndMutation: CreateQueryAndMutation;
  // Cancels active queries for the specified filters.
  cancelQueries: QueryClient['cancelQueries'];
  // Synchronously retrieves a snapshot of the current query data.
  getQueryData: QueryClient['getQueryData'];
  // Marks queries as invalid to trigger a refetch if they are active.
  invalidateQueries: QueryClient['invalidateQueries'];
  // Forces a refetch of queries matching the specified filters.
  refetchQueries: QueryClient['refetchQueries'];
  // Removes queries from the management without canceling ongoing requests.
  removeQueries: QueryClient['removeQueries'];
  // Resets queries to their initial state and refetches them.
  resetQueries: QueryClient['resetQueries'];
  // Manually sets or updates data for a specific query in the manager.
  setQueryData: QueryClient['setQueryData'];
  // Escape hatch: provides direct access to the underlying Tanstack QueryClient.
  unsafe_getClient: () => QueryClient;
}

/**
 * Prepares the query manager facade by binding all actions to a specific QueryClient instance.
 */
export function setupQueryManager(queryClient: QueryClient): QueryManager {
  // One shared registry is the whole point of the manager-only tracked API. Queries and
  // mutations created from the same manager can now coordinate invalidation through it.
  const trackingRegistry = createTrackingRegistry();
  const queryFactory = setupTrackedQuery(queryClient, trackingRegistry);
  const mutationFactory = setupTrackedMutation(queryClient, trackingRegistry);
  const untrackedQueryFactory = setupQuery(queryClient);
  const untrackedMutationFactory = setupMutation(queryClient);

  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'removed') {
      // When TanStack GC removes a query from the live cache, drop its hash from our registry too.
      // A later tracked `refetch()` or first `subscribe()` will re-register it if it becomes live
      // again. This keeps the registry aligned with TanStack's actual cache lifetime.
      trackingRegistry.unregister(event.query.queryHash);
    }
  });

  // Return the implementation of the QueryManager interface.
  return {
    // Bind mutation factory to this QueryClient.
    createMutation: mutationFactory,
    // Bind query factory to this QueryClient.
    createQuery: queryFactory,
    // Bind untracked query factory to this QueryClient.
    createUntrackedQuery: untrackedQueryFactory,
    // Bind untracked mutation factory to this QueryClient.
    createUntrackedMutation: untrackedMutationFactory,
    // Provide a paired helper that captures dependency keys once.
    createQueryAndMutation: <const TDependencyKeys extends readonly string[]>(
      dependencyKeys: TDependencyKeys
    ) => {
      const createMutationWithDefaults: CreateMutationWithDefaults<
        TDependencyKeys[number]
      > = <TData = unknown, TError = Error, TVariables = void, TOnMutateResult = unknown>(
        mutationFn: MutationFunction<TData, TVariables>,
        options?: Omit<
          TrackedMutationServiceOptions<
            Record<TDependencyKeys[number], TrackedDependencyValue>,
            TData,
            TError,
            TVariables,
            TOnMutateResult
          >,
          'dependencyKeys'
        >
      ) =>
        // Inject the dependency keys once so the paired mutation factory can derive dependency
        // values directly from mutation variables without repeating the mapping each time.
        mutationFactory<
          Record<TDependencyKeys[number], TrackedDependencyValue>,
          TData,
          TError,
          TVariables,
          TOnMutateResult
        >(mutationFn, {
          ...options,
          dependencyKeys,
        });

      return [queryFactory, createMutationWithDefaults] as const;
    },
    // Proxy for canceling queries with this client context.
    cancelQueries: queryClient.cancelQueries.bind(queryClient),
    // Proxy for retrieving query data with this client context.
    getQueryData: queryClient.getQueryData.bind(queryClient),
    // Proxy for invalidating queries with this client context.
    invalidateQueries: queryClient.invalidateQueries.bind(queryClient),
    // Proxy for refetching queries with this client context.
    refetchQueries: queryClient.refetchQueries.bind(queryClient),
    // Proxy for removing queries with this client context.
    removeQueries: queryClient.removeQueries.bind(queryClient),
    // Proxy for resetting queries with this client context.
    resetQueries: queryClient.resetQueries.bind(queryClient),
    // Proxy for setting query data with this client context.
    setQueryData: queryClient.setQueryData.bind(queryClient),
    // Provide an accessor for the raw client instance.
    unsafe_getClient: () => queryClient,
  };
}
