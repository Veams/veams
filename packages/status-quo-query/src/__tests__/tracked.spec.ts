import { QueryClient } from '@tanstack/query-core';

import { setupQueryManager } from '../provider';

describe('Tracked Query Invalidation', () => {
  it('registers tracked queries from deps and ignores view data during invalidation', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
    });
    const manager = setupQueryManager(queryClient);
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const [createTrackedQuery, createTrackedMutation] = manager.createTrackedQueryAndMutation([
      'applicationId',
      'productId',
    ] as const);

    createTrackedQuery(
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

    const mutation = createTrackedMutation(jest.fn().mockResolvedValue({ ok: true as const }));

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
      manager.createTrackedQuery(
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
    const [createTrackedQuery, createTrackedMutation] = manager.createTrackedQueryAndMutation([
      'applicationId',
      'productId',
    ] as const);

    createTrackedQuery(
      ['product', { deps: { applicationId: 'app-1', productId: 'product-1' }, view: { page: 1 } }],
      jest.fn().mockResolvedValue('page-1'),
      { enabled: false }
    );
    createTrackedQuery(
      ['product', { deps: { applicationId: 'app-1', productId: 'product-2' }, view: { page: 2 } }],
      jest.fn().mockResolvedValue('page-2'),
      { enabled: false }
    );

    const mutation = createTrackedMutation(jest.fn().mockResolvedValue({ ok: true as const }));

    await mutation.mutate({ applicationId: 'app-1', productName: 'Shared update' });

    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
  });

  it('supports union matching and dedupes invalidation calls per query', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
    });
    const manager = setupQueryManager(queryClient);
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const [createTrackedQuery, createTrackedMutation] = manager.createTrackedQueryAndMutation([
      'applicationId',
      'productId',
    ] as const);

    createTrackedQuery(
      ['product', { deps: { applicationId: 'app-1', productId: 'product-1' }, view: { page: 1 } }],
      jest.fn().mockResolvedValue('product-1'),
      { enabled: false }
    );
    createTrackedQuery(
      ['product', { deps: { applicationId: 'app-1', productId: 'product-2' }, view: { page: 2 } }],
      jest.fn().mockResolvedValue('product-2'),
      { enabled: false }
    );
    createTrackedQuery(
      ['product', { deps: { applicationId: 'app-2', productId: 'product-1' }, view: { page: 3 } }],
      jest.fn().mockResolvedValue('product-3'),
      { enabled: false }
    );

    const mutation = createTrackedMutation(jest.fn().mockResolvedValue({ ok: true as const }), {
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

    manager.createTrackedQuery(
      ['product', { deps: { applicationId: 'app-1', productId: 'product-1' }, view: { page: 1 } }],
      jest.fn().mockResolvedValue('product'),
      { enabled: false }
    );

    const mutation = manager.createTrackedMutation(
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
    const [createTrackedQuery, createTrackedMutation] = manager.createTrackedQueryAndMutation([
      'applicationId',
    ] as const);

    createTrackedQuery(
      ['product', { deps: { applicationId: 'app-1' }, view: { page: 1 } }],
      jest.fn().mockResolvedValue('product'),
      { enabled: false }
    );

    const invalidateOnError = createTrackedMutation(jest.fn().mockRejectedValue(new Error('boom')), {
      invalidateOn: 'error',
    });
    const invalidateOnSettled = createTrackedMutation(
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
    const [createTrackedQuery, createTrackedMutation] = manager.createTrackedQueryAndMutation([
      'applicationId',
    ] as const);

    const removedQueryKey = [
      'product',
      { deps: { applicationId: 'app-1' }, view: { page: 1 } },
    ] as const;

    createTrackedQuery(removedQueryKey, jest.fn().mockResolvedValue('page-1'), {
      enabled: false,
    });
    queryClient.removeQueries({ exact: true, queryKey: removedQueryKey });

    createTrackedQuery(
      ['product', { deps: { applicationId: 'app-1' }, view: { page: 2 } }],
      jest.fn().mockResolvedValue('page-2'),
      { enabled: false }
    );
    cacheGetSpy.mockClear();

    const mutation = createTrackedMutation(jest.fn().mockResolvedValue({ ok: true as const }));

    await mutation.mutate({ applicationId: 'app-1' });

    expect(cacheGetSpy).toHaveBeenCalledTimes(1);
  });

  it('re-registers tracked queries on refetch after TanStack cache removal', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
    });
    const manager = setupQueryManager(queryClient);
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const [createTrackedQuery, createTrackedMutation] = manager.createTrackedQueryAndMutation([
      'applicationId',
    ] as const);
    const queryKey = ['product', { deps: { applicationId: 'app-1' }, view: { page: 1 } }] as const;
    const query = createTrackedQuery(queryKey, jest.fn().mockResolvedValue('product'), {
      enabled: false,
    });
    const mutation = createTrackedMutation(jest.fn().mockResolvedValue({ ok: true as const }));

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
    const [createTrackedQuery, createTrackedMutation] = manager.createTrackedQueryAndMutation([
      'applicationId',
    ] as const);
    const queryKey = ['product', { deps: { applicationId: 'app-1' }, view: { page: 1 } }] as const;
    const query = createTrackedQuery(queryKey, jest.fn().mockResolvedValue('product'), {
      enabled: false,
    });
    const mutation = createTrackedMutation(jest.fn().mockResolvedValue({ ok: true as const }));

    queryClient.removeQueries({ exact: true, queryKey });

    const unsubscribe = query.subscribe(() => undefined);
    await mutation.mutate({ applicationId: 'app-1' });
    unsubscribe();

    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(1);
  });
});
