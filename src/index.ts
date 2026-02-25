import {
  useStateActions,
  useStateFactory,
  useStateHandler,
  useStateSingleton,
  useStateSubscription,
} from './hooks/index.js';
import {
  BaseStateHandler,
  makeStateSingleton,
  ObservableStateHandler,
  SignalStateHandler,
} from './store/index.js';

import type { StateSingleton, StateSingletonOptions } from './store/index.js';
import type { StateSubscriptionHandler } from './types/types.js';

export {
  BaseStateHandler,
  makeStateSingleton,
  ObservableStateHandler,
  SignalStateHandler,
  useStateActions,
  useStateFactory,
  useStateHandler,
  useStateSingleton,
  useStateSubscription,
};

export type { StateSingleton, StateSingletonOptions, StateSubscriptionHandler };
