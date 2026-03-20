import type { StateSubscriptionHandler } from '../types/types.js';

export interface StateSingleton<V, A> {
  getInstance: () => StateSubscriptionHandler<V, A>;
}

export interface StateSingletonOptions {
  destroyOnNoConsumers?: boolean;
}

export function makeStateSingleton<S, A>(
  stateHandlerFactory: () => StateSubscriptionHandler<S, A>,
  { destroyOnNoConsumers = false }: StateSingletonOptions = {}
): StateSingleton<S, A> {
  let instance: StateSubscriptionHandler<S, A> | null = null;
  const singleton: StateSingleton<S, A> & {
    destroyInstance: () => void;
    destroyOnNoConsumers: boolean;
  } = {
    destroyOnNoConsumers,
    getInstance() {
      if (!instance) {
        instance = stateHandlerFactory();
      }

      return instance;
    },
    destroyInstance() {
      if (!instance) {
        return;
      }

      instance.destroy();
      instance = null;
    },
  };

  return singleton;
}
