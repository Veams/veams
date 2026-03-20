import { QueryClient } from '@tanstack/query-core';

import { isQueryLoading, setupQuery, toQueryMetaState } from '../query';

describe('Query Service', () => {
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
