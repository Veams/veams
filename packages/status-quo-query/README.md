# @veams/status-quo-query

TanStack Query service helpers with a small subscribable surface that fits naturally into the StatusQuo ecosystem.

## Install

```bash
npm install @veams/status-quo-query @tanstack/query-core
```

## Package Exports

Root exports:

- `setupQueryManager`
- `setupQuery`
- `setupMutation`
- `isQueryLoading`
- `toQueryMetaState`
- `QueryFetchStatus`
- `QueryStatus`
- `MutationStatus`
- `QueryManager`
- `CreateQuery`
- `CreateMutation`
- `QueryService`
- `MutationService`
- `QueryServiceSnapshot`
- `MutationServiceSnapshot`
- `QueryServiceOptions`
- `MutationServiceOptions`
- `QueryInvalidateOptions`
- `QueryMetaState`

Subpath exports:

- `@veams/status-quo-query/provider`
- `@veams/status-quo-query/query`
- `@veams/status-quo-query/mutation`

## Quickstart

```ts
import { QueryClient } from '@tanstack/query-core';
import {
  setupQueryManager,
} from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);

const userQuery = manager.createQuery(['user', 42], () => fetchUser(42), {
  enabled: false,
});
await userQuery.refetch();
await userQuery.invalidate({ refetchType: 'none' });

const updateUser = manager.createMutation((payload: UpdateUserPayload) => saveUser(payload));
await updateUser.mutate({ id: 42 });

await manager.invalidateQueries({ queryKey: ['user'] });
manager.setQueryData(['user', 42], (current) => current);
```

## API

### `setupQueryManager(queryClient)`

Creates the package-level query manager facade around an existing TanStack `QueryClient`.

Returns `QueryManager` with:

- `createQuery(queryKey, queryFn, options?)`
- `createMutation(mutationFn, options?)`
- `cancelQueries(...)`
- `getQueryData(...)`
- `invalidateQueries(...)`
- `refetchQueries(...)`
- `removeQueries(...)`
- `resetQueries(...)`
- `setQueryData(...)`
- `unsafe_getClient()`

All manager methods forward directly to the corresponding `QueryClient` methods. `unsafe_getClient()` returns the raw TanStack client as an explicit escape hatch.

### `setupQuery(queryClient)`

Creates a `createQuery` factory bound to a `QueryClient`.

`createQuery(queryKey, queryFn, options?)` returns `QueryService<TData, TError>`.

`QueryServiceOptions` is based on TanStack `QueryObserverOptions`, without `queryKey` and `queryFn` because those are provided directly to `createQuery`.

`QueryService` methods:

- `getSnapshot()`
- `subscribe(listener)`
- `refetch(options?)`
- `invalidate(options?)`
- `unsafe_getResult()`

`QueryServiceSnapshot<TData, TError>` fields:

- `data`
- `error`
- `fetchStatus`
- `status`
- `isError`
- `isFetching`
- `isPending`
- `isSuccess`

`invalidate(options?)` invalidates the query by its exact key. `QueryInvalidateOptions` supports:

- `refetchType`
- `cancelRefetch`
- `throwOnError`

`unsafe_getResult()` returns the raw TanStack `QueryObserverResult`.

### `setupMutation(queryClient)`

Creates a `createMutation` factory bound to a `QueryClient`.

`createMutation(mutationFn, options?)` returns `MutationService<TData, TError, TVariables, TOnMutateResult>`.

`MutationServiceOptions` is based on TanStack `MutationObserverOptions`, without `mutationFn` because it is provided directly to `createMutation`.

`MutationService` methods:

- `getSnapshot()`
- `subscribe(listener)`
- `mutate(variables, options?)`
- `reset()`
- `unsafe_getResult()`

`MutationServiceSnapshot<TData, TError, TVariables>` fields:

- `data`
- `error`
- `status`
- `variables`
- `isError`
- `isIdle`
- `isPending`
- `isSuccess`

`unsafe_getResult()` returns the raw TanStack `MutationObserverResult`.

### Query Helpers

`toQueryMetaState(snapshot)` reduces a query snapshot to:

- `status`
- `fetchStatus`

`isQueryLoading(metaState)` returns `true` when:

- `status === 'pending'`
- `fetchStatus === 'fetching'`

### Status Types

- `QueryFetchStatus` re-exports TanStack `FetchStatus`
- `QueryStatus` re-exports TanStack query status
- `MutationStatus` re-exports TanStack mutation status

## Design Notes

- `getSnapshot()` always returns passive state only.
- Commands live on the handle itself: `refetch`, `invalidate`, `mutate`, `reset`.
- Raw TanStack observer and client access is explicit through `unsafe_getResult()` and `unsafe_getClient()`.
- Manager-level operations live on `setupQueryManager()`, not on individual snapshots.
