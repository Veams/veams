import {
  // Import the central QueryClient to handle management and state management.
  type QueryClient,
} from '@tanstack/query-core';

// Import mutation and query setup functions and their factory types.
import { type CreateMutation, setupMutation } from './mutation';
import { type CreateQuery, setupQuery } from './query';

/**
 * Defines the public API for the query manager facade.
 */
export interface QueryManager {
  // Factory for creating a mutation service within the context of this provider.
  createMutation: CreateMutation;
  // Factory for creating a query service within the context of this provider.
  createQuery: CreateQuery;
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
  // Return the implementation of the QueryManager interface.
  return {
    // Bind mutation factory to this QueryClient.
    createMutation: setupMutation(queryClient),
    // Bind query factory to this QueryClient.
    createQuery: setupQuery(queryClient),
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
