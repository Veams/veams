import { signal } from '@preact/signals-core';

import { BaseStateHandler } from './base-state-handler.js';

import type { Signal } from '@preact/signals-core';

type SignalStateHandlerProps<S> = {
  initialState: S;
  options?: {
    devTools?: {
      enabled?: boolean;
      namespace: string;
    };
    useDistinctUntilChanged?: boolean;
  };
};

type Listener = () => void;

const defaultOptions = {
  useDistinctUntilChanged: true,
};

function isEqualAsJson(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export abstract class SignalStateHandler<S, A> extends BaseStateHandler<S, A> {
  private readonly state: Signal<S>;
  private readonly listeners = new Map<Listener, S>();
  private readonly useDistinctUntilChanged: boolean;

  protected constructor({ initialState, options = defaultOptions }: SignalStateHandlerProps<S>) {
    super(initialState);
    const mergedOptions = {
      ...defaultOptions,
      ...options,
    };

    this.state = signal<S>(initialState);
    this.useDistinctUntilChanged = mergedOptions.useDistinctUntilChanged ?? true;
    this.initDevTools(options?.devTools);
  }

  getSignal() {
    return this.state;
  }

  subscribe(listener: Listener) {
    this.listeners.set(listener, this.state.value);

    return () => {
      this.listeners.delete(listener);
    };
  }

  protected getStateValue() {
    return this.state.value;
  }

  protected setStateValue(nextState: S) {
    this.state.value = nextState;
    this.notify(nextState);
  }

  private notify(nextState: S) {
    for (const [listener, lastSnapshot] of this.listeners.entries()) {
      if (this.useDistinctUntilChanged && isEqualAsJson(nextState, lastSnapshot)) {
        continue;
      }

      this.listeners.set(listener, nextState);
      listener();
    }
  }
}
