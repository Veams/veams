import { setupStatusQuo } from './config/status-quo-config.js';
import {
  BaseStateHandler,
  makeStateSingleton,
  ObservableStateHandler,
  SignalStateHandler,
} from './store';

import type {
  DevToolsOptions,
  GlobalDevToolsOptions,
  DistinctComparator,
  DistinctOptions,
  StatusQuoConfig,
} from './config/status-quo-config.js';
import type { StateSingleton, StateSingletonOptions } from './store';
import type { StateSubscriptionHandler } from './types/types.js';

export {
  BaseStateHandler,
  makeStateSingleton,
  ObservableStateHandler,
  setupStatusQuo,
  SignalStateHandler,
};

export type {
  DevToolsOptions,
  GlobalDevToolsOptions,
  DistinctComparator,
  DistinctOptions,
  StateSingleton,
  StateSingletonOptions,
  StateSubscriptionHandler,
  StatusQuoConfig,
};
