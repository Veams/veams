import { useMemo } from 'react';

import type { StateSubscriptionHandler } from '../types/types.js';

export function useStateActions<V, A>(stateSubscriptionHandler: StateSubscriptionHandler<V, A>) {
  return useMemo(() => stateSubscriptionHandler.getActions(), [stateSubscriptionHandler]);
}
