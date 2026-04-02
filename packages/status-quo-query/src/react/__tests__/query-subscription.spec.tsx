import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient } from '@tanstack/query-core';

import { setupQuery } from '../../query.js';
import { useQuerySubscription } from '../hooks/use-query-subscription.js';

import type { QueryService, QueryServiceSnapshot } from '../../query.js';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

describe('useQuerySubscription', () => {
  let container: HTMLDivElement;

  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('renders the latest query snapshot', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });
    const createQuery = setupQuery(queryClient);
    const query = createQuery(['product', 1], jest.fn().mockResolvedValue({ name: 'Ada' }), {
      enabled: false,
    });
    const renderStates: Array<string | undefined> = [];

    const Consumer = () => {
      const snapshot = useQuerySubscription(query);
      renderStates.push(snapshot.data?.name);

      return <span>{snapshot.data?.name ?? 'pending'}</span>;
    };

    const root = createRoot(container);

    await act(async () => {
      root.render(<Consumer />);
    });

    expect(container.textContent).toBe('pending');

    await act(async () => {
      await query.refetch();
    });

    expect(container.textContent).toBe('Ada');
    expect(renderStates).toContain(undefined);
    expect(renderStates).toContain('Ada');

    await act(async () => {
      root.unmount();
    });
  });
  it('cleans up the store subscription on unmount', async () => {
    const snapshot: QueryServiceSnapshot<{ name: string }, Error> = {
      data: { name: 'Ada' },
      error: null,
      fetchStatus: 'idle',
      status: 'success',
      isError: false,
      isFetching: false,
      isPending: false,
      isSuccess: true,
    };
    const unsubscribe = jest.fn();
    const query: QueryService<{ name: string }, Error> = {
      getSnapshot: () => snapshot,
      subscribe: jest.fn(() => unsubscribe),
      refetch: jest.fn(async () => snapshot),
      invalidate: jest.fn(async () => undefined),
      unsafe_getResult: jest.fn(),
    };

    const root = createRoot(container);

    const Consumer = () => {
      useQuerySubscription(query);
      return <span>ready</span>;
    };

    await act(async () => {
      root.render(<Consumer />);
    });

    expect(query.subscribe).toHaveBeenCalledTimes(1);

    await act(async () => {
      root.unmount();
    });

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
