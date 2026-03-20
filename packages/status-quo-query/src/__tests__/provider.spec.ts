import { QueryClient } from '@tanstack/query-core';

import { setupQueryProvider } from '../provider';

describe('Cache API', () => {
  it('exposes cache-level query client operations', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const refetchQueriesSpy = jest.spyOn(queryClient, 'refetchQueries');
    const cancelQueriesSpy = jest.spyOn(queryClient, 'cancelQueries');
    const resetQueriesSpy = jest.spyOn(queryClient, 'resetQueries');
    const removeQueriesSpy = jest.spyOn(queryClient, 'removeQueries');
    const cache = setupQueryProvider(queryClient);

    cache.setQueryData<{ id: number }>(['user', 42], { id: 42 });

    expect(cache.getQueryData<{ id: number }>(['user', 42])).toEqual({ id: 42 });
    expect(cache.unsafe_getClient()).toBe(queryClient);

    await cache.invalidateQueries({ queryKey: ['user'] });
    await cache.refetchQueries({ queryKey: ['user'] });
    await cache.cancelQueries({ queryKey: ['user'] });
    await cache.resetQueries({ queryKey: ['user'] });
    cache.removeQueries({ queryKey: ['user'] });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['user'] });
    expect(refetchQueriesSpy).toHaveBeenCalledWith({ queryKey: ['user'] });
    expect(cancelQueriesSpy).toHaveBeenCalledWith({ queryKey: ['user'] });
    expect(resetQueriesSpy).toHaveBeenCalledWith({ queryKey: ['user'] });
    expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: ['user'] });
  });
});
