import {
  type QueryClient,
} from '@tanstack/query-core';

import { type CreateMutation, setupMutation } from './mutation';
import { type CreateQuery, setupQuery } from './query';

export interface CacheApi {
  createMutation: CreateMutation;
  createQuery: CreateQuery;
  cancelQueries: QueryClient['cancelQueries'];
  getQueryData: QueryClient['getQueryData'];
  invalidateQueries: QueryClient['invalidateQueries'];
  refetchQueries: QueryClient['refetchQueries'];
  removeQueries: QueryClient['removeQueries'];
  resetQueries: QueryClient['resetQueries'];
  setQueryData: QueryClient['setQueryData'];
  unsafe_getClient: () => QueryClient;
}

export function setupCache(queryClient: QueryClient): CacheApi {
  return {
    createMutation: setupMutation(queryClient),
    createQuery: setupQuery(queryClient),
    cancelQueries: queryClient.cancelQueries.bind(queryClient),
    getQueryData: queryClient.getQueryData.bind(queryClient),
    invalidateQueries: queryClient.invalidateQueries.bind(queryClient),
    refetchQueries: queryClient.refetchQueries.bind(queryClient),
    removeQueries: queryClient.removeQueries.bind(queryClient),
    resetQueries: queryClient.resetQueries.bind(queryClient),
    setQueryData: queryClient.setQueryData.bind(queryClient),
    unsafe_getClient: () => queryClient,
  };
}
