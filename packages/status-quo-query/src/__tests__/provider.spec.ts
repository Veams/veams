import { QueryClient } from '@tanstack/query-core';

import { setupQueryManager } from '../provider';

describe('Query Manager API', () => {
  it('exposes manager-level query client operations', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const refetchQueriesSpy = jest.spyOn(queryClient, 'refetchQueries');
    const cancelQueriesSpy = jest.spyOn(queryClient, 'cancelQueries');
    const resetQueriesSpy = jest.spyOn(queryClient, 'resetQueries');
    const removeQueriesSpy = jest.spyOn(queryClient, 'removeQueries');
    const fetchUser = jest.fn().mockResolvedValue({ id: 7 });
    const fetchQuerySpy = jest.spyOn(queryClient, 'fetchQuery');
    const manager = setupQueryManager(queryClient);

    manager.setQueryData<{ id: number }>(['user', 42], { id: 42 });

    expect(manager.getQueryData<{ id: number }>(['user', 42])).toEqual({ id: 42 });
    expect(manager.unsafe_getClient()).toBe(queryClient);
    await expect(
      manager.fetchQuery({
        queryKey: ['user', 7],
        queryFn: fetchUser,
        staleTime: 60_000,
      })
    ).resolves.toEqual({ id: 7 });

    await manager.invalidateQueries({ queryKey: ['user'] });
    await manager.refetchQueries({ queryKey: ['user'] });
    await manager.cancelQueries({ queryKey: ['user'] });
    await manager.resetQueries({ queryKey: ['user'] });
    manager.removeQueries({ queryKey: ['user'] });

    expect(fetchQuerySpy).toHaveBeenCalledWith({
      queryKey: ['user', 7],
      queryFn: fetchUser,
      staleTime: 60_000,
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['user'] });
    expect(refetchQueriesSpy).toHaveBeenCalledWith({ queryKey: ['user'] });
    expect(cancelQueriesSpy).toHaveBeenCalledWith({ queryKey: ['user'] });
    expect(resetQueriesSpy).toHaveBeenCalledWith({ queryKey: ['user'] });
    expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: ['user'] });
  });
});
