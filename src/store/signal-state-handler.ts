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

export abstract class SignalStateHandler<S, A> extends BaseStateHandler<S, A> {
  private readonly state: Signal<S>;
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

  subscribe(listener: () => void): () => void;
  subscribe(listener: (value: S) => void): () => void;
  subscribe(listener: (value: S) => void) {
    let initialized = false;
    let previousSnapshot = this.state.value;

    return this.state.subscribe((nextState) => {
      if (!initialized) {
        initialized = true;
        previousSnapshot = nextState;
        return;
      }

      if (this.distinctOptions.enabled && this.distinctOptions.comparator(previousSnapshot, nextState)) {
        previousSnapshot = nextState;
        return;
      }

      previousSnapshot = nextState;
      listener(nextState);
    });
  }

  protected getStateValue() {
    return this.state.value;
  }

  protected setStateValue(nextState: S) {
    this.state.value = nextState;
  }
}
