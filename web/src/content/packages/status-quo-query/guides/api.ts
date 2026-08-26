import type { PackagePage } from '../../../types';
import { statusQuoQueryApiImports } from './api.snippets';

export const apiPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoQueryApiImports,
          label: 'Root exports',
          language: 'ts',
        },
      ],
      id: 'entry-points',
      paragraphs: ['Use the root package when you want the full surface from one import.'],
      title: 'Entry points',
    },
    {
      bullets: [
        '`TrackedQueryKey<TDeps>` describes a tracked query key whose final segment is `{ deps, view? }`.',
        '`TDeps` is the typed dependency record for the `deps` object.',
        'Use it when you want to annotate exported key factories, constants, or shared query-key helpers.',
      ],
      id: 'tracked-query-key',
      paragraphs: ['This is the public key-shape type for tracked queries.'],
      title: 'TrackedQueryKey',
    },
    {
      bullets: [
        '`createMutation(mutationFn, options?)` accepts one TanStack-compatible mutation function and tracked invalidation options.',
        '`mutationFn(variables)` performs the async write. `options?` configures retry, lifecycle callbacks, and tracked matching.',
        'Returns a mutation handle with `getSnapshot()`, `subscribe(listener)`, `mutate(variables, mutateOptions?)`, `reset()`, and `unsafe_getResult()`.',
      ],
      id: 'create-mutation',
      paragraphs: ['Use `createMutation` for the default tracked write flow.'],
      title: 'createMutation',
    },
    {
      bullets: [
        '`createUntrackedMutation(mutationFn, options?)` keeps the plain mutation handle without tracked invalidation.',
        'Use it when invalidation is fully manual or handled entirely elsewhere.',
        'Returns the same mutation handle shape as `createMutation(...)`, but without `dependencyKeys`, `resolveDependencies`, `invalidateOn`, or `matchMode`.',
      ],
      id: 'create-untracked-mutation',
      paragraphs: ['Use `createUntrackedMutation` when invalidation stays fully manual.'],
      title: 'createUntrackedMutation',
    },
    {
      bullets: [
        '`createMutation(mutationFn, options?)` adds automatic invalidation on top of the normal mutation handle.',
        '`options.dependencyKeys?` enables the default variable reader. `options.resolveDependencies?` is the escape hatch for nested or transformed mutation variables.',
        '`invalidateOn?` supports `success`, `error`, and `settled`. `matchMode?` supports `intersection` and `union`.',
      ],
      id: 'create-mutation-options',
      paragraphs: [
        'These options control when tracked invalidation runs and how dependencies are read.',
      ],
      title: 'createMutation Options',
    },
    {
      bullets: [
        '`createQuery(queryKey, queryFn, options?)` accepts one tracked query key, one query function, and optional observer options.',
        '`queryKey` must end with an object segment that contains `deps` and may contain `view`.',
        '`options.dependsOn?` lets the query derive `queryKey` and `enabled` from upstream source-service snapshots.',
        'Returns a query handle with `getSnapshot()`, `subscribe(listener)`, `refetch(options?)`, `invalidate(options?)`, and `unsafe_getResult()`.',
      ],
      id: 'create-query',
      paragraphs: ['Use `createQuery` for the default tracked read flow.'],
      title: 'createQuery',
    },
    {
      bullets: [
        '`createUntrackedQuery(queryKey, queryFn, options?)` keeps the plain query handle without dependency registration.',
        '`options.dependsOn?` is still available here when the query should derive its own `queryKey` and `enabled` state from source services without joining the tracked registry.',
        'Use it when the query should not participate in tracked invalidation, or when you want a very small TanStack wrapper only.',
        'Returns the same query handle shape as `createQuery(...)`, but does not require a `{ deps, view? }` key segment.',
      ],
      id: 'create-untracked-query',
      paragraphs: [
        'Use `createUntrackedQuery` when the query should stay outside the tracked registry.',
      ],
      title: 'createUntrackedQuery',
    },
    {
      bullets: [
        '`createQueryAndMutation(dependencyKeys)` returns the tracked query factory plus a tracked mutation factory with default dependency resolution.',
        'Declare the dependency names once, then let the paired mutation factory read `variables[dependencyKey]` automatically.',
        'Use the paired helper when one feature flow shares the same dependency names across its tracked queries and tracked mutations.',
      ],
      id: 'create-query-and-mutation',
      paragraphs: [
        'This is the shortest tracked setup when queries and mutations share the same dependency names.',
      ],
      title: 'createQueryAndMutation',
    },
    {
      bullets: [
        '`matchMode` belongs to tracked mutations and supports `intersection` and `union`.',
        'Default is `intersection`, which invalidates only queries matching every provided dependency pair.',
        '`union` broadens invalidation to queries matching any provided dependency pair.',
      ],
      id: 'tracked-matching-examples',
      paragraphs: [
        'Use `intersection` for narrow invalidation and `union` when one mutation should fan out wider.',
      ],
      title: 'Tracked Match Modes',
    },
    {
      bullets: [
        '`invalidateOn` supports `success`, `error`, and `settled`; default is `success`.',
        '`resolveDependencies(variables)` maps mutation variables into named dependency pairs when the default variable reader is not enough.',
        'Standalone tracked mutations need either `dependencyKeys` or `resolveDependencies`.',
      ],
      id: 'tracked-options-examples',
      paragraphs: ['These options control timing and dependency resolution.'],
      title: 'Tracked mutation options',
    },
    {
      bullets: [
        '`QueryDependencyTuple<[...sources]>` defines the ordered source services plus the `deriveOptions(...)` callback for `dependsOn`.',
        'The callback receives `QueryHandleSnapshot` values in the same order as the declared source services.',
        'It may return only `queryKey` and `enabled` for the downstream query.',
      ],
      id: 'query-dependency-tuple',
      paragraphs: [
        'Use `QueryDependencyTuple` to keep source services and derived state typed together.',
      ],
      title: 'QueryDependencyTuple',
    },
    {
      bullets: [
        '`QueryHandleOptions` is TanStack `QueryObserverOptions` without `queryFn` and `queryKey`, because those are passed directly to the factory.',
        'It also adds `dependsOn?` for declarative reactive query dependencies.',
        'The runtime derivation path is intentionally narrow: `dependsOn` may change only `queryKey` and `enabled`, and downstream `refetch()` will refetch the declared source services first.',
      ],
      id: 'query-service-options',
      paragraphs: [
        'Keep long-lived query policy in the base options. Use `dependsOn` only for key derivation and gating.',
      ],
      title: 'QueryHandleOptions',
    },
    {
      bullets: [
        '`isQueryLoading(query)` accepts a reduced meta state with `status` and `fetchStatus`.',
        'Returns `true` only for the initial loading case: `status === "pending"` and `fetchStatus === "fetching"`.',
        'Use it after `toQueryMetaState(snapshot)` when the UI only needs a simple loading answer.',
      ],
      id: 'is-query-loading',
      paragraphs: ['Use this helper when you only need the initial loading check.'],
      title: 'isQueryLoading',
    },
    {
      bullets: [
        '`MutationHandleSnapshot` is the passive state shape returned by `getSnapshot()` and `subscribe(listener)` on a mutation handle.',
        'Fields include `data`, `error`, `status`, `variables`, `isError`, `isIdle`, `isPending`, and `isSuccess`.',
        'It is state-only by design. Commands stay on the mutation handle, not on the snapshot.',
      ],
      id: 'mutation-snapshot',
      paragraphs: ['Use `MutationHandleSnapshot` as the read model for mutation state.'],
      title: 'MutationHandleSnapshot',
    },
    {
      bullets: [
        '`QueryManager` groups the broad management API around one `QueryClient`.',
        'Factory methods are `createQuery(queryKey, queryFn, options?)`, `createMutation(mutationFn, options?)`, `createQueryAndMutation(dependencyKeys)`, `createUntrackedQuery(queryKey, queryFn, options?)`, and `createUntrackedMutation(mutationFn, options?)`.',
        'Management methods are `cancelQueries(filters?, options?)`, `fetchQuery(options)`, `getQueryData(queryKey)`, `getQueryState(queryKey)`, `invalidateQueries(filters?, options?)`, `refetchQueries(filters?, options?)`, `removeQueries(filters?)`, `resetQueries(filters?, options?)`, `setQueryData(queryKey, updater)`, and `unsafe_getClient()`.',
      ],
      id: 'query-manager',
      paragraphs: ['Use `QueryManager` when work crosses handle boundaries.'],
      title: 'QueryManager',
    },
    {
      bullets: [
        '`QueryHandleData` is the lightweight data/error read model for one query.',
        'Fields include `data` and `error` only.',
        'Use it when callers need cached content but not fetch meta state such as `isPending` or `fetchStatus`.',
      ],
      id: 'query-data',
      paragraphs: ['Use `QueryHandleData` as the compact read model for data-first access.'],
      title: 'QueryHandleData',
    },
    {
      bullets: [
        '`QueryHandleSnapshot` is the passive state shape returned by `getSnapshot()` and `subscribe(listener)` on a query handle.',
        'Fields include `data`, `error`, `status`, `fetchStatus`, `isError`, `isFetching`, `isPending`, and `isSuccess`.',
        'It is designed for reads and derived state only. Commands stay on the query handle.',
      ],
      id: 'query-snapshot',
      paragraphs: ['Use `QueryHandleSnapshot` as the read model for query state.'],
      title: 'QueryHandleSnapshot',
    },
    {
      bullets: [
        '`useQueryHandle(queryHandle)` lives in `@veams/status-quo-query/react`.',
        'It subscribes React directly to one `QueryHandle` and returns the latest `QueryHandleSnapshot`.',
        'Use it when a component should observe query state directly without introducing another handler boundary.',
      ],
      id: 'use-query-handle',
      paragraphs: [
        'This is the optional React integration layer over the same query handle shape.',
      ],
      title: 'useQueryHandle',
    },
    {
      bullets: [
        '`useMutationHandle(mutationHandle)` lives in `@veams/status-quo-query/react`.',
        'It subscribes React directly to one `MutationHandle` and returns the latest `MutationHandleSnapshot`.',
        'Use it when a component should show mutation state (pending, success, or error) without owning the mutation trigger logic.',
        'Call `mutationHandle.mutate(variables)` directly on the handle; the hook only subscribes to state.',
      ],
      id: 'use-mutation-handle',
      paragraphs: [
        'This is the optional React integration layer over the same mutation handle shape.',
      ],
      title: 'useMutationHandle',
    },
    {
      bullets: [
        '`setupMutation(queryClient)` binds one TanStack `QueryClient` to the mutation factory.',
        'The only parameter is the `queryClient` instance that should own cache coordination and observer lifecycle.',
        'Returns the `createMutation` factory for focused mutation-only integrations.',
      ],
      id: 'setup-mutation',
      paragraphs: ['Use `setupMutation` when you only need mutation handles.'],
      title: 'setupMutation',
    },
    {
      bullets: [
        '`setupQuery(queryClient)` binds one TanStack `QueryClient` to the query factory.',
        'The only parameter is the `queryClient` instance that should own cache coordination and observer lifecycle.',
        'Returns the `createQuery` factory for focused query-only integrations, including `dependsOn`-driven query flows.',
      ],
      id: 'setup-query',
      paragraphs: ['Use `setupQuery` when you only need query handles.'],
      title: 'setupQuery',
    },
    {
      bullets: [
        '`QueryHandle.subscribe(...)` mounts the bound TanStack `QueryClient` while the subscription is active, then unmounts it during cleanup.',
        'This mirrors what `QueryClientProvider` does for native `useQuery`: the mounted client subscribes to `focusManager` and forwards browser focus changes to `queryCache.onFocus()`.',
        'With an active subscription, stale timers, `refetchOnWindowFocus`, `refetchOnReconnect`, and refetch intervals follow TanStack observer semantics.',
        '`staleTime` still controls freshness. The default `refetchOnWindowFocus: true` refetches only after the query is stale; use `"always"` to refetch on every focus or `false` to disable focus refetching.',
        '`bindSubscribable(...)` participates automatically because it subscribes to the query handle internally.',
        'Passive reads such as `getSnapshot()`, `getQueryData(...)`, `getQueryState(...)`, and `fetchQuery(...)` do not install focus listeners. Use `subscribe(...)`, `useQueryHandle(...)`, or `bindSubscribable(...)` for live observer behavior.',
      ],
      id: 'query-focus-refetch',
      paragraphs: [
        'Subscribed query handles activate the TanStack client lifecycle required for focus-driven refetching.',
      ],
      title: 'Window focus refetching',
    },
    {
      bullets: [
        '`setupQueryManager(queryClient)` binds one TanStack `QueryClient` to the full facade.',
        'The only parameter is the `queryClient` instance that should back both factories and manager operations.',
        'Returns a `QueryManager` with both factories plus management methods like `getQueryData(...)`, `getQueryState(...)`, and `invalidateQueries(...)` on one object.',
      ],
      id: 'setup-manager',
      paragraphs: [
        'Use `setupQueryManager` when one place should own both factories and cache management.',
      ],
      title: 'setupQueryManager',
    },
    {
      bullets: [
        '`toQueryHandleData(snapshot)` accepts any object with `data` and `error`, typically a `QueryHandleSnapshot`.',
        'Returns a smaller `QueryHandleData` object containing only those two fields.',
        'Use it when UI code or handlers need only the cached payload and error state.',
      ],
      id: 'to-query-handle-data',
      paragraphs: ['Use this helper when consumers do not need query meta state.'],
      title: 'toQueryHandleData',
    },
    {
      bullets: [
        '`toQueryMetaState(snapshot)` accepts any object with `status` and `fetchStatus`, typically a `QueryHandleSnapshot`.',
        'Returns a smaller `QueryMetaState` object containing only those two fields.',
        'Use it to keep UI helpers and selectors focused on the minimal query state they actually need.',
      ],
      id: 'to-query-meta-state',
      paragraphs: ['Use this helper when UI code needs only query meta state.'],
      title: 'toQueryMetaState',
    },
  ],
  eyebrow: 'Guides',
  id: 'api',
  intro: 'The public surface is split into query handles, mutation handles, and the query manager.',
  summary: 'Everything you can call.',
  title: 'API Reference',
};
