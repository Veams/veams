<center>
<img src="assets/statusquo-logo.png" width="200" alt="StatusQuo Logo" style="margin: 0 auto;">
</center>

# @veams/status-quo 
[![npm version](https://img.shields.io/npm/v/@veams/status-quo)](https://www.npmjs.com/package/@veams/status-quo)

The manager to rule your state.

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
9. [API Guide](#api-guide)
10. [Devtools](#devtools)
11. [Cleanup](#cleanup)
12. [API Reference](#api-reference)
13. [Migration](#migration)

## Overview

StatusQuo is a small, framework-agnostic state layer that focuses on explicit lifecycle, clear action APIs, and a minimal subscription surface. It ships two handler implementations with the same public interface: RxJS-backed observables and signals-backed stores.

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

StatusQuo provides two handler implementations with the same public interface:

- `ObservableStateHandler` (RxJS-backed)
- `SignalStateHandler` (Signals-backed)

Both are built on `BaseStateHandler`, which provides the shared lifecycle and devtools support.

## Hooks

Use `useStateHandler + useStateActions + useStateSubscription` as the base composition.
`useStateFactory` and `useStateSingleton` are shortcut APIs over that composition.
For full signatures and practical examples, see [API Guide](#api-guide).

- `useStateHandler(factory, params)`
  - Creates and memoizes one handler instance per component.
- `useStateActions(handler)`
  - Returns actions without subscribing to state.
- `useStateSubscription(handlerOrSingleton, selector?, isEqual?)`
  - Subscribes to full state or a selected slice and returns `[state, actions]`.
- `useStateFactory(factory, selector?, isEqual?, params?)`
  - Shortcut for `useStateHandler + useStateSubscription`.
- `useStateSingleton(singleton, selector?, isEqual?)`
  - Shortcut for `useStateSubscription(singleton, selector?, isEqual?)`.

Recommended composition:

```ts
const handler = useStateHandler(createUserStore, []);
const actions = useStateActions(handler);
const [name] = useStateSubscription(handler, (state) => state.user.name);

const [singletonName] = useStateSubscription(UserSingleton, (state) => state.user.name);
```

## Singletons

Use singletons for shared state across multiple components.

```ts
import { makeStateSingleton, useStateSingleton } from '@veams/status-quo';

// Default behavior: singleton is destroyed when the last consumer unmounts.
const CounterSingleton = makeStateSingleton(() => new CounterStore());

const [state, actions] = useStateSingleton(CounterSingleton);
```

Keep a singleton instance alive across unmounts:

```ts
const PersistentCounterSingleton = makeStateSingleton(() => new CounterStore(), {
  destroyOnNoConsumers: false,
});
```

Use this for app-level stores that should survive route/component unmounts. Keep the default for stores that should release resources when unused.

## Composition

Use only the slice you need. RxJS makes multi-source composition powerful and declarative with operators like `combineLatest`, `switchMap`, or `debounceTime`. Signals can derive values with `computed` and wire them into a parent store via `bindSubscribable`.

```ts
import { combineLatest } from 'rxjs';

// RxJS: combine handler streams (RxJS shines here)
class AppSignalStore extends SignalStateHandler<AppState, AppActions> {
  private counter$ = CounterObservableStore.getInstance().getStateAsObservable();
  private card$ = new CardObservableHandler();

  constructor() {
    super({ initialState: { counter: 0, cardTitle: '' }});

    this.subscriptions.push(
      combineLatest([
        this.counter$,
        this.card$,
      ]).subscribe(([counterState, cardState]) => {
        this.setState({
          counter: counterState,
          cardTitle: cardState.title,
        }, 'sync-combined');
      })
    )
  }

}

// Signals: combine derived values via computed + bindSubscribable
import { computed } from '@preact/signals-core';

class AppSignalStore extends SignalStateHandler<AppState, AppActions> {
  private counter = CounterSignalHandler.getInstance();
  private card = new CardSignalHandler();
  private combined$ = computed(() => ({
    counter: this.counter.getSignal().value,
    cardTitle: this.card.getSignal().value.title,
  }));

  constructor() {
    super({ initialState: { counter: 0, cardTitle: '' }});

    this.bindSubscribable(
      { subscribe: this.combined.subscribe.bind(this.combined), getSnapshot: () => this.combined.value },
      (nextState) => this.setState(nextState, 'sync-combined')
    );
  }
}
```

## API Guide

This section documents the primary public API with behavior notes and usage examples.

### `useStateHandler(factory, params?)`

Creates one handler instance per component mount and returns it.

- `factory`: function returning a `StateSubscriptionHandler`
- `params`: optional factory params tuple
- lifecycle note: params are applied when the handler instance is created for that mount

```ts
const handler = useStateHandler(createUserStore, []);
```

### `useStateActions(handler)`

Returns actions from a handler without subscribing to state changes.
Use this in action-only components to avoid rerenders from state updates.

```ts
const handler = useStateHandler(createUserStore, []);
const actions = useStateActions(handler);
```

### `useStateSubscription(source, selector?, isEqual?)`

Subscribes to either a handler instance or a singleton and returns `[selectedState, actions]`.

- `source`: `StateSubscriptionHandler` or `StateSingleton`
- `selector`: optional projection function; defaults to identity
- `isEqual`: optional equality function; defaults to `Object.is`

Full snapshot subscription:

```ts
const handler = useStateHandler(createUserStore, []);
const [state, actions] = useStateSubscription(handler);
```

Selector subscription:

```ts
const [name, actions] = useStateSubscription(
  handler,
  (state) => state.user.name
);
```

Selector with custom equality:

```ts
const [profile] = useStateSubscription(
  handler,
  (state) => state.user.profile,
  (current, next) => current.id === next.id && current.role === next.role
);
```

Singleton source:

```ts
const [session, actions] = useStateSubscription(SessionSingleton);
```

Lifecycle note for singleton sources:
- Consumers are ref-counted.
- The singleton instance is only destroyed when the last consumer unmounts and `destroyOnNoConsumers !== false`.

### `useStateFactory(factory, selector?, isEqual?, params?)`

Shortcut API for `useStateHandler + useStateSubscription`.

- `useStateFactory(factory, params)`
- `useStateFactory(factory, selector, params)`
- `useStateFactory(factory, selector, isEqual, params)`

```ts
const [state, actions] = useStateFactory(createUserStore, []);
const [name] = useStateFactory(createUserStore, (state) => state.user.name, []);
const [profile] = useStateFactory(
  createUserStore,
  (state) => state.user.profile,
  (current, next) => current.id === next.id,
  []
);
```

### `makeStateSingleton(factory, options?)`

Creates a shared singleton provider for a handler instance.

```ts
const UserSingleton = makeStateSingleton(() => new UserStore());
```

Options:

```ts
type StateSingletonOptions = {
  destroyOnNoConsumers?: boolean; // default: true
};
```

- `true` (default): destroy instance after last consumer unmounts
- `false`: keep instance alive across periods with zero consumers

```ts
const PersistentUserSingleton = makeStateSingleton(() => new UserStore(), {
  destroyOnNoConsumers: false,
});
```

### `useStateSingleton(singleton, selector?, isEqual?)`

Shortcut API for `useStateSubscription(singleton, selector?, isEqual?)`.

```ts
const [state, actions] = useStateSingleton(UserSingleton);
const [name] = useStateSingleton(UserSingleton, (state) => state.user.name);
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
- `getObservable(key: keyof S): Observable<S[keyof S]>`
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
type StateSingletonOptions = {
  destroyOnNoConsumers?: boolean; // default: true
};

function makeStateSingleton<S, A>(
  factory: () => StateSubscriptionHandler<S, A>,
  options?: StateSingletonOptions
): {
  getInstance: () => StateSubscriptionHandler<S, A>;
}
```

Lifecycle behavior:
- `destroyOnNoConsumers: true` (default): destroy and recreate singleton instances with mount lifecycle.
- `destroyOnNoConsumers: false`: keep the same singleton instance alive when no component is subscribed.

### Hooks

- `useStateHandler<V, A, P extends unknown[]>(factory: (...args: P) => StateSubscriptionHandler<V, A>, params?: P)`
  - Returns `StateSubscriptionHandler<V, A>`.
- `useStateActions<V, A>(handler: StateSubscriptionHandler<V, A>)`
  - Returns `A`.
- `useStateSubscription<V, A, Sel = V>(source: StateSubscriptionHandler<V, A> | StateSingleton<V, A>, selector?: (state: V) => Sel, isEqual?: (current: Sel, next: Sel) => boolean)`
  - Returns `[state, actions]`.
- `useStateFactory<V, A, P extends unknown[], Sel = V>(factory: (...args: P) => StateSubscriptionHandler<V, A>, selector?: (state: V) => Sel, isEqual?: (current: Sel, next: Sel) => boolean, params?: P)`
  - Returns `[state, actions]`.
- `useStateSingleton<V, A, Sel = V>(singleton: StateSingleton<V, A>, selector?: (state: V) => Sel, isEqual?: (current: Sel, next: Sel) => boolean)`
  - Returns `[state, actions]`.

## Migration

From pre-1.0 releases:

1. Rename `StateHandler` -> `ObservableStateHandler`.
2. Implement `subscribe()` and `getSnapshot()` on custom handlers.
3. Replace `getObservable()` usage with `subscribe()` in custom integrations.
4. Update devtools config:
   - From: `super({ initialState, devTools: { ... } })`
   - To: `super({ initialState, options: { devTools: { ... } } })`
