import { QueryClient } from '@tanstack/query-core';

import { setupQueryManager } from '../provider';

describe('Tracked Query Invalidation', () => {
  async function flushTasks() {
    await Promise.resolve();
    await Promise.resolve();
  }

  it('registers tracked queries from deps and ignores view data during invalidation', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
    });
    const manager = setupQueryManager(queryClient);
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const [createQuery, createMutation] = manager.createQueryAndMutation([
      'applicationId',
      'productId',
    ] as const);

    createQuery(
      [
        'product',
        {
          deps: { applicationId: 'app-1', productId: 'product-1' },
          view: { page: 2, sort: 'name' },
        },
      ],
      jest.fn().mockResolvedValue('product'),
      { enabled: false }
    );

    const mutation = createMutation(jest.fn().mockResolvedValue({ ok: true as const }));

    await mutation.mutate({
      applicationId: 'app-1',
      productId: 'product-1',
      productName: 'Renamed',
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      exact: true,
      queryKey: [
        'product',
        {
          deps: { applicationId: 'app-1', productId: 'product-1' },
          view: { page: 2, sort: 'name' },
        },
      ],
    });
  });

  it('rejects tracked query keys without a deps object', () => {
    const manager = setupQueryManager(new QueryClient());

    expect(() =>
      manager.createQuery(
        ['invalid', { view: { page: 1 } }] as never,
        jest.fn().mockResolvedValue('nope')
      )
    ).toThrow('Tracked queries require queryKey[queryKey.length - 1].deps to be a plain object.');
  });

  it('supports partial dependency invalidation by matching only the provided keys', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
    });
    const manager = setupQueryManager(queryClient);
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const [createQuery, createMutation] = manager.createQueryAndMutation([
      'applicationId',
      'productId',
    ] as const);

    createQuery(
      ['product', { deps: { applicationId: 'app-1', productId: 'product-1' }, view: { page: 1 } }],
      jest.fn().mockResolvedValue('page-1'),
      { enabled: false }
    );
    createQuery(
      ['product', { deps: { applicationId: 'app-1', productId: 'product-2' }, view: { page: 2 } }],
      jest.fn().mockResolvedValue('page-2'),
      { enabled: false }
    );

    const mutation = createMutation(jest.fn().mockResolvedValue({ ok: true as const }));

    await mutation.mutate({ applicationId: 'app-1', productName: 'Shared update' });

    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
  });

  it('supports union matching and dedupes invalidation calls per query', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
    });
    const manager = setupQueryManager(queryClient);
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const [createQuery, createMutation] = manager.createQueryAndMutation([
      'applicationId',
      'productId',
    ] as const);

    createQuery(
      ['product', { deps: { applicationId: 'app-1', productId: 'product-1' }, view: { page: 1 } }],
      jest.fn().mockResolvedValue('product-1'),
      { enabled: false }
    );
    createQuery(
      ['product', { deps: { applicationId: 'app-1', productId: 'product-2' }, view: { page: 2 } }],
      jest.fn().mockResolvedValue('product-2'),
      { enabled: false }
    );
    createQuery(
      ['product', { deps: { applicationId: 'app-2', productId: 'product-1' }, view: { page: 3 } }],
      jest.fn().mockResolvedValue('product-3'),
      { enabled: false }
    );

    const mutation = createMutation(jest.fn().mockResolvedValue({ ok: true as const }), {
      matchMode: 'union',
    });

    await mutation.mutate({ applicationId: 'app-1', productId: 'product-1' });

    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(3);
  });

  it('supports custom dependency resolution for nested mutation variables', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
    });
    const manager = setupQueryManager(queryClient);
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    manager.createQuery(
      ['product', { deps: { applicationId: 'app-1', productId: 'product-1' }, view: { page: 1 } }],
      jest.fn().mockResolvedValue('product'),
      { enabled: false }
    );

    const mutation = manager.createMutation(
      jest.fn().mockResolvedValue({ ok: true as const }),
      {
        resolveDependencies: (variables: {
          payload: { applicationId: string };
          product: { id: string };
        }) => ({
          applicationId: variables.payload.applicationId,
          productId: variables.product.id,
        }),
      }
    );

    await mutation.mutate({
      payload: { applicationId: 'app-1' },
      product: { id: 'product-1' },
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(1);
  });

  it('supports error and settled invalidation timing', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
    });
    const manager = setupQueryManager(queryClient);
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const [createQuery, createMutation] = manager.createQueryAndMutation([
      'applicationId',
    ] as const);

    createQuery(
      ['product', { deps: { applicationId: 'app-1' }, view: { page: 1 } }],
      jest.fn().mockResolvedValue('product'),
      { enabled: false }
    );

    const invalidateOnError = createMutation(jest.fn().mockRejectedValue(new Error('boom')), {
      invalidateOn: 'error',
    });
    const invalidateOnSettled = createMutation(
      jest.fn().mockRejectedValue(new Error('boom again')),
      {
        invalidateOn: 'settled',
      }
    );

    await expect(invalidateOnError.mutate({ applicationId: 'app-1' })).rejects.toThrow('boom');
    await expect(invalidateOnSettled.mutate({ applicationId: 'app-1' })).rejects.toThrow(
      'boom again'
    );

    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
  });

  it('cleans removed query hashes out of dependency buckets', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
    });
    const manager = setupQueryManager(queryClient);
    const cacheGetSpy = jest.spyOn(queryClient.getQueryCache(), 'get');
    const [createQuery, createMutation] = manager.createQueryAndMutation([
      'applicationId',
    ] as const);

    const removedQueryKey = [
      'product',
      { deps: { applicationId: 'app-1' }, view: { page: 1 } },
    ] as const;

    createQuery(removedQueryKey, jest.fn().mockResolvedValue('page-1'), {
      enabled: false,
    });
    queryClient.removeQueries({ exact: true, queryKey: removedQueryKey });

    createQuery(
      ['product', { deps: { applicationId: 'app-1' }, view: { page: 2 } }],
      jest.fn().mockResolvedValue('page-2'),
      { enabled: false }
    );
    cacheGetSpy.mockClear();

    const mutation = createMutation(jest.fn().mockResolvedValue({ ok: true as const }));

    await mutation.mutate({ applicationId: 'app-1' });

    expect(cacheGetSpy).toHaveBeenCalledTimes(1);
  });

  it('re-registers tracked queries on refetch after TanStack cache removal', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
    });
    const manager = setupQueryManager(queryClient);
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const [createQuery, createMutation] = manager.createQueryAndMutation([
      'applicationId',
    ] as const);
    const queryKey = ['product', { deps: { applicationId: 'app-1' }, view: { page: 1 } }] as const;
    const query = createQuery(queryKey, jest.fn().mockResolvedValue('product'), {
      enabled: false,
    });
    const mutation = createMutation(jest.fn().mockResolvedValue({ ok: true as const }));

    queryClient.removeQueries({ exact: true, queryKey });

    await mutation.mutate({ applicationId: 'app-1' });
    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(0);

    await query.refetch();
    await mutation.mutate({ applicationId: 'app-1' });

    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(1);
  });

  it('re-registers tracked queries on subscribe after TanStack cache removal', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
    });
    const manager = setupQueryManager(queryClient);
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const [createQuery, createMutation] = manager.createQueryAndMutation([
      'applicationId',
    ] as const);
    const queryKey = ['product', { deps: { applicationId: 'app-1' }, view: { page: 1 } }] as const;
    const query = createQuery(queryKey, jest.fn().mockResolvedValue('product'), {
      enabled: false,
    });
    const mutation = createMutation(jest.fn().mockResolvedValue({ ok: true as const }));

    queryClient.removeQueries({ exact: true, queryKey });

    const unsubscribe = query.subscribe(() => undefined);
    await mutation.mutate({ applicationId: 'app-1' });
    unsubscribe();

    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(1);
  });

  it('moves tracked registrations to the derived key when dependsOn updates the query', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
    });
    const manager = setupQueryManager(queryClient);
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const selectionKey = ['selection'] as const;

    queryClient.setQueryData(selectionKey, { applicationId: 'app-1' });

    const query = manager.createQuery(
      ['product', { deps: { applicationId: 'pending' }, view: { page: 0 } }],
      jest.fn().mockResolvedValue('product'),
      {
        enabled: false,
        dependsOn: [
          [selectionKey],
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

    const mutation = manager.createMutation(jest.fn().mockResolvedValue({ ok: true as const }), {
      dependencyKeys: ['applicationId'],
    });

    await query.refetch();
    await mutation.mutate({ applicationId: 'pending' });

    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(0);

    await mutation.mutate({ applicationId: 'app-1' });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      exact: true,
      queryKey: ['product', { deps: { applicationId: 'app-1' }, view: { page: 1 } }],
    });
  });

  it('re-registers the latest derived tracked key after cache removal and a later refetch', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
    });
    const manager = setupQueryManager(queryClient);
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const selectionKey = ['selection'] as const;
    const initialDerivedKey = [
      'product',
      { deps: { applicationId: 'app-1' }, view: { page: 1 } },
    ] as const;
    const latestDerivedKey = [
      'product',
      { deps: { applicationId: 'app-2' }, view: { page: 1 } },
    ] as const;

    queryClient.setQueryData(selectionKey, { applicationId: 'app-1' });

    const query = manager.createQuery(
      ['product', { deps: { applicationId: 'pending' }, view: { page: 0 } }],
      jest.fn().mockResolvedValue('product'),
      {
        enabled: false,
        dependsOn: [
          [selectionKey],
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

    const mutation = manager.createMutation(jest.fn().mockResolvedValue({ ok: true as const }), {
      dependencyKeys: ['applicationId'],
    });

    await query.refetch();
    queryClient.removeQueries({ exact: true, queryKey: initialDerivedKey });
    queryClient.setQueryData(selectionKey, { applicationId: 'app-2' });
    await flushTasks();

    invalidateQueriesSpy.mockClear();

    await mutation.mutate({ applicationId: 'app-2' });
    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(0);

    await query.refetch();
    await mutation.mutate({ applicationId: 'app-2' });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      exact: true,
      queryKey: latestDerivedKey,
    });

    invalidateQueriesSpy.mockClear();

    await mutation.mutate({ applicationId: 'pending' });

    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(0);
  });
});
