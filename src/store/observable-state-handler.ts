import { BehaviorSubject, distinctUntilKeyChanged, map, pipe, distinctUntilChanged } from 'rxjs';

import { BaseStateHandler } from './base-state-handler.js';

import type { Observable } from 'rxjs';

type ObservableStateHandlerProps<S> = {
  initialState: S;
  options?: {
    devTools?: {
      enabled?: boolean;
      namespace: string;
    };
  };
};

type StateObservableOptions = { useDistinctUntilChanged?: boolean };

function distinctUntilChangedAsJson<T>() {
  return pipe<Observable<T>, Observable<T>>(
    distinctUntilChanged((a, b) => {
      return JSON.stringify(a) === JSON.stringify(b);
    })
  );
}

const pipeMap = {
  useDistinctUntilChanged: distinctUntilChangedAsJson(),
};

export abstract class ObservableStateHandler<S, A> extends BaseStateHandler<S, A> {
  private readonly state$: BehaviorSubject<S>;

  protected constructor({ initialState, options }: ObservableStateHandlerProps<S>) {
    super(initialState);
    this.state$ = new BehaviorSubject<S>(initialState);
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

  getStateAsObservable(
    options: StateObservableOptions = {
      useDistinctUntilChanged: true,
    }
  ) {
    // Unfortunately we cannot add pipe operators conditionally in an easy manner.
    // That's why we use a simple object to attach operators to a new state observable via reduce().
    // This way we can easily extend our default operators map.
    return Object.keys(options)
      .filter((optionKey) => options[optionKey as keyof StateObservableOptions] === true)
      .map((enabledOptions) => pipeMap[enabledOptions as keyof StateObservableOptions])
      .reduce((stateObservable$, operator) => {
        return stateObservable$.pipe(operator) as BehaviorSubject<S>;
      }, this.state$);
  }

  getObservable(key: keyof S) {
    return this.getStateItemAsObservable(key);
  }

  /** @deprecated Use getObservable instead. */
  getObservableItem(key: keyof S) {
    return this.getObservable(key);
  }

  subscribe(listener: () => void) {
    let initialized = false;
    const subscription = this.getStateAsObservable().subscribe(() => {
      if (!initialized) {
        initialized = true;
        return;
      }

      listener();
    });
    return () => subscription.unsubscribe();
  }
}
