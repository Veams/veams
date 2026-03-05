import { useEffect, useState } from 'react';

import {
  makeStateSingleton,
  ObservableStateHandler,
  SignalStateHandler,
  useStateFactory,
  useStateSingleton,
} from '@veams/status-quo';

import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-bash';

import philosophySwap from './assets/philosophy-swap.svg';
import philosophySeparation from './assets/philosophy-separation.svg';
import philosophyAgnostic from './assets/philosophy-agnostic.svg';
import statusQuoLogo from './assets/statusquo-logo.png';

type CounterState = {
  count: number;
};

type CounterActions = {
  increase: () => void;
  decrease: () => void;
  reset: () => void;
};

class ObservableCounterStateHandler extends ObservableStateHandler<CounterState, CounterActions> {
  constructor(startCount = 0) {
    super({
      initialState: { count: startCount },
      options: { devTools: { enabled: true, namespace: 'Counter as Observable' } },
    });
  }

  getActions(): CounterActions {
    return {
      increase: () => {
        this.setState({ count: this.getState().count + 1 }, 'increase');
      },
      decrease: () => {
        const current = this.getState().count;
        this.setState({ count: Math.max(0, current - 1) }, 'decrease');
      },
      reset: () => {
        this.setState(this.getInitialState(), 'reset');
      },
    };
  }
}

class SignalCounterStateHandler extends SignalStateHandler<CounterState, CounterActions> {
  constructor(startCount = 0) {
    super({ initialState: { count: startCount },
      options: { devTools: { enabled: true, namespace: 'Counter as Signal' } },
    });
  }

  getActions(): CounterActions {
    return {
      increase: () => {
        this.setState({ count: this.getState().count + 1 }, 'increase');
      },
      decrease: () => {
        const current = this.getState().count;
        this.setState({ count: Math.max(0, current - 1) }, 'decrease');
      },
      reset: () => {
        this.setState(this.getInitialState(), 'reset');
      },
    };
  }
}

const SingletonCounterStore = makeStateSingleton(() => new ObservableCounterStateHandler(5));

function ObservableCounterFactory(start = 0) {
  return new ObservableCounterStateHandler(start);
}

function SignalCounterFactory(start = 0) {
  return new SignalCounterStateHandler(start);
}

type CounterCardProps = {
  title: string;
  subtitle: string;
  state: CounterState;
  actions: CounterActions;
  snippet: string;
};

function CounterCard({ title, subtitle, state, actions, snippet }: CounterCardProps) {
  return (
    <section className="card">
      <div className="card-header">
        <div>
          <p className="eyebrow">{subtitle}</p>
          <h2>{title}</h2>
        </div>
        <div className="count-chip">{state.count}</div>
      </div>
      <pre className="code-block">
        <code className="language-ts">{snippet}</code>
      </pre>
      <div className="count-display">
        <span className="count-label">Count</span>
        <span className="count-value">{state.count}</span>
      </div>
      <div className="actions">
        <button type="button" className="btn" onClick={actions.decrease}>
          Decrease
        </button>
        <button type="button" className="btn primary" onClick={actions.increase}>
          Increase
        </button>
        <button type="button" className="btn ghost" onClick={actions.reset}>
          Reset
        </button>
      </div>
    </section>
  );
}

function SingletonControls() {
  const [state, actions] = useStateSingleton(SingletonCounterStore);

  return (
    <div className="singleton-card">
      <p className="eyebrow">Controller</p>
      <h3>Shared Counter</h3>
      <p className="muted">Interact with the singleton store.</p>
      <div className="singleton-count">{state.count}</div>
      <div className="actions">
        <button type="button" className="btn" onClick={actions.decrease}>
          Decrease
        </button>
        <button type="button" className="btn primary" onClick={actions.increase}>
          Increase
        </button>
        <button type="button" className="btn ghost" onClick={actions.reset}>
          Reset
        </button>
      </div>
    </div>
  );
}

function SingletonDisplay() {
  const [state] = useStateSingleton(SingletonCounterStore);

  return (
    <div className="singleton-card">
      <p className="eyebrow">Viewer</p>
      <h3>Another Consumer</h3>
      <p className="muted">Updates whenever the singleton changes.</p>
      <div className="singleton-count highlight">{state.count}</div>
      <div className="singleton-hint">Same store instance, different component.</div>
    </div>
  );
}

export function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [observableState, observableActions] = useStateFactory(ObservableCounterFactory, [0]);
  const [signalState, signalActions] = useStateFactory(SignalCounterFactory, [0]);

  const installSnippet = `npm install @veams/status-quo rxjs @preact/signals-core`;

  const quickstartSnippet = `import { ObservableStateHandler, useStateFactory } from '@veams/status-quo';

class CounterStore extends ObservableStateHandler<CounterState, CounterActions> {
  constructor() {
    super({ initialState: { count: 0 } });
  }

  getActions() {
    return {
      increase: () => this.setState({ count: this.getState().count + 1 })
    };
  }
}

const [state, actions] = useStateFactory(() => new CounterStore(), []);`;

  const observableSnippet = `class CounterStore extends ObservableStateHandler<CounterState, CounterActions> {
  constructor() {
    super({ initialState: { count: 0 } });
  }

  getActions() {
    return {
      increase: () => this.setState({ count: this.getState().count + 1 }),
      decrease: () => this.setState({ count: this.getState().count - 1 })
    };
  }
}`;

  const signalSnippet = `class CounterStore extends SignalStateHandler<CounterState, CounterActions> {
  constructor() {
    super({ initialState: { count: 0 } });
  }

  getActions() {
    return {
      increase: () => this.setState({ count: this.getState().count + 1 }),
      decrease: () => this.setState({ count: this.getState().count - 1 })
    };
  }
}`;

  const devToolsSnippet = `class CounterStore extends ObservableStateHandler<CounterState, CounterActions> {
  constructor() {
    super({
      initialState: { count: 0 },
      options: { devTools: { enabled: true, namespace: 'Counter' } }
    });
  }
}`;

  const cleanupSnippet = `const unsubscribe = store.subscribe(() => {
  console.log(store.getSnapshot());
});

unsubscribe();
store.destroy();`;

  const singletonOptionsSnippet = `import { makeStateSingleton, useStateSingleton } from '@veams/status-quo';

const SessionSingleton = makeStateSingleton(() => new SessionStore(), {
  // true (default): destroy when no consumers are mounted
  // false: keep singleton instance alive across unmounts
  destroyOnNoConsumers: false
});

const [state, actions] = useStateSingleton(SessionSingleton);`;

  const apiUseStateHandlerSnippet = `const handler = useStateHandler(createUserStore, []);`;

  const apiUseStateActionsSnippet = `const handler = useStateHandler(createUserStore, []);
const actions = useStateActions(handler);

actions.rename('Ada');`;

  const apiUseStateSubscriptionSnippet = `const handler = useStateHandler(createUserStore, []);

const [fullState] = useStateSubscription(handler);
const [name] = useStateSubscription(handler, (state) => state.user.name);
const [profile] = useStateSubscription(
  handler,
  (state) => state.user.profile,
  (current, next) => current.id === next.id && current.role === next.role
);`;

  const apiUseStateFactorySnippet = `const [state, actions] = useStateFactory(createUserStore, []);
const [name] = useStateFactory(createUserStore, (state) => state.user.name, []);
const [profile] = useStateFactory(
  createUserStore,
  (state) => state.user.profile,
  (current, next) => current.id === next.id,
  []
);`;

  const apiMakeStateSingletonSnippet = `const SessionSingleton = makeStateSingleton(() => new SessionStore(), {
  destroyOnNoConsumers: true // default
});

const PersistentSessionSingleton = makeStateSingleton(() => new SessionStore(), {
  destroyOnNoConsumers: false
});`;

  const apiUseStateSingletonSnippet = `const [state, actions] = useStateSingleton(SessionSingleton);
const [userName] = useStateSingleton(SessionSingleton, (state) => state.user.name);

// Same behavior via useStateSubscription:
const [session] = useStateSubscription(SessionSingleton);`;

  const apiSetupStatusQuoSnippet = `import equal from 'fast-deep-equal';
import { setupStatusQuo } from '@veams/status-quo';

setupStatusQuo({
  distinct: {
    comparator: equal
  }
});`;

  const composeSnippet = `import { combineLatest } from "rxjs";

// RxJS: combine handler streams (RxJS shines here)
class AppSignalStore extends SignalStateHandler<AppState, AppActions> {
  private counter$ = CounterObservableStore.getInstance().getStateAsObservable();
  private card$ = new CardObservableHandler();

  constructor() {
    super({ initialState: { counter: 0, cardTitle: "" }});
    
    this.subscriptions.push(
      combineLatest([
        this.counter$,
        this.card$,
      ]).subscribe(([counterState, cardState]) => {
        this.setState({
          counter: counterState,
          cardTitle: cardState.title,
        }, "sync-combined");
      })
    )
  }

}

// Signals: combine derived values via computed + bindSubscribable
import { computed } from "@preact/signals-core";

class AppSignalStore extends SignalStateHandler<AppState, AppActions> {
  private counter = CounterSignalHandler.getInstance().getSignal();
  private card = new CardSignalHandler();
  private combined = computed(() => ({
    counter: this.counter.getSignal().value,
    cardTitle: this.card.getSignal().value.title,
  }));

  constructor() {
    super({ initialState: { counter: 0, cardTitle: "" }});

    this.bindSubscribable(
      { subscribe: this.combined.subscribe.bind(this.combined), getSnapshot: () => this.combined.value },
      (nextState) => this.setState(nextState, "sync-combined")
    );
  }
}`;

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const closeNav = () => {
    setIsNavOpen(false);
  };

  return (
    <div className="app">
      <div className="brand-bar">
        <img src={statusQuoLogo} alt="StatusQuo logo" className="brand-logo" />
      </div>
      <nav className="nav">
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={isNavOpen}
          aria-controls="docs-nav-links"
          onClick={() => setIsNavOpen((open) => !open)}
        >
          Sections
        </button>
        <div id="docs-nav-links" className={`nav-links${isNavOpen ? ' is-open' : ''}`}>
          <a href="#overview" onClick={closeNav}>
            Overview
          </a>
          <a href="#quickstart" onClick={closeNav}>
            Quickstart
          </a>
          <a href="#factory" onClick={closeNav}>
            Factory
          </a>
          <a href="#selectors" onClick={closeNav}>
            Selectors
          </a>
          <a href="#api" onClick={closeNav}>
            API
          </a>
          <a href="#demo" onClick={closeNav}>
            Demo
          </a>
          <a href="#singleton" onClick={closeNav}>
            Singleton
          </a>
          <a href="#singleton-demo" onClick={closeNav}>
            Singleton demo
          </a>
          <a href="#compose" onClick={closeNav}>
            Compose
          </a>
          <a href="#devtools" onClick={closeNav}>
            Devtools
          </a>
          <a href="#cleanup" onClick={closeNav}>
            Cleanup
          </a>
        </div>
      </nav>
      <header id="overview" className="hero intro">
        <div>
          <p className="eyebrow">Philosophy</p>
          <h1>State management that stays out of your way</h1>
          <p className="subtext">
            <span>StatusQuo</span> treats state handlers as small, composable objects with explicit
            lifecycle and a tiny interface. Components subscribe to snapshots, not
            framework‑specific store APIs. That makes it easy to swap the engine under the hood—RxJS
            for observable streams or Preact Signals for ultra‑light reactive state.
          </p>
          <p className="subtext">
            Handlers encapsulate state transitions, expose actions, and clean up after themselves.
            You decide whether each component should have its own instance (factory) or share a
            singleton, while the UI stays blissfully unaware of the chosen implementation.
          </p>
        </div>
      </header>

      <section className="philosophy-grid">
        <article className="philosophy-card">
          <img src={philosophySwap} alt="Swapping state engines illustration" />
          <div>
            <h3>Swap the engine, keep the API</h3>
            <p>
              Move between RxJS observables and Signals without rewriting your components. Stores
              keep the same shape; only the internal runtime changes.
            </p>
          </div>
        </article>
        <article className="philosophy-card">
          <img src={philosophySeparation} alt="View and state separation illustration" />
          <div>
            <h3>Separate view and state</h3>
            <p>
              Handlers own transitions and expose actions. Views subscribe to snapshots and never
              touch store internals.
            </p>
          </div>
        </article>
        <article className="philosophy-card">
          <img src={philosophyAgnostic} alt="Framework-agnostic state core illustration" />
          <div>
            <h3>Framework‑agnostic core</h3>
            <p>
              Your state logic lives outside any UI library. Hooks provide the glue, not the
              business logic.
            </p>
          </div>
        </article>
      </section>

      <section id="quickstart" className="doc-section">
        <div className="doc-copy">
          <p className="eyebrow">Quickstart</p>
          <h2>Install and wire up a handler</h2>
          <p>
            Pick either observable or signal stores. The hooks stay the same, so you can swap the
            backend without changing your components.
          </p>
        </div>
        <div className="doc-snippets">
          <pre className="code-block compact">
            <code className="language-bash">{installSnippet}</code>
          </pre>
          <pre className="code-block compact">
            <code className="language-ts">{quickstartSnippet}</code>
          </pre>
        </div>
      </section>

      <section className="guide">
        <article id="factory" className="guide-card">
          <div>
            <p className="eyebrow">Factory</p>
            <h2>Fresh handler per mount</h2>
            <p>
              Use `useStateFactory` when each component instance needs its own store.
            </p>
            <p className="guide-highlight">Local state, zero cross-talk, predictable lifecycles.</p>
          </div>
        </article>
        <article id="singleton" className="guide-card">
          <div>
            <p className="eyebrow">Singleton</p>
            <h2>One handler, many consumers</h2>
            <p>
              Use `makeStateSingleton` + `useStateSingleton` for shared state across components.
            </p>
            <p className="guide-highlight">One source of truth, synced everywhere.</p>
          </div>
        </article>
        <article id="selectors" className="guide-card">
          <div>
            <p className="eyebrow">Selectors</p>
            <h2>Avoid rerender fanout</h2>
            <p>
              Subscribe only to the state slice you need with selector + equality functions.
            </p>
            <p className="guide-highlight">Read less, rerender less, ship smoother UIs.</p>
          </div>
        </article>
      </section>

      <section id="api" className="doc-section">
        <div className="doc-copy">
          <p className="eyebrow">API</p>
          <h2>Detailed hook and singleton reference</h2>
        </div>
        <div className="api-flow">
          <div className="api-group">
            <article className="api-composition-card">
              <h3>Base composition</h3>
              <p>
                Build explicit lifecycles with `useStateHandler`, pull actions with
                `useStateActions`, and subscribe to exact slices with `useStateSubscription`.
              </p>
              <p className="api-composition-punch">Maximum control, minimum magic.</p>
            </article>
            <div className="api-grid">
              <article className="api-card">
                <h3>useStateHandler(factory, params?)</h3>
                <p>Creates one handler instance per component mount and reuses it across rerenders.</p>
                <pre className="code-block compact">
                  <code className="language-ts">{apiUseStateHandlerSnippet}</code>
                </pre>
              </article>

              <article className="api-card">
                <h3>useStateActions(handler)</h3>
                <p>Returns actions without subscribing to state updates.</p>
                <pre className="code-block compact">
                  <code className="language-ts">{apiUseStateActionsSnippet}</code>
                </pre>
              </article>

              <article className="api-card api-card-wide">
                <h3>useStateSubscription(source, selector?, isEqual?)</h3>
                <p>
                  Core subscription hook. Source can be a handler or singleton. Returns
                  `[selectedState, actions]`.
                </p>
                <pre className="code-block compact">
                  <code className="language-ts">{apiUseStateSubscriptionSnippet}</code>
                </pre>
              </article>
            </div>
          </div>

          <div className="api-group">
            <article className="api-composition-card">
              <h3>Shortcut composition</h3>
              <p>
                Reduce wiring with `useStateFactory` and `useStateSingleton` when you want
                the same behavior in a smaller API surface.
              </p>
              <p className="api-composition-punch">Less wiring, same behavior.</p>
            </article>
            <div className="api-grid">
              <article className="api-card">
                <h3>useStateFactory(factory, selector?, isEqual?, params?)</h3>
                <p>
                  Shortcut for handler creation + subscription. Supports full state and selected
                  slices.
                </p>
                <pre className="code-block compact">
                  <code className="language-ts">{apiUseStateFactorySnippet}</code>
                </pre>
              </article>

              <article className="api-card">
                <h3>useStateSingleton(singleton, selector?, isEqual?)</h3>
                <p>
                  Shortcut for subscribing to a singleton. Selector and equality semantics match
                  `useStateSubscription`.
                </p>
                <pre className="code-block compact">
                  <code className="language-ts">{apiUseStateSingletonSnippet}</code>
                </pre>
              </article>
            </div>
          </div>

          <div className="api-group">
            <article className="api-composition-card">
              <h3>Helper function</h3>
              <p>
                Configure global distinct behavior once with `setupStatusQuo` and create shared
                singleton providers with `makeStateSingleton`.
              </p>
              <p className="api-composition-punch">One setup, consistent behavior.</p>
            </article>
            <div className="api-grid">
              <article className="api-card">
                <h3>setupStatusQuo(config?)</h3>
                <p>
                  Defines global runtime defaults for distinct update behavior. Per-handler options
                  still override global config.
                </p>
                <pre className="code-block compact">
                  <code className="language-ts">{apiSetupStatusQuoSnippet}</code>
                </pre>
              </article>

              <article className="api-card">
                <h3>makeStateSingleton(factory, options?)</h3>
                <p>
                  Creates a shared handler provider. `destroyOnNoConsumers` controls instance
                  teardown.
                </p>
                <pre className="code-block compact">
                  <code className="language-ts">{apiMakeStateSingletonSnippet}</code>
                </pre>
              </article>
            </div>
          </div>
        </div>
      </section>

      <div id="demo" className="grid">
        <CounterCard
          title="Observable State Handler"
          subtitle="RxJS BehaviorSubject"
          state={observableState}
          actions={observableActions}
          snippet={observableSnippet}
        />
        <CounterCard
          title="Signal State Handler"
          subtitle="Preact Signals"
          state={signalState}
          actions={signalActions}
          snippet={signalSnippet}
        />
      </div>

      <section id="singleton-demo" className="doc-section">
        <div className="doc-copy">
          <p className="eyebrow">Singleton demo</p>
          <h2>One store, multiple components</h2>
          <p>
            Both panels below are subscribed to the same singleton handler. Update the controller
            and watch the viewer react instantly. The handler is only disposed once the last
            consumer unmounts (unless persistence is enabled).
          </p>
          <p>
            `makeStateSingleton(factory, options)` always returns one shared instance.
            `destroyOnNoConsumers` controls whether that instance is torn down when the last
            `useStateSingleton` consumer unmounts.
          </p>
        </div>
        <pre className="code-block compact">
          <code className="language-ts">{singletonOptionsSnippet}</code>
        </pre>
        <div className="singleton-grid">
          <SingletonControls />
          <SingletonDisplay />
        </div>
      </section>

      <section id="compose" className="doc-section">
        <div className="doc-copy">
          <p className="eyebrow">Compose</p>
          <h2>Combine multiple handlers</h2>
          <p>
            Use only the slice you need. RxJS makes multi-source composition powerful and
            declarative with operators like `combineLatest`, `switchMap`, or `debounceTime`. Signals
            can derive values with `computed` and wire them into a parent store via
            `bindSubscribable`. This keeps parent stores lean and focused.
          </p>
        </div>
        <pre className="code-block">
          <code className="language-ts">{composeSnippet}</code>
        </pre>
      </section>

      <section id="devtools" className="doc-section">
        <div className="doc-copy">
          <p className="eyebrow">Devtools</p>
          <h2>Redux devtools integration</h2>
          <p>
            Enable devtools to inspect actions and state transitions. Both handlers share the same
            options shape.
          </p>
        </div>
        <pre className="code-block">
          <code className="language-ts">{devToolsSnippet}</code>
        </pre>
      </section>

      <section id="cleanup" className="doc-section">
        <div className="doc-copy">
          <p className="eyebrow">Cleanup</p>
          <h2>Controlled teardown</h2>
          <p>
            Each handler exposes `subscribe`, `getSnapshot`, and `destroy`. Use them when you wire
            custom integrations or combine multiple stores manually.
          </p>
        </div>
        <pre className="code-block">
          <code className="language-ts">{cleanupSnippet}</code>
        </pre>
      </section>
    </div>
  );
}
