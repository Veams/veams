import { hashKey } from '@tanstack/query-core';

import type { QueryService } from './query.js';

export interface QueryRegistry<TParams, TKey extends readonly unknown[]> {
  clear: () => void;
  getKey: (params: TParams) => TKey;
  name: string;
  resolve: <TData, TError = Error>(
    params: TParams,
    create: (queryKey: TKey) => QueryService<TData, TError>
  ) => QueryService<TData, TError>;
}

export function createQueryRegistry<TParams, TKey extends readonly unknown[]>(
  name: string,
  createKey: (params: TParams) => TKey
): QueryRegistry<TParams, TKey> {
  const entries = new Map<string, QueryService<unknown, unknown>>();

  return {
    name,
    clear() {
      entries.clear();
    },
    getKey(params) {
      return createKey(params);
    },
    resolve<TData, TError = Error>(
      params: TParams,
      create: (queryKey: TKey) => QueryService<TData, TError>
    ) {
      const queryKey = createKey(params);
      const cacheKey = serializeQueryKey(queryKey);
      const existingEntry = entries.get(cacheKey) as QueryService<TData, TError> | undefined;

      if (existingEntry) {
        return existingEntry;
      }

      const nextEntry = create(queryKey);

      entries.set(cacheKey, nextEntry as QueryService<unknown, unknown>);

      return nextEntry;
    },
  };
}

export function serializeQueryKey(queryKey: readonly unknown[]): string {
  return hashKey(queryKey);
}
