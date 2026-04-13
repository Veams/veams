import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient } from '@tanstack/query-core';

import { setupMutation } from '../../mutation.js';
import { useMutationHandle } from '../hooks/use-mutation-handle.js';

import type { MutationHandle, MutationHandleSnapshot } from '../../mutation.js';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

describe('useMutationHandle', () => {
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

  it('renders the latest mutation snapshot', async () => {
    const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: 0 } } });
    const createMutation = setupMutation(queryClient);
    const mutationFn = jest.fn((_payload: { name: string }) =>
      Promise.resolve({ ok: true as const })
    );
    const handle = createMutation(mutationFn);
    const statuses: string[] = [];

    const Consumer = () => {
      const snapshot = useMutationHandle(handle);
      statuses.push(snapshot.status);

      return <span>{snapshot.status}</span>;
    };

    const root = createRoot(container);

    await act(async () => {
      root.render(<Consumer />);
    });

    expect(container.textContent).toBe('idle');

    await act(async () => {
      await handle.mutate({ name: 'Ada' });
    });

    expect(container.textContent).toBe('success');
    expect(statuses).toContain('idle');
    expect(statuses).toContain('pending');
    expect(statuses).toContain('success');

    await act(async () => {
      root.unmount();
    });
  });

  it('cleans up the store subscription on unmount', async () => {
    const snapshot: MutationHandleSnapshot<{ ok: true }, Error, void> = {
      data: { ok: true },
      error: null,
      status: 'success',
      variables: undefined,
      isError: false,
      isIdle: false,
      isPending: false,
      isSuccess: true,
    };
    const unsubscribe = jest.fn();
    const handle: MutationHandle<{ ok: true }, Error, void> = {
      getSnapshot: () => snapshot,
      subscribe: jest.fn(() => unsubscribe),
      mutate: jest.fn(async () => ({ ok: true as const })),
      reset: jest.fn(),
      unsafe_getResult: jest.fn(),
    };

    const root = createRoot(container);

    const Consumer = () => {
      useMutationHandle(handle);
      return <span>ready</span>;
    };

    await act(async () => {
      root.render(<Consumer />);
    });

    expect(handle.subscribe).toHaveBeenCalledTimes(1);

    await act(async () => {
      root.unmount();
    });

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
