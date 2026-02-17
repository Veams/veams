# Status Quo Documentation

This page mirrors the demo content and adds a full API reference.

## Table of Contents

1. [Overview](#overview)
2. [Philosophy](#philosophy)
3. [Demo](#demo)
4. [Quickstart](#quickstart)
5. [Handlers](#handlers)
6. [Hooks](#hooks)
7. [Singletons](#singletons)
8. [Composition](#composition)
9. [Devtools](#devtools)
10. [Cleanup](#cleanup)
11. [API Reference](#api-reference)
12. [Migration](#migration)

## Overview

Status Quo is a small, framework-agnostic state layer that focuses on explicit lifecycle, clear action APIs, and a minimal subscription surface. It ships two handler implementations with the same public interface: RxJS-backed observables and signals-backed stores.

## Philosophy

- Swap the engine, keep the API. Your UI code stays the same when you switch from RxJS to Signals.
- Separate view and state. Handlers own transitions and expose actions; views subscribe to snapshots.
- Framework-agnostic core. Business logic lives outside the UI library; hooks provide the glue.

## Demo

Live docs and demo:

[https://veams.github.io/status-quo/](https://veams.github.io/status-quo/)

## Quickstart

Install:

```bash
npm install @veams/status-quo rxjs @preact/signals-core
```

Create a store and use it in a component:

```ts
import { ObservableStateHandler, useStateFactory } from '@veams/status-quo';

type CounterState = { count: number };

type CounterActions = {
  increase: () => void;
  decrease: () => void;
};

class CounterStore extends ObservableStateHandler<CounterState, CounterActions> {
  constructor() {
    super({ initialState: { count: 0 } });
  }

  getActions(): CounterActions {
    return {
      increase: () => this.setState({ count: this.getState().count + 1 }),
      decrease: () => this.setState({ count: this.getState().count - 1 }),
    };
  }
}

const [state, actions] = useStateFactory(() => new CounterStore(), []);
```

## Handlers

Status Quo provides two handler implementations with the same public interface:

- `ObservableStateHandler` (RxJS-backed)
- `SignalStateHandler` (Signals-backed)

Both are built on `BaseStateHandler`, which provides the shared lifecycle and devtools support.

## Hooks

- `useStateFactory(factory, deps)`
  - Creates a handler instance per component and subscribes to its snapshot.
  - Suitable for per-component or per-instance state.
- `useStateSingleton(singleton)`
  - Uses a shared singleton handler across components.

## Singletons

```ts
import { makeStateSingleton, useStateSingleton } from '@veams/status-quo';

const CounterSingleton = makeStateSingleton(() => new CounterStore());

const [state, actions] = useStateSingleton(CounterSingleton);
```

## Composition

Use only the slice you need. RxJS makes multi-source composition powerful and declarative with operators like `combineLatest`, `switchMap`, or `debounceTime`. Signals can derive values with `computed` and wire them into a parent store via `bindSubscribable`.

```ts
import { combineLatest } from 'rxjs';

// RxJS: combine handler streams (RxJS shines here)
combineLatest([
  CounterStateHandler.getInstance(),
  new CardStateHandler(),
]).subscribe(([counterState, cardState]) => {
  this.setState({
    counter: counterState,
    cardTitle: cardState.title,
  });
});

// Signals: combine derived values via computed + bindSubscribable
import { computed } from '@preact/signals-core';

class AppSignalStore extends SignalStateHandler<AppState, AppActions> {
  private counter = new CounterSignalHandler();
  private card = new CardSignalHandler();
  private combined = computed(() => ({
    counter: this.counter.getSignal().value,
    cardTitle: this.card.getSignal().value.title,
  }));

  constructor() {
    super({ initialState: this.combined.value });

    this.bindSubscribable(
      { subscribe: this.combined.subscribe.bind(this.combined), getSnapshot: () => this.combined.value },
      (nextState) => this.setState(nextState, 'sync-combined')
    );
  }
}
```

## Devtools

Enable Redux Devtools integration with `options.devTools`:

```ts
class CounterStore extends ObservableStateHandler<CounterState, CounterActions> {
  constructor() {
    super({
      initialState: { count: 0 },
      options: { devTools: { enabled: true, namespace: 'Counter' } },
    });
  }
}
```

## Cleanup

Handlers expose `subscribe`, `getSnapshot`, and `destroy` for custom integrations:

```ts
const unsubscribe = store.subscribe(() => {
  console.log(store.getSnapshot());
});

unsubscribe();
store.destroy();
```

## API Reference

### `StateSubscriptionHandler<V, A>`

Required interface implemented by all handlers.

```ts
interface StateSubscriptionHandler<V, A> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => V;
  destroy: () => void;
  getInitialState: () => V;
  getActions: () => A;
}
```

### `BaseStateHandler<S, A>`

Shared base class for all handlers.

Constructor:

```ts
protected constructor(initialState: S)
```

Public methods:

- `getInitialState(): S`
- `getState(): S`
- `getSnapshot(): S`
- `setState(next: Partial<S>, actionName = 'change'): void`
- `subscribe(listener: () => void): () => void` (abstract)
- `destroy(): void`
- `getActions(): A` (abstract)

Protected helpers:

- `getStateValue(): S` (abstract)
- `setStateValue(next: S): void` (abstract)
- `initDevTools(options?: { enabled?: boolean; namespace: string }): void`
- `bindSubscribable<T>(service: { subscribe: (listener: (value: T) => void) => () => void; getSnapshot?: () => T }, onChange: (value: T) => void): void`
  - Registers the subscription on `this.subscriptions` and invokes `onChange` with the current snapshot when available.

### `ObservableStateHandler<S, A>`

RxJS-backed handler. Extends `BaseStateHandler`.

Constructor:

```ts
protected constructor({
  initialState,
  options
}: {
  initialState: S;
  options?: {
    devTools?: { enabled?: boolean; namespace: string };
  };
})
```

Public methods:

- `getStateAsObservable(options?: { useDistinctUntilChanged?: boolean }): Observable<S>`
- `getStateItemAsObservable(key: keyof S): Observable<S[keyof S]>`
- `getObservableItem(key: keyof S): Observable<S[keyof S]>`
- `subscribe(listener: () => void): () => void`

Notes:
- The observable stream uses `distinctUntilChanged` by default (JSON compare).
- `subscribe` does not fire for the initial value; it only fires on subsequent changes.

### `SignalStateHandler<S, A>`

Signals-backed handler. Extends `BaseStateHandler`.

Constructor:

```ts
protected constructor({
  initialState,
  options
}: {
  initialState: S;
  options?: {
    devTools?: { enabled?: boolean; namespace: string };
    useDistinctUntilChanged?: boolean;
  };
})
```

Public methods:

- `getSignal(): Signal<S>`
- `subscribe(listener: () => void): () => void`

Notes:
- `useDistinctUntilChanged` defaults to `true` (JSON compare).

### `makeStateSingleton`

```ts
function makeStateSingleton<S, A>(
  factory: () => StateSubscriptionHandler<S, A>
): {
  getInstance: () => StateSubscriptionHandler<S, A>;
}
```

### Hooks

- `useStateFactory<V, A, P extends unknown[]>(factory: (...args: P) => StateSubscriptionHandler<V, A>, params?: P)`
  - Returns `[state, actions]`.
- `useStateSingleton<V, A>(singleton: StateSingleton<V, A>)`
  - Returns `[state, actions]`.

## Migration

From pre-1.0 releases:

1. Rename `StateHandler` → `ObservableStateHandler`.
2. Implement `subscribe()` and `getSnapshot()` on custom handlers.
3. Replace `getObservable()` usage with `subscribe()` in custom integrations.
4. Update devtools config:
   - From: `super({ initialState, devTools: { ... } })`
   - To: `super({ initialState, options: { devTools: { ... } } })`
