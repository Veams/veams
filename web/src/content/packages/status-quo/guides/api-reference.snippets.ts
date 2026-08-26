export const statusQuoApiImports = `import {
  NativeStateHandler,
  makeStateSingleton,
  setupStatusQuo,
} from '@veams/status-quo';
import { ObservableStateHandler } from '@veams/status-quo/observable';
import { SignalStateHandler } from '@veams/status-quo/signals';
import {
  StateProvider,
  useProvidedStateActions,
  useProvidedStateHandler,
  useProvidedStateSubscription,
  useStateActions,
  useStateFactory,
  useStateHandler,
  useStateSingleton,
  useStateSubscription,
} from '@veams/status-quo/react';`;

export const statusQuoSubpathImports = `import {
  StateProvider,
  useProvidedStateSubscription,
  useStateFactory,
  useStateSubscription,
} from '@veams/status-quo/react';
import { ObservableStateHandler } from '@veams/status-quo/observable';
import { SignalStateHandler } from '@veams/status-quo/signals';`;
