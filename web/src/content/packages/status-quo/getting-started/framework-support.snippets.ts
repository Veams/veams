export const statusQuoFrameworkCoreImports = `import {
  NativeStateHandler,
  makeStateSingleton,
  setupStatusQuo,
} from '@veams/status-quo';
import { ObservableStateHandler } from '@veams/status-quo/observable';
import { SignalStateHandler } from '@veams/status-quo/signals';`;

export const statusQuoFrameworkReactImports = `import {
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
