import { BehaviorSubject, distinctUntilChanged, distinctUntilKeyChanged, map } from 'rxjs';

import { resolveDistinctOptions } from '../config/status-quo-config.js';
import { BaseStateHandler } from './base-state-handler.js';

import type { DevToolsOptions, DistinctOptions } from '../config/status-quo-config.js';
import type { Observable } from 'rxjs';

type ObservableStateHandlerProps<S> = {
  initialState: S;
  options?: {
    devTools?: DevToolsOptions;
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
    this.distinctOptions = resolveDistinctOptions(
      options?.distinct,
      options?.useDistinctUntilChanged
    );
    this.initDevTools(options?.devTools);
  }

  protected getStateValue() {
    return this.state$.getValue();
  }

  protected setStateValue(nextState: S) {
    this.state$.next(nextState);
  }

  getObservableItem<K extends keyof S>(key: K): Observable<S[K]> {
    return this.state$.pipe(
      distinctUntilKeyChanged(key),
      map((state) => state[key])
    );
  }

  getObservable(options: StateObservableOptions = {}): Observable<S> {
    const useDistinctUntilChanged = options.useDistinctUntilChanged ?? this.distinctOptions.enabled;

    if (!useDistinctUntilChanged) {
      return this.state$;
    }

    return this.state$.pipe(
      distinctUntilChanged((previous, next) => {
        return this.distinctOptions.comparator(previous, next);
      })
    );
  }

  subscribe(listener: () => void): () => void;
  subscribe(listener: (value: S) => void): () => void;
  subscribe(listener: (value: S) => void) {
    const subscription = this.getObservable().subscribe((nextState) => {
      listener(nextState);
    });
    return () => subscription.unsubscribe();
  }
}
