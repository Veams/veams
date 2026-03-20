<center>
<img src="assets/statusquo-logo.png" width="200" alt="StatusQuo Logo" style="margin: 0 auto;">
</center>

# @veams/status-quo 
[![npm version](https://img.shields.io/npm/v/@veams/status-quo)](https://www.npmjs.com/package/@veams/status-quo)

The manager to rule your state.

This README summarizes the package API. The full routed documentation lives in VEAMS Documentation.

## Table of Contents

1. [Overview](#overview)
2. [Philosophy](#philosophy)
3. [Docs](#docs)
4. [Quickstart](#quickstart)
5. [Handlers](#handlers)
6. [Hooks](#hooks)
7. [Providers](#providers)
8. [Singletons](#singletons)
9. [Composition](#composition)
10. [API Guide](#api-guide)
11. [Devtools](#devtools)
12. [Cleanup](#cleanup)
13. [API Reference](#api-reference)
14. [Migration](#migration)

## Overview

StatusQuo is a small, framework-agnostic state layer that focuses on explicit lifecycle, clear action APIs, and a minimal subscription surface. It ships two handler implementations with the same public interface: RxJS-backed observables and signals-backed stores.

## Philosophy

- Swap the engine, keep the API. Your UI code stays the same when you switch from RxJS to Signals.
- Separate view and state. Handlers own transitions and expose actions; views subscribe to snapshots.
- Framework-agnostic core. Business logic lives outside the UI library; hooks provide the glue.

## Docs

Live docs:

[https://veams.github.io/status-quo/packages/status-quo/getting-started](https://veams.github.io/status-quo/packages/status-quo/getting-started)

## Quickstart

Install:

```bash
npm install @veams/status-quo rxjs @preact/signals-core
```

Create a store and use it in a component:

```ts
import { ObservableStateHandler } from '@veams/status-quo';
import { useStateFactory } from '@veams/status-quo/react';

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

Optional global setup for shared defaults such as distinct behavior and Redux DevTools:

```ts
import equal from 'fast-deep-equal';
import { setupStatusQuo } from '@veams/status-quo';

setupStatusQuo({
  devTools: {
    enabled: true,
  },
  distinct: {
    comparator: equal,
  },
});
```

## Handlers

StatusQuo provides two handler implementations with the same public interface:

- `ObservableStateHandler` (RxJS-backed)
- `SignalStateHandler` (Signals-backed)

Both are built on `BaseStateHandler`, which provides the shared lifecycle and devtools support.

## Hooks

The React layer lives under `@veams/status-quo/react`.

Use `useStateHandler + useStateActions + useStateSubscription` as the base composition.
`useStateFactory` and `useStateSingleton` are shortcut APIs over that composition.
For full signatures and practical examples, see [API Guide](#api-guide).

- `useStateHandler(factory, params)`
  - Creates and memoizes one handler instance per component.
- `StateProvider({ instance })`
  - Shares one handler instance with a subtree through React context.
- `useProvidedStateHandler()`
  - Reads the nearest provider-scoped handler instance.
- `useProvidedStateActions()`
  - Returns provider-scoped actions without subscribing to state.
- `useProvidedStateSubscription(selector?, isEqual?)`
  - Subscribes to provider-scoped state and returns `[state, actions]`.
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
import {
  useStateActions,
  useStateHandler,
  useStateSubscription,
} from '@veams/status-quo/react';

const handler = useStateHandler(createUserStore, []);
const actions = useStateActions(handler);
const [name] = useStateSubscription(handler, (state) => state.user.name);

const [singletonName] = useStateSubscription(UserSingleton, (state) => state.user.name);
```

## Providers

Use provider scope when a parent should own one local handler instance and several descendants need access to that same instance.

```tsx
import {
  StateProvider,
  useProvidedStateActions,
  useProvidedStateSubscription,
  useStateHandler,
} from '@veams/status-quo/react';

function CounterScope() {
  const handler = useStateHandler(createCounterStore, []);

  return (
    <StateProvider instance={handler}>
      <CounterValue />
      <CounterButtons />
    </StateProvider>
  );
}

function CounterValue() {
  const [count] = useProvidedStateSubscription((state: CounterState) => state.count);

  return <strong>{count}</strong>;
}

function CounterButtons() {
  const actions = useProvidedStateActions<CounterState, CounterActions>();

  return <button onClick={actions.increase}>Increase</button>;
}
```

This is the scoped-sharing option between a local handler and a singleton:

- parent owns lifecycle once
- children choose whether they need state, actions, or the raw handler
- action-only components stay out of rerender fanout
- no prop drilling just to move a handler through the tree

## Singletons

Use singletons for shared state across multiple components.

```ts
import { makeStateSingleton } from '@veams/status-quo';
import { useStateSingleton } from '@veams/status-quo/react';

// Default behavior: singleton stays alive across unmounts.
const CounterSingleton = makeStateSingleton(() => new CounterStore());

const [state, actions] = useStateSingleton(CounterSingleton);
```

Destroy a singleton instance when the last consumer unmounts:

```ts
const RouteScopedCounterSingleton = makeStateSingleton(() => new CounterStore(), {
  destroyOnNoConsumers: true,
});
```

Keep the default for app-level shared state that should survive route/component unmounts. Use `destroyOnNoConsumers: true` when the shared handler should behave more like a mounted resource.

## Composition

Use only the slice you need. RxJS makes multi-source composition powerful and declarative with operators like `combineLatest`, `switchMap`, or `debounceTime`. Signals can derive values with `computed` and wire them into a parent store via `bindSubscribable`.

```ts
import { combineLatest } from 'rxjs';

// RxJS: combine handler streams (RxJS shines here)
class AppSignalStore extends SignalStateHandler<AppState, AppActions> {
  private counter$ = CounterObservableStore.getInstance().getObservable();
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

### `setupStatusQuo(config?)`

Sets global runtime defaults for distinct update behavior and Redux DevTools enablement.
Per-handler options still override the global setup.

```ts
type StatusQuoConfig = {
  devTools?: {
    enabled?: boolean; // default: false
  };
  distinct?: {
    enabled?: boolean; // default: true
    comparator?: (previous: unknown, next: unknown) => boolean; // default: JSON compare
  };
};
```

```ts
import equal from 'fast-deep-equal';
import { setupStatusQuo } from '@veams/status-quo';

setupStatusQuo({
  devTools: {
    enabled: true,
  },
  distinct: {
    comparator: equal,
  },
});
```

### `useStateHandler(factory, params?)`

Creates one handler instance per component mount and returns it.

- `factory`: function returning a `StateSubscriptionHandler`
- `params`: optional factory params tuple
- lifecycle note: params are applied when the handler instance is created for that mount

```ts
import { useStateHandler } from '@veams/status-quo/react';

const handler = useStateHandler(createUserStore, []);
```

### `StateProvider`

Shares one existing handler instance with a subtree through React context.
Use this when a parent owns lifecycle and descendants should consume the same local instance without prop drilling.

```tsx
import { StateProvider, useStateHandler } from '@veams/status-quo/react';

const handler = useStateHandler(createUserStore, []);

return <StateProvider instance={handler}>{children}</StateProvider>;
```

### `useProvidedStateHandler()`

Reads the nearest provider-scoped handler instance.
Use this as the low-level entry point when a descendant needs the raw handler for manual composition.

```ts
import { useProvidedStateHandler } from '@veams/status-quo/react';

const handler = useProvidedStateHandler<UserState, UserActions>();
```

### `useStateActions(handler)`

Returns actions from a handler without subscribing to state changes.
Use this in action-only components to avoid rerenders from state updates.

```ts
import { useStateActions, useStateHandler } from '@veams/status-quo/react';

const handler = useStateHandler(createUserStore, []);
const actions = useStateActions(handler);
```

### `useProvidedStateActions()`

Returns actions from the nearest `StateProvider` without subscribing to state.
Use this for command-only components inside a provider scope.

```ts
import { useProvidedStateActions } from '@veams/status-quo/react';

const actions = useProvidedStateActions<UserState, UserActions>();
```

### `useStateSubscription(source, selector?, isEqual?)`

Subscribes to either a handler instance or a singleton and returns `[selectedState, actions]`.

- `source`: `StateSubscriptionHandler` or `StateSingleton`
- `selector`: optional projection function; defaults to identity
- `isEqual`: optional equality function; defaults to `Object.is`

Full snapshot subscription:

```ts
import { useStateHandler, useStateSubscription } from '@veams/status-quo/react';

const handler = useStateHandler(createUserStore, []);
const [state, actions] = useStateSubscription(handler);
```

Selector subscription:

```ts
import { useStateSubscription } from '@veams/status-quo/react';

const [name, actions] = useStateSubscription(
  handler,
  (state) => state.user.name
);
```

Selector with custom equality:

```ts
import { useStateSubscription } from '@veams/status-quo/react';

const [profile] = useStateSubscription(
  handler,
  (state) => state.user.profile,
  (current, next) => current.id === next.id && current.role === next.role
);
```

Singleton source:

```ts
import { useStateSubscription } from '@veams/status-quo/react';

const [session, actions] = useStateSubscription(SessionSingleton);
```

Lifecycle note for singleton sources:
- Consumers are ref-counted.
- The singleton instance is only destroyed when the last consumer unmounts and `destroyOnNoConsumers === true`.

### `useProvidedStateSubscription(selector?, isEqual?)`

Subscribes to the nearest `StateProvider` instead of taking a source argument.
It supports full snapshots, selectors, and custom equality the same way `useStateSubscription` does.

```ts
import { useProvidedStateSubscription } from '@veams/status-quo/react';

const [state, actions] = useProvidedStateSubscription<UserState, UserActions>();
const [name] = useProvidedStateSubscription((state: UserState) => state.user.name);
```

### `useStateFactory(factory, selector?, isEqual?, params?)`

Shortcut API for `useStateHandler + useStateSubscription`.

- `useStateFactory(factory, params)`
- `useStateFactory(factory, selector, params)`
- `useStateFactory(factory, selector, isEqual, params)`

```ts
import { useStateFactory } from '@veams/status-quo/react';

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
import { makeStateSingleton } from '@veams/status-quo';

const UserSingleton = makeStateSingleton(() => new UserStore());
```

Options:

```ts
type StateSingletonOptions = {
  destroyOnNoConsumers?: boolean; // default: false
};
```

- `false` (default): keep instance alive across periods with zero consumers
- `true`: destroy instance after last consumer unmounts

```ts
import { makeStateSingleton } from '@veams/status-quo';

const RouteScopedUserSingleton = makeStateSingleton(() => new UserStore(), {
  destroyOnNoConsumers: true,
});
```

### `useStateSingleton(singleton, selector?, isEqual?)`

Shortcut API for `useStateSubscription(singleton, selector?, isEqual?)`.

```ts
import { useStateSingleton } from '@veams/status-quo/react';

const [state, actions] = useStateSingleton(UserSingleton);
const [name] = useStateSingleton(UserSingleton, (state) => state.user.name);
```

## Devtools

Status Quo supports the Redux DevTools browser extension on both `ObservableStateHandler` and `SignalStateHandler`.

Turn it on globally:

```ts
import { setupStatusQuo } from '@veams/status-quo';

setupStatusQuo({
  devTools: {
    enabled: true,
  },
});
```

Override it per handler when needed:

```ts
class CounterStore extends ObservableStateHandler<CounterState, CounterActions> {
  constructor() {
    super({
      initialState: { count: 0 },
      options: { devTools: { namespace: 'Counter' } },
    });
  }
}
```

Notes:

- `setupStatusQuo({ devTools: { enabled: true } })` enables Redux DevTools by default for handlers.
- `options.devTools` still overrides the global default per handler.
- `namespace` is optional. When omitted, Status Quo uses the handler class name.
- `setState(nextState, actionName)` sends the `actionName` to the Redux DevTools timeline.
- The current integration supports reset, commit, jump to state, and jump to action from the extension UI.
- If the extension is not installed, Status Quo logs that and continues without a devtools connection.

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
  subscribe(listener: () => void): () => void;
  subscribe(listener: (value: V) => void): () => void;
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
- `subscribe(listener: (value: S) => void): () => void` (abstract)
- `destroy(): void`
- `getActions(): A` (abstract)

Protected helpers:

- `getStateValue(): S` (abstract)
- `setStateValue(next: S): void` (abstract)
- `initDevTools(options?: { enabled?: boolean; namespace?: string }): void`
- `bindSubscribable<T>(service: { subscribe: (listener: (value: T) => void) => () => void; getSnapshot?: () => T }, onChange: (value: T) => void, selector?: (value: T) => T, isEqual?: (current: T, next: T) => boolean): void`
- `bindSubscribable<T, Sel>(service: { subscribe: (listener: (value: T) => void) => () => void; getSnapshot?: () => T }, onChange: (value: Sel) => void, selector: (value: T) => Sel, isEqual?: (current: Sel, next: Sel) => boolean): void`
  - Registers the subscription on `this.subscriptions` and invokes `onChange` with the current snapshot when available.
  - If `selector` is omitted, identity selection is used.
  - `onChange` is only called when selected value changes according to `isEqual` (default `Object.is`).

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
    devTools?: { enabled?: boolean; namespace?: string };
    distinct?: {
      enabled?: boolean;
      comparator?: (previous: S, next: S) => boolean;
    };
    useDistinctUntilChanged?: boolean; // optional override
  };
})
```

Public methods:

- `getObservable(options?: { useDistinctUntilChanged?: boolean }): Observable<S>`
- `getObservableItem(key: keyof S): Observable<S[keyof S]>`
- `subscribe(listener: () => void): () => void`
- `subscribe(listener: (value: S) => void): () => void`

Notes:
- The observable stream uses `distinctUntilChanged` by default.
- Distinct behavior can be configured globally via `setupStatusQuo` or per handler via `options.distinct`.
- Devtools can be enabled globally via `setupStatusQuo({ devTools: { enabled: true } })` or overridden per handler via `options.devTools`.
- `subscribe` fires immediately with the current snapshot and then on subsequent changes.
- Subscribers receive the next state snapshot as a callback argument.

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
    devTools?: { enabled?: boolean; namespace?: string };
    distinct?: {
      enabled?: boolean;
      comparator?: (previous: S, next: S) => boolean;
    };
    useDistinctUntilChanged?: boolean;
  };
})
```

Public methods:

- `getSignal(): Signal<S>`
- `subscribe(listener: () => void): () => void`
- `subscribe(listener: (value: S) => void): () => void`

Notes:
- Distinct behavior defaults to enabled.
- Configure it globally via `setupStatusQuo` or per handler via `options.distinct`.
- Devtools can be enabled globally via `setupStatusQuo({ devTools: { enabled: true } })` or overridden per handler via `options.devTools`.
- `useDistinctUntilChanged` remains available as a shorthand enable/disable override.

### `setupStatusQuo`

```ts
type StatusQuoConfig = {
  devTools?: {
    enabled?: boolean;
  };
  distinct?: {
    enabled?: boolean;
    comparator?: (previous: unknown, next: unknown) => boolean;
  };
};

function setupStatusQuo(config?: StatusQuoConfig): void
```

### `makeStateSingleton`

```ts
type StateSingletonOptions = {
  destroyOnNoConsumers?: boolean; // default: false
};

function makeStateSingleton<S, A>(
  factory: () => StateSubscriptionHandler<S, A>,
  options?: StateSingletonOptions
): {
  getInstance: () => StateSubscriptionHandler<S, A>;
}
```

Lifecycle behavior:
- `destroyOnNoConsumers: false` (default): keep the same singleton instance alive when no component is subscribed.
- `destroyOnNoConsumers: true`: destroy and recreate singleton instances with mount lifecycle.

### Hooks

- React entrypoint: `@veams/status-quo/react`
- `useStateHandler<V, A, P extends unknown[]>(factory: (...args: P) => StateSubscriptionHandler<V, A>, params?: P)`
  - Returns `StateSubscriptionHandler<V, A>`.
- `StateProvider<V, A>({ instance }: { instance: StateSubscriptionHandler<V, A> })`
  - Shares a handler instance with a subtree.
- `useProvidedStateHandler<V, A>()`
  - Returns `StateSubscriptionHandler<V, A>`.
- `useProvidedStateActions<V, A>()`
  - Returns `A`.
- `useProvidedStateSubscription<V, A, Sel = V>(selector?: (state: V) => Sel, isEqual?: (current: Sel, next: Sel) => boolean)`
  - Returns `[state, actions]`.
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
3. Replace `getStateAsObservable()` with `getObservable()`.
4. Replace `getStateItemAsObservable()` and keyed `getObservable(key)` with `getObservableItem(key)`.
5. Move React hooks and `StateProvider` imports from `@veams/status-quo` or `@veams/status-quo/hooks` to `@veams/status-quo/react`.
6. Update devtools config:
   - From: `super({ initialState, devTools: { ... } })`
   - To: `super({ initialState, options: { devTools: { ... } } })`
