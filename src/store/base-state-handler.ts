import { withDevTools } from './dev-tools.js';
import { createSelectorCache, selectWithCache } from '../utils/selector-cache.js';

import type { StateSubscriptionHandler } from '../types/types.js';
import type { DevTools, MessagePayload } from './dev-tools.js';
import type { EqualityFn, Selector } from '../utils/selector-cache.js';

type DevToolsOptions = {
  enabled?: boolean;
  namespace: string;
};

type Subscribable<T> = {
  subscribe: (listener: (value: T) => void) => () => void;
  getSnapshot?: () => T;
};

const defaultDevToolsOptions = { enabled: false, namespace: 'Store' };

const devToolsFeatures = {
  pause: true,
  lock: true,
  persist: false,
  export: true,
  import: 'custom',
  jump: true,
  skip: true,
  reorder: true,
  dispatch: false,
  test: false,
};

export abstract class BaseStateHandler<S, A> implements StateSubscriptionHandler<S, A> {
  protected readonly initialState: S;
  protected devTools: DevTools | null = null;

  subscriptions: Array<{ unsubscribe: () => void }> = [];

  protected constructor(initialState: S) {
    this.initialState = initialState;
  }

  protected initDevTools(devToolsOptions?: DevToolsOptions) {
    const mergedOptions = {
      ...defaultDevToolsOptions,
      ...devToolsOptions,
    };

    if (!mergedOptions.enabled) {
      this.devTools = null;
      return;
    }

    this.devTools = withDevTools(this.initialState, {
      name: mergedOptions.namespace,
      instanceId: mergedOptions.namespace.toLowerCase().replaceAll(' ', '-'),
      actionCreators: this.getActions(),
      features: devToolsFeatures,
    });

    this.devTools?.subscribe(this.handleDevToolsEvents);
  }

  getInitialState() {
    return this.initialState;
  }

  getState() {
    return this.getStateValue();
  }

  getSnapshot() {
    return this.getState();
  }

  setState(newState: Partial<S>, actionName = 'change') {
    const nextState = { ...this.getState(), ...newState };
    this.setStateValue(nextState);
    this.devTools?.send(actionName, nextState);
  }

  destroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  protected abstract getStateValue(): S;
  protected abstract setStateValue(nextState: S): void;

  protected bindSubscribable<T, Sel>(
    service: Subscribable<T>,
    onChange: (value: Sel) => void,
    selector: Selector<T, Sel>,
    isEqual?: EqualityFn<Sel>
  ): void;
  protected bindSubscribable<T>(
    service: Subscribable<T>,
    onChange: (value: T) => void
  ): void;
  protected bindSubscribable<T, Sel = T>(
    service: Subscribable<T>,
    onChange: (value: Sel) => void,
    selector?: Selector<T, Sel>,
    isEqual: EqualityFn<Sel> = Object.is
  ) {
    const selectorFn = (selector ?? ((value: T) => value as unknown as Sel)) as Selector<T, Sel>;
    const selectorCache = createSelectorCache<Sel>();
    let receivedSyncValue = false;

    const notifySelectedValue = (value: T) => {
      receivedSyncValue = true;
      const { value: nextSelection, hasChanged } = selectWithCache(
        selectorCache,
        value,
        selectorFn,
        isEqual
      );

      if (!hasChanged) {
        return;
      }

      onChange(nextSelection);
    };

    const unsubscribe = service.subscribe(notifySelectedValue);
    this.subscriptions = [...(this.subscriptions ?? []), { unsubscribe }];

    if (service.getSnapshot && !receivedSyncValue) notifySelectedValue(service.getSnapshot());
  }

  abstract subscribe(listener: () => void): () => void;
  abstract subscribe(listener: (value: S) => void): () => void;
  abstract getActions(): A;

  private handleDevToolsEvents = (message: MessagePayload) => {
    if (message.type !== 'DISPATCH') {
      return;
    }

    switch (message.payload.type) {
      case 'RESET':
        this.setStateValue(this.getInitialState());
        this.devTools?.init(this.getInitialState());
        break;

      case 'COMMIT':
        this.setStateValue(this.getState());
        this.devTools?.init(this.getState());
        break;

      case 'JUMP_TO_STATE':
      case 'JUMP_TO_ACTION':
        this.setStateValue(JSON.parse(message.state));
        break;

      default:
        break;
    }
  };
}
