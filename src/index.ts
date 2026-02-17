import { useStateFactory, useStateSingleton } from './hooks/index.js';
import {
  BaseStateHandler,
  makeStateSingleton,
  ObservableStateHandler,
  SignalStateHandler,
} from './store/index.js';

import type { StateSingleton } from './store/index.js';
import type { StateSubscriptionHandler } from './types/types.js';

export {
  BaseStateHandler,
  makeStateSingleton,
  ObservableStateHandler,
  SignalStateHandler,
  useStateFactory,
  useStateSingleton,
};

export type { StateSingleton, StateSubscriptionHandler };
