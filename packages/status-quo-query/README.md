# @veams/status-quo-query

TanStack Query service helpers with a small subscribable surface that fits naturally into the StatusQuo ecosystem.

## Install

```bash
npm install @veams/status-quo-query @tanstack/query-core
```

React bindings are available through an optional peer dependency:

```bash
npm install react
```

## Mental Model

Status Quo Query deliberately keeps the public surface small:

- `QueryService<TData, TError>` is the read handle for one query.
- `MutationService<TData, TError, TVariables>` is the write handle for one mutation.
- snapshots are passive state objects returned from `getSnapshot()` and `subscribe(...)`.
- commands stay on the handle: `refetch()`, `invalidate()`, `mutate()`, `reset()`.
- `QueryManager` is the broader coordination layer for cross-query work.
- `@veams/status-quo-query/react` is optional and adds one React subscription hook over the same handle shape.

That keeps the package usable in service code, state handlers, and React components without changing the core query or mutation API.

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
- `QueryDependencyTuple`
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
- `@veams/status-quo-query/react`

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

## React Bindings

The React entrypoint exposes `useQuerySubscription(...)` and keeps `react` optional unless you
import `@veams/status-quo-query/react`.

```tsx
import { useQuerySubscription } from '@veams/status-quo-query/react';
import type { QueryService } from '@veams/status-quo-query';

function ProductName({ query }: { query: QueryService<{ name: string }, Error> }) {
  const snapshot = useQuerySubscription(query);

  return <span>{snapshot.data?.name ?? 'loading'}</span>;
}
```

Use the hook when a component should subscribe directly to a query service and render from its latest snapshot. Keep mapping at the component level:

- read `data`, `status`, `fetchStatus`, and flags like `isPending` from the snapshot
- call `query.refetch()` or `query.invalidate()` on the handle itself
- derive view-specific values in the component instead of adding selector logic to the hook

## Status Quo Integration

The same query handle can also feed a `status-quo` handler through `bindSubscribable(...)`.

```ts
import { NativeStateHandler } from '@veams/status-quo';
import {
  toQueryMetaState,
  type QueryMetaState,
  type QueryService,
} from '@veams/status-quo-query';

type Product = {
  id: string;
  name: string;
};

type ProductCardState = {
  product: Product | undefined;
  query: QueryMetaState;
};

type ProductCardActions = {
  refresh: () => Promise<void>;
};

export class ProductCardHandler extends NativeStateHandler<ProductCardState, ProductCardActions> {
  constructor(private readonly productQuery: QueryService<Product, Error>) {
    super({
      initialState: {
        product: productQuery.getSnapshot().data,
        query: toQueryMetaState(productQuery.getSnapshot()),
      },
    });

    this.bindSubscribable(productQuery, (snapshot) => {
      this.setState(
        {
          product: snapshot.data,
          query: toQueryMetaState(snapshot),
        },
        'query:update'
      );
    });
  }

  getActions(): ProductCardActions {
    return {
      refresh: async () => {
        await this.productQuery.refetch();
      },
    };
  }
}
```

Use that approach when query state is only one input into a broader UI state model and the handler should remain the view-facing boundary.

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

### Reactive Query Dependencies

Use `dependsOn` when a query needs data from other queries before it can run.

`dependsOn` accepts a `QueryDependencyTuple`:

- an ordered list of source query services
- a `deriveOptions(...)` callback that returns only `queryKey` and/or `enabled`

The watcher starts on the first `subscribe(...)` or `refetch()`, reads the current source snapshots immediately, and stops after the last unsubscribe. A downstream `refetch()` refetches all source services first, then refetches the derived query.

Untracked example:

```ts
import { QueryClient } from '@tanstack/query-core';
import { setupQuery, type QueryDependencyTuple } from '@veams/status-quo-query';

type User = { companyId: string };
type Config = { region: string; companyProfileEnabled: boolean };

const queryClient = new QueryClient();
const createQuery = setupQuery(queryClient);
const userQuery = createQuery(['user', 42] as const, () => fetchUser(42), { enabled: false });
const configQuery = createQuery(['config', 'global'] as const, fetchConfig, { enabled: false });

const companyProfileQuery = createQuery(
  ['company-profile', { companyId: undefined as string | undefined, region: undefined as string | undefined }],
  ({ queryKey }) => fetchCompanyProfile(queryKey[1].companyId!, queryKey[1].region!),
  {
    enabled: false,
    dependsOn: <QueryDependencyTuple<[User, Config]>>[
      [userQuery, configQuery],
      ([userSnapshot, configSnapshot]) => {
        if (!userSnapshot.data?.companyId || !configSnapshot.data?.region) {
          return { enabled: false };
        }

        return {
          enabled: configSnapshot.data.companyProfileEnabled,
          queryKey: [
            'company-profile',
            {
              companyId: userSnapshot.data.companyId,
              region: configSnapshot.data.region,
            },
          ],
        };
      },
    ],
  }
);
```

Tracked example:

```ts
import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);
const selectionQuery = manager.createUntrackedQuery(
  ['selection'] as const,
  fetchSelection,
  { enabled: false }
);

const productQuery = manager.createQuery(
  ['product', { deps: { applicationId: 'pending' }, view: { page: 0 } }],
  ({ queryKey }) => fetchProduct(queryKey[1].deps.applicationId),
  {
    enabled: false,
    dependsOn: [
      [selectionQuery],
      ([selectionSnapshot]) =>
        selectionSnapshot.data?.applicationId
          ? {
              enabled: true,
              queryKey: [
                'product',
                {
                  deps: { applicationId: selectionSnapshot.data.applicationId },
                  view: { page: 1 },
                },
              ],
            }
          : { enabled: false },
    ],
  }
);
```

For tracked queries, keep the placeholder key valid too. The initial key and every derived key must still end with `{ deps, view? }`.

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
- `fetchQuery(...)`
- `getQueryData(...)`
- `getQueryState(...)`
- `invalidateQueries(...)`
- `refetchQueries(...)`
- `removeQueries(...)`
- `resetQueries(...)`
- `setQueryData(...)`
- `unsafe_getClient()`

All manager methods forward directly to the corresponding `QueryClient` methods. `fetchQuery(...)` covers the common one-off read path without dropping to the raw client, while `unsafe_getClient()` remains the explicit escape hatch for unsupported TanStack APIs.

### How to write a service

Do not memoize `QueryService` handles in a package-level registry.

TanStack already deduplicates cached queries by `queryKey`. A `QueryService` is a handle over that cached state, closer to a TanStack `QueryObserver` than to the cached query entry itself. Creating a fresh handle per service method call is fine when the caller wants a live query handle.

Use this split in service code:

- return fresh query handles from methods that expose `refetch()`, `subscribe(...)`, or `invalidate()`
- read cache state directly from `QueryManager` in snapshot-only methods
- keep stable query handles only when one service instance intentionally owns one long-lived subscription source

Example:

```ts
import type { QueryService, QueryServiceSnapshot } from '@veams/status-quo-query';

type Company = {
  id: string;
  name: string;
};

// Shared key factories keep the live handle path and snapshot path aligned.
const companiesQueryKey = ['companies'] as const;
const companyByIdQueryKey = (companyId: string) => ['company', companyId] as const;

export interface CompanyService {
  getCompanies: () => QueryService<Company[], Error>;
  getCompanyById: (companyId: string) => QueryService<Company, Error>;
  getCompanyByIdSnapshot: (companyId: string) => QueryServiceSnapshot<Company, Error>;
}

export function createCompanyService(): CompanyService {
  const manager = getQueryManager();

  return {
    // Return a fresh query handle when callers need commands or subscriptions.
    getCompanies() {
      return manager.createUntrackedQuery(companiesQueryKey, fetchCompanies, {
        staleTime: companyStaleTime,
      });
    },
    // Parameterized query handles are cheap and map directly to the final query key.
    getCompanyById(companyId) {
      const queryKey = companyByIdQueryKey(companyId);

      return manager.createUntrackedQuery(queryKey, () => fetchCompanyById(companyId), {
        staleTime: companyStaleTime,
      });
    },
    // Snapshot-only reads should use the manager cache APIs instead of building another handle.
    getCompanyByIdSnapshot(companyId) {
      const queryKey = companyByIdQueryKey(companyId);
      const state = manager.getQueryState(queryKey);

      return {
        data: manager.getQueryData(queryKey),
        error: (state?.error as Error | null | undefined) ?? null,
        fetchStatus: state?.fetchStatus ?? 'idle',
        status: state?.status ?? 'pending',
        isError: state?.status === 'error',
        isFetching: state?.fetchStatus === 'fetching',
        isPending: state?.status === 'pending',
        isSuccess: state?.status === 'success',
      };
    },
  };
}
```

In this example, `getQueryManager()` is your application-level accessor for the shared `QueryManager`.

This keeps singleton services stateless with respect to query handles, supports parameterized service methods naturally, and avoids rebuilding a global query-handle registry.

### Tracked Queries and Mutations

Tracked queries embed dependency metadata into the final query-key segment:

```ts
['products', { deps: { applicationId, productId }, view: { page, sort } }]
```

Only `deps` participates in automatic invalidation tracking. `view` is optional and is treated as normal query-key data.

`createQuery(queryKey, queryFn, options?)` returns the same `QueryService<TData, TError>` shape as `createUntrackedQuery(...)`, but it registers the query hash under every `deps` entry, re-registers on `refetch()` or the first `subscribe(...)` if TanStack has removed the cache entry in the meantime, and keeps the registry in sync when `dependsOn` derives a new tracked key at runtime.

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

It also adds:

- `dependsOn?: QueryDependencyTuple<[...sources]>`

`dependsOn` observes the listed source query services and lets the downstream query derive only `queryKey` and `enabled`. Source services are activated while the downstream query is active, and downstream `refetch()` refetches the sources first. The public `QueryService` API does not change when this option is used.

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
