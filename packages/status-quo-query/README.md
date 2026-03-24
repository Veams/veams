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
- `CreateQueryAndMutation`
- `CreateMutationWithDefaults`
- `CreateUntrackedQuery`
- `CreateUntrackedMutation`
- `QueryService`
- `MutationService`
- `QueryServiceSnapshot`
- `MutationServiceSnapshot`
- `QueryServiceOptions`
- `MutationServiceOptions`
- `TrackedMutationServiceOptions`
- `QueryInvalidateOptions`
- `QueryMetaState`
- `TrackedDependencyRecord`
- `TrackedDependencyValue`
- `TrackedInvalidateOn`
- `TrackedMatchMode`
- `TrackedQueryKey`
- `TrackedQueryKeySegment`

Subpath exports:

- `@veams/status-quo-query/provider`
- `@veams/status-quo-query/query`
- `@veams/status-quo-query/mutation`

## Quickstart

```ts
import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);
const applicationId = 'app-1';
const productId = 'product-1';

const fetchProduct = async (currentApplicationId: string, currentProductId: string) => ({
  applicationId: currentApplicationId,
  name: 'Ada',
  productId: currentProductId,
});

const saveProduct = async (variables: {
  applicationId: string;
  productId: string;
  productName: string;
}) => ({
  ...variables,
  saved: true as const,
});

const fetchUser = async (userId: number) => ({ id: userId, name: 'Ada' });

const [createQuery, createMutation] = manager.createQueryAndMutation([
  'applicationId',
  'productId',
] as const);

const productQuery = createQuery(
  ['product', { deps: { applicationId: 'app-1', productId: 'product-1' }, view: { page: 1 } }],
  () => fetchProduct('app-1', 'product-1'),
  {
    enabled: false,
  }
);

const updateProduct = createMutation(saveProduct, {
  invalidateOn: 'success',
});

await productQuery.refetch();
await updateProduct.mutate({
  applicationId: 'app-1',
  productId: 'product-1',
  productName: 'Ada',
});

const userQuery = manager.createUntrackedQuery(['user', 42], () => fetchUser(42), {
  enabled: false,
});
await userQuery.refetch();
await userQuery.invalidate({ refetchType: 'none' });
```

## Why Tracked Invalidation

TanStack Query gives you flexible invalidation primitives, but the application still has to know which keys to invalidate after every mutation. Tracked invalidation moves that bookkeeping into the facade:

- queries declare their domain dependencies once in `queryKey[..., { deps, view }]`
- tracked mutations resolve the same dependency names from their variables
- the manager invalidates matching queries automatically

That changes the developer workflow from "remember which cache keys this mutation affects" to "describe which domain entities this query and mutation belong to".

Benefits:

- less manual cache invalidation code spread across features
- lower risk of stale UI because one dependent query was forgotten
- clearer separation between invalidation semantics in `deps` and UI variants in `view`
- typed paired helpers that remove repeated dependency mapping in the common case

## Examples

Tracked query keys use a final object segment:

```ts
['products', { deps: { applicationId, productId }, view: { page, sort } }]
```

Rules:

- `deps` is required for tracked queries
- only `deps` is used for invalidation matching
- `view` is optional and recommended for pagination, sorting, filtering, and other cache variants
- tracked invalidation is manager-only because queries and mutations need one shared registry

### Paired Helper With Default Dependency Resolution

Use the paired helper when mutation variables already expose the dependency keys directly:

```ts
import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);
const applicationId = 'app-1';
const productId = 'product-1';

const fetchProduct = async (currentApplicationId: string, currentProductId: string) => ({
  applicationId: currentApplicationId,
  name: 'Ada',
  productId: currentProductId,
});

const saveProduct = async (variables: {
  applicationId: string;
  productId: string;
  productName: string;
}) => variables;

const [createQuery, createMutation] = manager.createQueryAndMutation([
  'applicationId',
  'productId',
] as const);

const productQuery = createQuery(
  ['product', { deps: { applicationId, productId }, view: { page: 1 } }],
  () => fetchProduct(applicationId, productId),
  { enabled: false }
);

const saveProductMutation = createMutation(saveProduct);

await saveProductMutation.mutate({
  applicationId,
  productId,
  productName: 'New title',
});
```

In this shape the mutation does not need `resolveDependencies`, because the paired helper already knows which dependency keys to read from the mutation variables.

### Default `intersection` Matching

`intersection` is the default. A mutation invalidates only queries that match all provided dependency pairs:

```ts
import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);

const fetchProduct = async (applicationId: string, productId: string) => ({
  applicationId,
  name: 'Ada',
  productId,
});

const saveProduct = async (variables: {
  applicationId: string;
  productId: string;
  productName: string;
}) => variables;

const [createQuery, createMutation] = manager.createQueryAndMutation([
  'applicationId',
  'productId',
] as const);

createQuery(
  ['product', { deps: { applicationId: 'app-1', productId: 'product-1' }, view: { page: 1 } }],
  () => fetchProduct('app-1', 'product-1')
);

createQuery(
  ['product', { deps: { applicationId: 'app-1', productId: 'product-2' }, view: { page: 1 } }],
  () => fetchProduct('app-1', 'product-2')
);

const renameProduct = createMutation(saveProduct);

await renameProduct.mutate({
  applicationId: 'app-1',
  productId: 'product-1',
  productName: 'Ada',
});
```

Only the `app-1` / `product-1` query is invalidated.

### `union` Matching

Use `matchMode: 'union'` when a mutation should invalidate anything that matches any provided dependency pair:

```ts
import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);

const fetchProduct = async (applicationId: string, productId: string) => ({
  applicationId,
  name: 'Ada',
  productId,
});

const syncProductData = async (variables: {
  applicationId: string;
  productId: string;
}) => variables;

const [createQuery, createMutation] = manager.createQueryAndMutation([
  'applicationId',
  'productId',
] as const);

createQuery(
  ['product', { deps: { applicationId: 'app-1', productId: 'product-1' }, view: { page: 1 } }],
  () => fetchProduct('app-1', 'product-1')
);

createQuery(
  ['product', { deps: { applicationId: 'app-2', productId: 'product-1' }, view: { page: 1 } }],
  () => fetchProduct('app-2', 'product-1')
);

const syncProduct = createMutation(syncProductData, {
  matchMode: 'union',
});

await syncProduct.mutate({
  applicationId: 'app-1',
  productId: 'product-1',
});
```

This invalidates tracked queries that match:

- `applicationId === 'app-1'`
- or `productId === 'product-1'`

Use it when a mutation affects a wider slice of cached state and exact intersection would be too narrow.

### Partial Dependency Invalidation

Tracked mutations may resolve only some dependency keys:

```ts
import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);

const syncApplicationProducts = async (variables: { applicationId: string }) => variables;

const [createQuery, createMutation] = manager.createQueryAndMutation([
  'applicationId',
  'productId',
] as const);

createQuery(
  ['product', { deps: { applicationId: 'app-1', productId: 'product-1' }, view: { page: 1 } }],
  async () => ({ applicationId: 'app-1', productId: 'product-1' })
);

const refreshApplicationProducts = createMutation(syncApplicationProducts);

await refreshApplicationProducts.mutate({
  applicationId: 'app-1',
});
```

This invalidates all tracked queries that match `applicationId === 'app-1'`, regardless of `productId`.

### Lifecycle Timing

Automatic invalidation runs on success by default. Change `invalidateOn` when the mutation workflow needs different timing:

```ts
import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);

const removeProduct = async (variables: { applicationId: string }) => variables;

const [createQuery, createMutation] = manager.createQueryAndMutation([
  'applicationId',
] as const);

createQuery(
  ['product-list', { deps: { applicationId: 'app-1' }, view: { page: 1 } }],
  async () => [{ applicationId: 'app-1', productId: 'product-1' }]
);

const cleanupMutation = createMutation(removeProduct, {
  invalidateOn: 'settled',
});
```

Supported values:

- `'success'` invalidates only after a successful mutation
- `'error'` invalidates only after a failed mutation
- `'settled'` invalidates after either outcome

### Custom Dependency Resolution

Use `resolveDependencies` when mutation variables do not expose the tracked keys directly:

```ts
import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);

const saveProduct = async (variables: {
  payload: { applicationId: string };
  product: { id: string };
  productName: string;
}) => variables;

const nestedMutation = manager.createMutation(saveProduct, {
  resolveDependencies: (variables: {
    payload: { applicationId: string };
    product: { id: string };
  }) => ({
    applicationId: variables.payload.applicationId,
    productId: variables.product.id,
  }),
});

await nestedMutation.mutate({
  payload: { applicationId: 'app-1' },
  product: { id: 'product-1' },
});
```

Standalone tracked mutations need either:

- `dependencyKeys`
- or `resolveDependencies`

## FAQ

### Is `view` still part of the TanStack cache key?

Yes. TanStack uses the full query key for cache identity, so these are different cache entries:

```ts
['products', { deps: { applicationId: 'app-1' }, view: { page: 1 } }]
['products', { deps: { applicationId: 'app-1' }, view: { page: 2 } }]
```

That means `view` still matters for pagination, sorting, filtering, and any other cache variant you want TanStack to separate.

### Why does tracked invalidation ignore `view`?

Because `view` usually describes how the same domain data is presented, not what domain entity the query depends on.

If tracked invalidation matched on `view`, mutations would often miss related cache entries:

- renaming one product can change alphabetical sort order
- creating or deleting one product can shift pagination boundaries
- changing one record can affect multiple filtered views

Keeping `deps` for invalidation and `view` for cache partitioning makes that distinction explicit.

### What if I need to invalidate page 2 but not page 1?

That is a valid case, but it is intentionally not the default tracked behavior.

Use one of these options:

- call `query.invalidate()` on the exact query handle you want to refresh
- call `manager.invalidateQueries({ queryKey, exact: true })` with the specific key
- move `page` from `view` into `deps` only if page is truly part of the invalidation semantics in your domain

If page-specific invalidation is an exception, manual exact invalidation is usually the better choice.

### When is broad tracked invalidation the right tradeoff?

It is usually correct when one mutation can affect multiple views of the same domain slice:

- product creation can change counts and membership across multiple pages
- deletion can pull later items forward into earlier pages
- renaming can move items between sorted pages
- updates can move records in or out of filtered lists

## API

### `setupQueryManager(queryClient)`

Creates the package-level query manager facade around an existing TanStack `QueryClient`.

Returns `QueryManager` with:

- `createQuery(queryKey, queryFn, options?)`
- `createMutation(mutationFn, options?)`
- `createQueryAndMutation(dependencyKeys)`
- `createUntrackedQuery(queryKey, queryFn, options?)`
- `createUntrackedMutation(mutationFn, options?)`
- `cancelQueries(...)`
- `getQueryData(...)`
- `invalidateQueries(...)`
- `refetchQueries(...)`
- `removeQueries(...)`
- `resetQueries(...)`
- `setQueryData(...)`
- `unsafe_getClient()`

All manager methods forward directly to the corresponding `QueryClient` methods. `unsafe_getClient()` returns the raw TanStack client as an explicit escape hatch.

### Tracked Queries and Mutations

Tracked queries embed dependency metadata into the final query-key segment:

```ts
['products', { deps: { applicationId, productId }, view: { page, sort } }]
```

Only `deps` participates in automatic invalidation tracking. `view` is optional and is treated as normal query-key data.

`createQuery(queryKey, queryFn, options?)` returns the same `QueryService<TData, TError>` shape as `createUntrackedQuery(...)`, but it registers the query hash under every `deps` entry and re-registers on `refetch()` or the first `subscribe(...)` if TanStack has removed the cache entry in the meantime.

`createMutation(mutationFn, options?)` returns the same `MutationService<TData, TError, TVariables, TOnMutateResult>` shape as `createUntrackedMutation(...)`, but adds:

- `dependencyKeys?`
- `resolveDependencies?`
- `invalidateOn?` with `'success' | 'error' | 'settled'`
- `matchMode?` with `'intersection' | 'union'`

Standalone tracked mutations need either `dependencyKeys` or `resolveDependencies`.

`createQueryAndMutation(dependencyKeys)` captures dependency keys once and returns:

- the tracked `createQuery` factory
- a tracked `createMutation` factory whose default resolver reads `variables[dependencyKey]`

Use `resolveDependencies` when the mutation variables do not expose the tracked dependency fields directly.

### `createQueryAndMutation(dependencyKeys)`

Captures dependency names once and returns:

- the tracked query factory
- a tracked mutation factory whose default resolver reads `variables[dependencyKey]`

The tracked query factory still expects a query key with a final `{ deps, view? }` segment. The tracked mutation factory keeps the same `MutationService` shape as `createMutation(...)`, but no longer needs `dependencyKeys` repeated in each call.

Reach for standalone `createMutation(...)` when:

- query and mutation do not share one dependency-key list
- mutation variables need a custom `resolveDependencies(...)`
- you want one tracked mutation without pairing it to one tracked query workflow

### `setupQuery(queryClient)`

Creates a `createUntrackedQuery` factory bound to a `QueryClient`.

`createUntrackedQuery(queryKey, queryFn, options?)` returns `QueryService<TData, TError>`.

`QueryServiceOptions` is based on TanStack `QueryObserverOptions`, without `queryKey` and `queryFn` because those are provided directly to `createUntrackedQuery`.

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

Creates a `createUntrackedMutation` factory bound to a `QueryClient`.

`createUntrackedMutation(mutationFn, options?)` returns `MutationService<TData, TError, TVariables, TOnMutateResult>`.

`MutationServiceOptions` is based on TanStack `MutationObserverOptions`, without `mutationFn` because it is provided directly to `createUntrackedMutation`.

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
- Tracked invalidation is manager-only because the registry must be shared across query and mutation handles.
