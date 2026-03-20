import { QueryClient } from '@tanstack/query-core';

import { setupMutation } from '../mutation';

describe('Mutation Service', () => {
  it('tracks successful mutations', async () => {
    const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: 0 } } });
    const createMutation = setupMutation(queryClient);
    let receivedPayload: { id: number } | undefined;
    const mutationFn = jest.fn((payload: { id: number }) => {
      receivedPayload = payload;
      return Promise.resolve({ ok: true as const, id: payload.id });
    });
    const service = createMutation(mutationFn);

    const statuses: string[] = [];
    const unsubscribe = service.subscribe((snapshot) => {
      statuses.push(snapshot.status);
    });

    expect(service.getSnapshot().status).toBe('idle');
    expect(service.getSnapshot().isIdle).toBe(true);

    const result = await service.mutate({ id: 42 });

    unsubscribe();

    expect(result).toEqual({ ok: true, id: 42 });
    expect(receivedPayload).toEqual({ id: 42 });
    expect(mutationFn).toHaveBeenCalledTimes(1);
    expect(statuses).toContain('pending');
    expect(statuses).toContain('success');
    expect(service.getSnapshot().status).toBe('success');
    expect(service.unsafe_getResult().data).toEqual({ ok: true, id: 42 });

    service.reset();
    expect(service.getSnapshot().status).toBe('idle');
  });

  it('tracks failed mutations', async () => {
    const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: 0 } } });
    const createMutation = setupMutation(queryClient);
    const mutationFn = jest.fn().mockRejectedValue(new Error('boom'));
    const service = createMutation(mutationFn);

    await expect(service.mutate()).rejects.toThrow('boom');
    expect(service.getSnapshot().status).toBe('error');
  });
});
