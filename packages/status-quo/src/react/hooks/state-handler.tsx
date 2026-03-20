import { useRef } from 'react';

import type { StateSubscriptionHandler } from '../../types/types.js';

export function useStateHandler<V, A, P extends unknown[]>(
  stateFactoryFunction: (...args: P) => StateSubscriptionHandler<V, A>,
  params: P = [] as unknown as P
) {
  const stateHandlerRef = useRef<StateSubscriptionHandler<V, A> | null>(null);

  if (!stateHandlerRef.current) {
    stateHandlerRef.current = stateFactoryFunction(...params);
  }

  return stateHandlerRef.current;
}
