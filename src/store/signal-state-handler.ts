import { signal } from '@preact/signals-core';

import { BaseStateHandler } from './base-state-handler.js';
import { resolveDistinctOptions } from '../config/status-quo-config.js';

import type { Signal } from '@preact/signals-core';
import type { DistinctOptions } from '../config/status-quo-config.js';

type SignalStateHandlerProps<S> = {
  initialState: S;
  options?: {
    devTools?: {
      enabled?: boolean;
      namespace: string;
    };
    distinct?: DistinctOptions<S>;
    useDistinctUntilChanged?: boolean;
  };
};

type Listener = () => void;

export abstract class SignalStateHandler<S, A> extends BaseStateHandler<S, A> {
  private readonly state: Signal<S>;
  private readonly listeners = new Map<Listener, S>();
  private readonly distinctOptions: ReturnType<typeof resolveDistinctOptions<S>>;

  protected constructor({ initialState, options }: SignalStateHandlerProps<S>) {
    super(initialState);

    this.state = signal<S>(initialState);
    this.distinctOptions = resolveDistinctOptions(options?.distinct, options?.useDistinctUntilChanged);
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
      if (this.distinctOptions.enabled && this.distinctOptions.comparator(lastSnapshot, nextState)) {
        continue;
      }

      this.listeners.set(listener, nextState);
      listener();
    }
  }
}
