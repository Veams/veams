import { useEffect } from 'react';

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
    super({ initialState: { count: startCount } });
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
    super({ initialState: { count: startCount } });
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

  const singletonSnippet = `import { makeStateSingleton, useStateSingleton } from '@veams/status-quo';

const CounterSingleton = makeStateSingleton(() => new CounterStore());

const [state, actions] = useStateSingleton(CounterSingleton);`;

  const composeSnippet = `import { combineLatest } from 'rxjs';

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
}`;

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className="app">
      <div className="brand-bar">
        <span className="brand-dot" />
        <span>Status Quo Demo</span>
      </div>
      <nav className="nav">
        <div className="nav-links">
          <a href="#overview">Overview</a>
          <a href="#quickstart">Quickstart</a>
          <a href="#factory">Factory</a>
          <a href="#demo">Demo</a>
          <a href="#singleton">Singleton</a>
          <a href="#singleton-demo">Singleton demo</a>
          <a href="#compose">Compose</a>
          <a href="#devtools">Devtools</a>
          <a href="#cleanup">Cleanup</a>
        </div>
      </nav>
      <header id="overview" className="hero intro">
        <div>
          <p className="eyebrow">Philosophy</p>
          <h1>State management that stays out of your way</h1>
          <p className="subtext">
            Status Quo treats state handlers as small, composable objects with explicit
            lifecycle and a tiny interface. Components subscribe to snapshots, not
            framework‑specific store APIs. That makes it easy to swap the engine under the
            hood—RxJS for observable streams or Preact Signals for ultra‑light reactive state.
          </p>
          <p className="subtext">
            Handlers encapsulate state transitions, expose actions, and clean up after
            themselves. You decide whether each component should have its own instance
            (factory) or share a singleton, while the UI stays blissfully unaware of the
            chosen implementation.
          </p>
        </div>
      </header>

      <section className="philosophy-grid">
        <article className="philosophy-card">
          <img src={philosophySwap} alt="Swapping state engines illustration" />
          <div>
            <h3>Swap the engine, keep the API</h3>
            <p>
              Move between RxJS observables and Signals without rewriting your components.
              Stores keep the same shape; only the internal runtime changes.
            </p>
          </div>
        </article>
        <article className="philosophy-card">
          <img src={philosophySeparation} alt="View and state separation illustration" />
          <div>
            <h3>Separate view and state</h3>
            <p>
              Handlers own transitions and expose actions. Views subscribe to snapshots and
              never touch store internals.
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
            Pick either observable or signal stores. The hooks stay the same, so you can
            swap the backend without changing your components.
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
              Use `useStateFactory` when every component instance needs its own store. You
              pass a factory function and dependencies, and the hook handles lifecycle
              cleanup for you.
            </p>
          </div>
          <pre className="code-block compact">
            <code className="language-ts">{`const [state, actions] = useStateFactory(CounterFactory, [0]);`}</code>
          </pre>
        </article>
        <article id="singleton" className="guide-card">
          <div>
            <p className="eyebrow">Singleton</p>
            <h2>One handler, many consumers</h2>
            <p>
              Use `makeStateSingleton` and `useStateSingleton` for shared stores. Ideal for
              global counters, user sessions, or any shared UI state.
            </p>
          </div>
          <pre className="code-block compact">
            <code className="language-ts">{singletonSnippet}</code>
          </pre>
        </article>
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
            Both panels below are subscribed to the same singleton handler. Update the
            controller and watch the viewer react instantly.
          </p>
        </div>
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
            declarative with operators like `combineLatest`, while Signals can derive values
            with `computed` and wire them in via `bindSubscribable`. This keeps parent stores
            lean and focused.
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
            Enable devtools to inspect actions and state transitions. Both handlers share
            the same options shape.
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
            Each handler exposes `subscribe`, `getSnapshot`, and `destroy`. Use them when
            you wire custom integrations or combine multiple stores manually.
          </p>
        </div>
        <pre className="code-block">
          <code className="language-ts">{cleanupSnippet}</code>
        </pre>
      </section>

    </div>
  );
}
