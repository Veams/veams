import {
  useStateActions,
  useStateFactory,
  useStateHandler,
  useStateSingleton,
  useStateSubscription,
} from './hooks';
import {
  BaseStateHandler,
  makeStateSingleton,
  ObservableStateHandler,
  SignalStateHandler,
} from './store';
import { setupStatusQuo } from './config/status-quo-config.js';

import type { DistinctComparator, DistinctOptions, StatusQuoConfig } from './config/status-quo-config.js';
import type { StateSingleton, StateSingletonOptions } from './store';
import type { StateSubscriptionHandler } from './types/types.js';

export {
  BaseStateHandler,
  makeStateSingleton,
  ObservableStateHandler,
  SignalStateHandler,
  setupStatusQuo,
  useStateActions,
  useStateFactory,
  useStateHandler,
  useStateSingleton,
  useStateSubscription,
};

export type {
  DistinctComparator,
  DistinctOptions,
  StateSingleton,
  StateSingletonOptions,
  StateSubscriptionHandler,
  StatusQuoConfig,
};
