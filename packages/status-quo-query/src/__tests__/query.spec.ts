import { QueryClient } from '@tanstack/query-core';

import { isQueryLoading, setupQuery, toQueryMetaState } from '../query';

describe('Query Service', () => {
  async function flushTasks() {
    await Promise.resolve();
    await Promise.resolve();
  }

  it('returns data after refetch', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });
    const createQuery = setupQuery(queryClient);
    const queryFn = jest.fn().mockResolvedValue('hello');

    const service = createQuery(['demo', 'query'], queryFn, { enabled: false });

    expect(service.getSnapshot().data).toBeUndefined();

    const result = await service.refetch();

    expect(result.data).toBe('hello');
    expect(service.getSnapshot().data).toBe('hello');
    expect(service.unsafe_getResult().data).toBe('hello');
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it('notifies subscribers on updates', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });
    const createQuery = setupQuery(queryClient);
    const queryFn = jest.fn().mockResolvedValue('updated');
    const service = createQuery(['demo', 'notify'], queryFn, { enabled: false });

    const statuses: string[] = [];
    const unsubscribe = service.subscribe((snapshot) => {
      statuses.push(snapshot.status);
    });

    await service.refetch();
    unsubscribe();

    expect(statuses).toContain('pending');
    expect(statuses).toContain('success');
  });

  it('invalidates its own query key exactly', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const createQuery = setupQuery(queryClient);
    const service = createQuery(['demo', 'invalidate'], jest.fn().mockResolvedValue('updated'), {
      enabled: false,
    });

    await service.invalidate({ refetchType: 'none' });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith(
      {
        exact: true,
        queryKey: ['demo', 'invalidate'],
        refetchType: 'none',
      },
      undefined
    );
  });

  it('derives query activation and key updates from upstream cache state', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });
    const createQuery = setupQuery(queryClient);
    const userKey = ['user', 42] as const;
    const configKey = ['config', 'global'] as const;
    const userQuery = createQuery(userKey, jest.fn().mockResolvedValue({ companyId: 'company-1' }), {
      enabled: false,
    });
    const configQuery = createQuery(configKey, jest.fn().mockResolvedValue({ region: 'eu' }), {
      enabled: false,
    });
    const queryFn = jest
      .fn()
      .mockImplementation(({ queryKey }) => `${queryKey[1].companyId}:${queryKey[1].region}`);

    const service = createQuery(
      ['crefo', { companyId: undefined as string | undefined, region: undefined as string | undefined }],
      queryFn,
      {
        enabled: false,
        dependsOn: [
          [userQuery, configQuery],
          ([userSnapshot, configSnapshot]) => {
            if (!userSnapshot.data?.companyId || !configSnapshot.data?.region) {
              return { enabled: false };
            }

            return {
              enabled: true,
              queryKey: [
                'crefo',
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

    const snapshots: string[] = [];
    const unsubscribe = service.subscribe((snapshot) => {
      snapshots.push(snapshot.status);
    });

    queryClient.setQueryData(userKey, { companyId: 'company-1' });
    queryClient.setQueryData(configKey, { region: 'eu' });
    await flushTasks();

    expect(queryFn).toHaveBeenCalledTimes(1);
    expect(queryFn).toHaveBeenLastCalledWith(
      expect.objectContaining({
        queryKey: ['crefo', { companyId: 'company-1', region: 'eu' }],
      })
    );
    expect(service.getSnapshot().data).toBe('company-1:eu');
    expect(snapshots).toContain('success');

    unsubscribe();
  });

  it('uses source query data when dependsOn is evaluated on first refetch', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });
    const createQuery = setupQuery(queryClient);
    const selectionKey = ['selection'] as const;
    const selectionQueryFn = jest.fn().mockResolvedValue({ id: 'item-2' });
    const selectionQuery = createQuery(selectionKey, selectionQueryFn, { enabled: false });
    const queryFn = jest.fn().mockImplementation(async ({ queryKey }) => queryKey[1].id);

    const service = createQuery(
      ['details', { id: undefined as string | undefined }],
      queryFn,
      {
        enabled: false,
        dependsOn: [
          [selectionQuery],
          ([selectionSnapshot]) =>
            selectionSnapshot.data?.id
              ? {
                  enabled: true,
                  queryKey: ['details', { id: selectionSnapshot.data.id }],
                }
              : { enabled: false },
        ],
      }
    );

    const result = await service.refetch();

    expect(result.data).toBe('item-2');
    expect(selectionQueryFn).toHaveBeenCalledTimes(1);
    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['details', { id: 'item-2' }],
      })
    );
  });

  it('preserves source snapshot tuple order in dependsOn', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });
    const createQuery = setupQuery(queryClient);
    const firstQuery = createQuery(['source', 'first'] as const, jest.fn().mockResolvedValue({ label: 'first' }), {
      enabled: false,
    });
    const secondQuery = createQuery(['source', 'second'] as const, jest.fn().mockResolvedValue({ label: 'second' }), {
      enabled: false,
    });
    const observedOrders: Array<[string | undefined, string | undefined]> = [];

    const service = createQuery(
      ['ordered', { left: undefined as string | undefined, right: undefined as string | undefined }],
      jest.fn().mockResolvedValue('ok'),
      {
        enabled: false,
        dependsOn: [
          [firstQuery, secondQuery],
          ([firstSnapshot, secondSnapshot]) => {
            observedOrders.push([firstSnapshot.data?.label, secondSnapshot.data?.label]);

            return {
              enabled: false,
              queryKey: [
                'ordered',
                {
                  left: firstSnapshot.data?.label,
                  right: secondSnapshot.data?.label,
                },
              ],
            };
          },
        ],
      }
    );

    await service.refetch();

    expect(observedOrders).toContainEqual(['first', 'second']);
  });

  it('invalidates the current derived query key after dependsOn updates it', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const createQuery = setupQuery(queryClient);
    const selectionKey = ['selection'] as const;
    const selectionQuery = createQuery(selectionKey, jest.fn().mockResolvedValue({ id: 'item-3' }), {
      enabled: false,
    });

    queryClient.setQueryData(selectionKey, { id: 'item-3' });

    const service = createQuery(
      ['details', { id: undefined as string | undefined }],
      jest.fn().mockResolvedValue('item-3'),
      {
        enabled: false,
        dependsOn: [
          [selectionQuery],
          ([selectionSnapshot]) =>
            selectionSnapshot.data?.id
              ? {
                  enabled: true,
                  queryKey: ['details', { id: selectionSnapshot.data.id }],
                }
              : { enabled: false },
        ],
      }
    );

    await service.refetch();
    await service.invalidate({ refetchType: 'none' });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith(
      {
        exact: true,
        queryKey: ['details', { id: 'item-3' }],
        refetchType: 'none',
      },
      undefined
    );
  });

  it('stops reacting to upstream cache updates after the last unsubscribe', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const createQuery = setupQuery(queryClient);
    const selectionKey = ['selection'] as const;
    const selectionQuery = createQuery(
      selectionKey,
      jest.fn().mockResolvedValue({ id: 'item-2' }),
      {
        enabled: false,
      }
    );
    const queryFn = jest.fn().mockImplementation(async ({ queryKey }) => queryKey[1].id);

    queryClient.setQueryData(selectionKey, { id: 'item-1' });

    const service = createQuery(
      ['details', { id: undefined as string | undefined }],
      queryFn,
      {
        enabled: false,
        dependsOn: [
          [selectionQuery],
          ([selectionSnapshot]) =>
            selectionSnapshot.data?.id
              ? {
                  enabled: true,
                  queryKey: ['details', { id: selectionSnapshot.data.id }],
                }
              : { enabled: false },
        ],
      }
    );

    const unsubscribe = service.subscribe(() => undefined);
    await flushTasks();
    unsubscribe();

    queryClient.setQueryData(selectionKey, { id: 'item-2' });
    await flushTasks();

    expect(queryFn).toHaveBeenCalledTimes(1);

    await service.invalidate({ refetchType: 'none' });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith(
      {
        exact: true,
        queryKey: ['details', { id: 'item-1' }],
        refetchType: 'none',
      },
      undefined
    );

    await service.refetch();

    expect(queryFn).toHaveBeenCalledTimes(2);
    expect(queryFn).toHaveBeenLastCalledWith(
      expect.objectContaining({
        queryKey: ['details', { id: 'item-2' }],
      })
    );
  });

  it('derives loading state from query metadata', () => {
    expect(
      isQueryLoading(
        toQueryMetaState({
          fetchStatus: 'fetching',
          status: 'pending',
        })
      )
    ).toBe(true);

    expect(
      isQueryLoading(
        toQueryMetaState({
          fetchStatus: 'idle',
          status: 'success',
        })
      )
    ).toBe(false);
  });
});
