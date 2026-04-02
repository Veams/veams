import type { QueryService } from '../query';
import { createQueryRegistry, serializeQueryKey } from '../query-registry';

describe('createQueryRegistry', () => {
  it('reuses the same entry for identical params', () => {
    const registry = createQueryRegistry('branches', (params: { branchId: string }) => [
      'branch',
      {
        deps: {
          branchId: params.branchId,
        },
      },
    ] as const);
    const createEntry = jest.fn((queryKey) => ({ queryKey }));

    const firstEntry = registry.resolve({ branchId: 'branch-1' }, createEntry as never);
    const secondEntry = registry.resolve({ branchId: 'branch-1' }, createEntry as never);

    expect(firstEntry).toBe(secondEntry);
    expect(createEntry).toHaveBeenCalledTimes(1);
  });

  it('creates separate entries for different params', () => {
    const registry = createQueryRegistry('branches', (params: { branchId: string }) => [
      'branch',
      {
        deps: {
          branchId: params.branchId,
        },
      },
    ] as const);
    const createEntry = jest.fn((queryKey) => ({ queryKey }));

    const firstEntry = registry.resolve({ branchId: 'branch-1' }, createEntry as never);
    const secondEntry = registry.resolve({ branchId: 'branch-2' }, createEntry as never);

    expect(firstEntry).not.toBe(secondEntry);
    expect(createEntry).toHaveBeenCalledTimes(2);
  });

  it('exposes the generated query key', () => {
    const registry = createQueryRegistry('branches', (params: { branchId: string }) => [
      'branch',
      {
        deps: {
          branchId: params.branchId,
        },
      },
    ] as const);

    expect(registry.getKey({ branchId: 'branch-1' })).toEqual([
      'branch',
      {
        deps: {
          branchId: 'branch-1',
        },
      },
    ]);
  });

  it('uses TanStack-compatible stable hashing for object keys', () => {
    const firstKey = ['branch', { deps: { branchId: 'branch-1', companyId: 'company-1' } }] as const;
    const secondKey = ['branch', { deps: { companyId: 'company-1', branchId: 'branch-1' } }] as const;

    expect(serializeQueryKey(firstKey)).toBe(serializeQueryKey(secondKey));
  });

  it('infers the query service type from the creator callback', () => {
    const registry = createQueryRegistry('branches', (params: { branchId: string }) => [
      'branch',
      {
        deps: {
          branchId: params.branchId,
        },
      },
    ] as const);

    const query = registry.resolve({ branchId: 'branch-1' }, () => {
      return {
        getSnapshot: () => ({
          data: { id: 'branch-1' },
          error: null,
          fetchStatus: 'idle',
          isError: false,
          isFetching: false,
          isPending: false,
          isSuccess: true,
          status: 'success',
        }),
        invalidate: jest.fn(),
        refetch: jest.fn(),
        subscribe: jest.fn(),
        unsafe_getResult: jest.fn(),
      } as unknown as QueryService<{ id: string }, Error>;
    });

    const typedQuery: QueryService<{ id: string }, Error> = query;

    expect(typedQuery).toBe(query);
  });
});
