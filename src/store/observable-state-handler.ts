import { BehaviorSubject, distinctUntilChanged, distinctUntilKeyChanged, map } from 'rxjs';

import { BaseStateHandler } from './base-state-handler.js';
import { resolveDistinctOptions } from '../config/status-quo-config.js';

import type { Observable } from 'rxjs';
import type { DistinctOptions } from '../config/status-quo-config.js';

type ObservableStateHandlerProps<S> = {
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

type StateObservableOptions = { useDistinctUntilChanged?: boolean };

export abstract class ObservableStateHandler<S, A> extends BaseStateHandler<S, A> {
  private readonly state$: BehaviorSubject<S>;
  private readonly distinctOptions: ReturnType<typeof resolveDistinctOptions<S>>;

  protected constructor({ initialState, options }: ObservableStateHandlerProps<S>) {
    super(initialState);
    this.state$ = new BehaviorSubject<S>(initialState);
    this.distinctOptions = resolveDistinctOptions(options?.distinct, options?.useDistinctUntilChanged);
    this.initDevTools(options?.devTools);
  }

  protected getStateValue() {
    return this.state$.getValue();
  }

  protected setStateValue(nextState: S) {
    this.state$.next(nextState);
  }

  getStateItemAsObservable(key: keyof S) {
    return this.state$.pipe(
      distinctUntilKeyChanged(key),
      map((state) => state[key])
    );
  }

  getStateAsObservable(options: StateObservableOptions = {}) {
    const useDistinctUntilChanged =
      options.useDistinctUntilChanged ?? this.distinctOptions.enabled;

    if (!useDistinctUntilChanged) {
      return this.state$;
    }

    return this.state$.pipe(
      distinctUntilChanged((previous, next) => {
        return this.distinctOptions.comparator(previous, next);
      })
    ) as Observable<S>;
  }

  getObservable(key: keyof S) {
    return this.getStateItemAsObservable(key);
  }

  /** @deprecated Use getObservable instead. */
  getObservableItem(key: keyof S) {
    return this.getObservable(key);
  }

  subscribe(listener: () => void): () => void;
  subscribe(listener: (value: S) => void): () => void;
  subscribe(listener: (value: S) => void) {
    const subscription = this.getStateAsObservable().subscribe((nextState) => {
      listener(nextState);
    });
    return () => subscription.unsubscribe();
  }
}
