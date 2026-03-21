export type CodeExample = {
  code: string;
  label: string;
  language: string;
};

export type FeatureCard = {
  description: string;
  title: string;
  visual:
    | 'cache-orchestration'
    | 'form-feature-owner'
    | 'framework-core'
    | 'handle-command'
    | 'passive-snapshot'
    | 'swap-engine'
    | 'view-state'
    | 'methodology-regions'
    | 'methodology-components'
    | 'methodology-utilities'
    | 'methodology-layout';
};

export type LiveExampleId =
  | 'status-quo-local-draft'
  | 'status-quo-singleton-workspace'
  | 'status-quo-composition-checklist'
  | 'status-quo-provider-wizard'
  | 'status-quo-selector-profile';

export type ContentBlock = {
  bullets?: string[];
  callout?: string;
  codeExamples?: CodeExample[];
  featureCards?: FeatureCard[];
  id: string;
  liveExample?: LiveExampleId;
  paragraphs: string[];
  title: string;
};

export type PackagePage = {
  blocks: ContentBlock[];
  eyebrow: string;
  heroBullets?: string[];
  heroParagraphs?: string[];
  id: string;
  intro: string;
  summary: string;
  title: string;
};

export type DocsNavSection = {
  id: string;
  pages: PackagePage[];
  title: string;
};

export type DocsPackage = {
  accent: string;
  description: string;
  githubPath?: string;
  id: string;
  npm?: string;
  sections: DocsNavSection[];
  title: string;
};

const statusQuoInstall = `npm install @veams/status-quo`;

const statusQuoQueryInstall = `npm install @veams/status-quo-query @tanstack/query-core`;

const statusQuoQuickStartHandler = `import { NativeStateHandler } from '@veams/status-quo';

type DraftState = {
  summary: string;
  title: string;
  tone: 'plain' | 'warm';
};

type DraftActions = {
  reset: () => void;
  setSummary: (summary: string) => void;
  setTitle: (title: string) => void;
  toggleTone: () => void;
};

const initialDraftState: DraftState = {
  summary: 'Ship the docs examples with clearer ownership boundaries.',
  title: 'Status Quo notes',
  tone: 'plain',
};

export class DraftNoteHandler extends NativeStateHandler<DraftState, DraftActions> {
  constructor() {
    super({ initialState: initialDraftState });
  }

  getActions(): DraftActions {
    return {
      reset: () => this.setState({ ...initialDraftState }, 'reset'),
      setSummary: (summary) => this.setState({ summary }, 'set-summary'),
      setTitle: (title) => this.setState({ title }, 'set-title'),
      toggleTone: () =>
        this.setState(
          { tone: this.getState().tone === 'plain' ? 'warm' : 'plain' },
          'toggle-tone'
        ),
    };
  }
}`;

const statusQuoQuickStartComponent = `import { useStateFactory } from '@veams/status-quo/react';

import { DraftNoteHandler } from './draft-note-handler';

function DraftNoteCard() {
  const [state, actions] = useStateFactory(() => new DraftNoteHandler(), []);

  return (
    <section>
      <input
        onChange={(event) => actions.setTitle(event.target.value)}
        value={state.title}
      />

      <textarea
        onChange={(event) => actions.setSummary(event.target.value)}
        value={state.summary}
      />

      <button onClick={actions.toggleTone} type="button">
        Tone: {state.tone}
      </button>
      <button onClick={actions.reset} type="button">
        Reset
      </button>
    </section>
  );
}`;

const statusQuoSingletonHandlerExample = `import {
  NativeStateHandler,
  makeStateSingleton,
} from '@veams/status-quo';

type CounterState = {
  count: number;
};

type CounterActions = {
  decrement: () => void;
  increment: () => void;
  incrementByFive: () => void;
  reset: () => void;
};

class SharedCounterHandler extends NativeStateHandler<CounterState, CounterActions> {
  constructor() {
    super({
      initialState: {
        count: 0,
      },
    });
  }

  getActions(): CounterActions {
    return {
      decrement: () => this.setState({ count: this.getState().count - 1 }, 'decrement'),
      increment: () => this.setState({ count: this.getState().count + 1 }, 'increment'),
      incrementByFive: () => this.setState({ count: this.getState().count + 5 }, 'increment-by-five'),
      reset: () => this.setState({ count: 0 }, 'reset'),
    };
  }
}

export const sharedCounterSingleton = makeStateSingleton(
  () => new SharedCounterHandler()
);`;

const statusQuoSingletonComponentExample = `import { useStateSingleton } from '@veams/status-quo/react';

import { sharedCounterSingleton } from './shared-counter-handler';

function CounterControls() {
  const [state, actions] = useStateSingleton(sharedCounterSingleton);

  return (
    <>
      <button onClick={actions.decrement} type="button">
        -1
      </button>
      <button onClick={actions.increment} type="button">
        +1
      </button>
      <button onClick={actions.incrementByFive} type="button">
        +5
      </button>
      <button onClick={actions.reset} type="button">
        Reset
      </button>
      <p>Count: {state.count}</p>
    </>
  );
}

function CounterSummary() {
  const [state] = useStateSingleton(sharedCounterSingleton);

  return (
    <p>
      Shared counter snapshot: {state.count}
    </p>
  );
}`;

const statusQuoProviderHandlerExample = `import { NativeStateHandler } from '@veams/status-quo';

export type WizardState = {
  completed: number;
  step: number;
  totalSteps: number;
};

export type WizardActions = {
  completeStep: () => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
};

class WizardFlowHandler extends NativeStateHandler<WizardState, WizardActions> {
  constructor() {
    super({
      initialState: {
        completed: 1,
        step: 2,
        totalSteps: 4,
      },
    });
  }

  getActions(): WizardActions {
    return {
      completeStep: () =>
        this.setState(
          { completed: Math.min(this.getState().completed + 1, this.getState().totalSteps) },
          'complete-step'
        ),
      nextStep: () =>
        this.setState(
          { step: Math.min(this.getState().step + 1, this.getState().totalSteps) },
          'next-step'
        ),
      previousStep: () =>
        this.setState({ step: Math.max(this.getState().step - 1, 1) }, 'previous-step'),
      reset: () => this.setState({ completed: 1, step: 2, totalSteps: 4 }, 'reset'),
    };
  }
}

export const createWizardFlowHandler = () => new WizardFlowHandler();`;

const statusQuoProviderComponentExample = `import {
  StateProvider,
  useProvidedStateActions,
  useProvidedStateSubscription,
  useStateHandler,
} from '@veams/status-quo/react';

import {
  createWizardFlowHandler,
  type WizardActions,
  type WizardState,
} from './wizard-flow-handler';

function WizardScope() {
  const handler = useStateHandler(createWizardFlowHandler, []);

  return (
    <StateProvider instance={handler}>
      <WizardProgress />
      <WizardCommands />
    </StateProvider>
  );
}

function WizardProgress() {
  const [state] = useProvidedStateSubscription(
    (currentState: WizardState) => currentState
  );

  return (
    <p>
      Step {state.step} / {state.totalSteps}, completed {state.completed}
    </p>
  );
}

function WizardCommands() {
  const actions = useProvidedStateActions<WizardState, WizardActions>();

  return (
    <>
      <button onClick={actions.previousStep} type="button">
        Back
      </button>
      <button onClick={actions.nextStep} type="button">
        Next
      </button>
      <button onClick={actions.completeStep} type="button">
        Complete
      </button>
      <button onClick={actions.reset} type="button">
        Reset
      </button>
    </>
  );
}`;

const statusQuoCompositionHandlerExample = `import { NativeStateHandler } from '@veams/status-quo';

type ChecklistState = {
  completed: number;
  total: number;
};

type ChecklistActions = {
  complete: () => void;
  reopen: () => void;
  reset: () => void;
};

const initialChecklistState: ChecklistState = {
  completed: 1,
  total: 4,
};

class ChecklistHandler extends NativeStateHandler<ChecklistState, ChecklistActions> {
  constructor() {
    super({ initialState: initialChecklistState });
  }

  getActions(): ChecklistActions {
    return {
      complete: () =>
        this.setState(
          { completed: Math.min(this.getState().completed + 1, this.getState().total) },
          'complete'
        ),
      reopen: () =>
        this.setState({ completed: Math.max(this.getState().completed - 1, 0) }, 'reopen'),
      reset: () => this.setState({ ...initialChecklistState }, 'reset'),
    };
  }
}

export const createChecklistHandler = () => new ChecklistHandler();`;

const statusQuoCompositionComponentExample = `import {
  useStateActions,
  useStateHandler,
  useStateSubscription,
} from '@veams/status-quo/react';

import { createChecklistHandler } from './checklist-handler';

type ChecklistHandler = ReturnType<typeof createChecklistHandler>;

function ChecklistExample() {
  const handler = useStateHandler(createChecklistHandler, []);

  return (
    <>
      <ChecklistSummary handler={handler} />
      <ChecklistControls handler={handler} />
    </>
  );
}

function ChecklistSummary({ handler }: { handler: ChecklistHandler }) {
  const [completed] = useStateSubscription(handler, (state) => state.completed);
  const [total] = useStateSubscription(handler, (state) => state.total);

  return (
    <p>
      {completed} of {total} done
    </p>
  );
}

function ChecklistControls({ handler }: { handler: ChecklistHandler }) {
  const actions = useStateActions(handler);
  const [canComplete] = useStateSubscription(handler, (state) => state.completed < state.total);
  const [canReopen] = useStateSubscription(handler, (state) => state.completed > 0);

  return (
    <>
      <button disabled={!canComplete} onClick={actions.complete} type="button">
        Complete one
      </button>
      <button disabled={!canReopen} onClick={actions.reopen} type="button">
        Reopen one
      </button>
      <button onClick={actions.reset} type="button">
        Reset
      </button>
    </>
  );
}`;

const statusQuoSelectorHandlerExample = `import { NativeStateHandler } from '@veams/status-quo';

type ProfileState = {
  profile: {
    name: string;
    role: 'editor' | 'reviewer';
  };
  ui: {
    saves: number;
    theme: 'paper' | 'night';
  };
};

type ProfileActions = {
  cycleRole: () => void;
  rename: () => void;
  reset: () => void;
  toggleTheme: () => void;
  touchSave: () => void;
};

class ProfileHandler extends NativeStateHandler<ProfileState, ProfileActions> {
  constructor() {
    super({
      initialState: {
        profile: {
          name: 'Mila',
          role: 'editor',
        },
        ui: {
          saves: 2,
          theme: 'paper',
        },
      },
    });
  }

  getActions(): ProfileActions {
    return {
      cycleRole: () =>
        this.setState(
          {
            profile: {
              ...this.getState().profile,
              role: this.getState().profile.role === 'editor' ? 'reviewer' : 'editor',
            },
          },
          'cycle-role'
        ),
      rename: () =>
        this.setState(
          {
            profile: {
              ...this.getState().profile,
              name: this.getState().profile.name === 'Mila' ? 'Jon' : 'Mila',
            },
          },
          'rename'
        ),
      reset: () =>
        this.setState(
          {
            profile: {
              name: 'Mila',
              role: 'editor',
            },
            ui: {
              saves: 2,
              theme: 'paper',
            },
          },
          'reset'
        ),
      toggleTheme: () =>
        this.setState(
          {
            ui: {
              ...this.getState().ui,
              theme: this.getState().ui.theme === 'paper' ? 'night' : 'paper',
            },
          },
          'toggle-theme'
        ),
      touchSave: () =>
        this.setState(
          {
            ui: {
              ...this.getState().ui,
              saves: this.getState().ui.saves + 1,
            },
          },
          'touch-save'
        ),
    };
  }
}

export const createProfileHandler = () => new ProfileHandler();`;

const statusQuoSelectorComponentExample = `import { useRef } from 'react';
import {
  useStateActions,
  useStateHandler,
  useStateSubscription,
} from '@veams/status-quo/react';

import { createProfileHandler } from './profile-handler';

type ProfileHandlerInstance = ReturnType<typeof createProfileHandler>;

function ProfileExample() {
  const handler = useStateHandler(createProfileHandler, []);

  return (
    <>
      <IdentityCard handler={handler} />
      <DiagnosticsCard handler={handler} />
      <ProfileControls handler={handler} />
    </>
  );
}

function IdentityCard({ handler }: { handler: ProfileHandlerInstance }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const [identity] = useStateSubscription(
    handler,
    (state) => ({
      name: state.profile.name,
      role: state.profile.role,
    }),
    (current, next) => current.name === next.name && current.role === next.role
  );

  return (
    <p>
      {identity.name} ({identity.role}) renders: {renderCount.current}
    </p>
  );
}

function DiagnosticsCard({ handler }: { handler: ProfileHandlerInstance }) {
  const [state] = useStateSubscription(handler);

  return (
    <p>
      Theme {state.ui.theme}, saves {state.ui.saves}
    </p>
  );
}

function ProfileControls({ handler }: { handler: ProfileHandlerInstance }) {
  const actions = useStateActions(handler);

  return (
    <>
      <button onClick={actions.rename} type="button">
        Rename
      </button>
      <button onClick={actions.cycleRole} type="button">
        Cycle role
      </button>
      <button onClick={actions.toggleTheme} type="button">
        Toggle theme
      </button>
      <button onClick={actions.touchSave} type="button">
        Save
      </button>
      <button onClick={actions.reset} type="button">
        Reset
      </button>
    </>
  );
}`;

const statusQuoSelectorExample = `const [identity] = useStateSubscription(
  handler,
  (state) => ({
    name: state.profile.name,
    role: state.profile.role,
  }),
  (current, next) => current.name === next.name && current.role === next.role
);`;

const statusQuoSelectorSimpleExample = `const [name] = useStateSubscription(
  handler,
  (state) => state.profile.name
);`;

const statusQuoSelectorProvidedExample = `const [progress] = useProvidedStateSubscription(
  (state) => ({
    completed: state.completed,
    step: state.step,
  }),
  (current, next) => current.completed === next.completed && current.step === next.step
);`;

const statusQuoSelectorSingletonExample = `const [count] = useStateSingleton(
  sharedCounterSingleton,
  (state) => state.count
);`;

const statusQuoObservableHandlerExample = `import {
  ObservableStateHandler,
  makeStateSingleton,
} from '@veams/status-quo';
import { distinctUntilChanged, map } from 'rxjs';

type Viewport = 'compact' | 'wide';

type UiState = { viewport: Viewport };
type UiActions = { setViewport: (viewport: Viewport) => void };

class UiStateHandler extends ObservableStateHandler<UiState, UiActions> {
  constructor() {
    super({
      initialState: {
        viewport: 'compact',
      },
    });
  }

  getActions(): UiActions {
    return {
      setViewport: (viewport) => this.setState({ viewport }, 'set-viewport'),
    };
  }
}

// Keep viewport ownership in one shared UI singleton.
const uiStateSingleton = makeStateSingleton(() => new UiStateHandler());

type CounterState = {
  count: number;
  step: number;
};

type CounterActions = {
  increase: () => void;
};

class CounterHandler extends ObservableStateHandler<CounterState, CounterActions> {
  constructor() {
    super({
      initialState: {
        count: 0,
        step: 1,
      },
    });

    // React to the shared UI singleton and derive the local step from it.
    const uiStateHandler = uiStateSingleton.getInstance();
    const step$ = uiStateHandler.getObservable().pipe(
      // Derive the step from the shared UI state.
      map((uiState) => (uiState.viewport === 'compact' ? 1 : 5)),
      // Ignore repeated step values.
      distinctUntilChanged()
    );

    this.bindSubscribable(
      {
        subscribe: (listener) => {
          const subscription = step$.subscribe(listener);

          return () => subscription.unsubscribe();
        },
        getSnapshot: () => (uiStateHandler.getState().viewport === 'compact' ? 1 : 5),
      },
      // Keep the counter state in sync with the derived step.
      (step) => {
        this.setState({ step }, 'sync-step-from-viewport');
      }
    );
  }

  getActions(): CounterActions {
    return {
      increase: () => {
        const { count, step } = this.getState();
        // The current viewport influences how far the counter jumps.
        this.setState({ count: count + step }, 'increase');
      },
    };
  }
}`;

const statusQuoSignalHandlerExample = `import { computed } from '@preact/signals-core';
import {
  SignalStateHandler,
  makeStateSingleton,
} from '@veams/status-quo';

type Viewport = 'compact' | 'wide';

type UiState = { viewport: Viewport };
type UiActions = { setViewport: (viewport: Viewport) => void };

class UiStateHandler extends SignalStateHandler<UiState, UiActions> {
  constructor() {
    super({
      initialState: {
        viewport: 'compact',
      },
    });
  }

  getActions(): UiActions {
    return {
      setViewport: (viewport) => this.setState({ viewport }, 'set-viewport'),
    };
  }
}

// Keep viewport ownership in one shared UI singleton.
const uiStateSingleton = makeStateSingleton(() => new UiStateHandler());

type CounterState = {
  count: number;
  step: number;
};

type CounterActions = {
  increase: () => void;
};

class CounterHandler extends SignalStateHandler<CounterState, CounterActions> {
  constructor() {
    super({
      initialState: {
        count: 0,
        step: 1,
      },
    });

    const uiStateHandler = uiStateSingleton.getInstance();
    const stepSignal = computed(() => {
      // Derive the step from the shared viewport.
      return uiStateHandler.getSignal().value.viewport === 'compact' ? 1 : 5;
    });

    // The same composition shape works here as well.
    this.bindSubscribable(
      {
        subscribe: (listener) => stepSignal.subscribe(listener),
        getSnapshot: () => stepSignal.value,
      },
      // Keep the counter state in sync with the derived step.
      (step) => {
        this.setState({ step }, 'sync-step-from-viewport');
      }
    );
  }

  getActions(): CounterActions {
    return {
      increase: () => {
        const { count, step } = this.getState();
        // The current viewport influences how far the counter jumps.
        this.setState({ count: count + step }, 'increase');
      },
    };
  }
}`;

const statusQuoBaseCompositionExample = `import {
  useStateActions,
  useStateHandler,
  useStateSubscription,
} from '@veams/status-quo/react';

const createCounterHandler = () => new CounterHandler();

function CounterCard() {
  // Create and own the handler instance for this component.
  const handler = useStateHandler(createCounterHandler, []);

  // Read actions without coupling them to the selected state subscription.
  const actions = useStateActions(handler);

  // Subscribe only to the slice the view actually renders.
  const [count] = useStateSubscription(handler, (state) => state.count);

  return <button onClick={actions.increase}>{count}</button>;
}`;

const statusQuoShortcutCompositionExample = `import { useStateFactory } from '@veams/status-quo/react';

const createCounterHandler = () => new CounterHandler();

function CounterCard() {
  // The shortcut creates the handler and subscribes in one step.
  const [count, actions] = useStateFactory(
    createCounterHandler,
    (state) => state.count,
    []
  );

  return <button onClick={actions.increase}>{count}</button>;
}`;

const statusQuoBindSubscribableExample = `import { SignalStateHandler } from '@veams/status-quo';

type CounterState = { count: number };
type CounterActions = { increase: () => void };

class CounterHandler extends SignalStateHandler<CounterState, CounterActions> {
  constructor() {
    super({
      initialState: {
        count: 0,
      },
    });
  }

  getActions(): CounterActions {
    return {
      increase: () => this.setState({ count: this.getState().count + 1 }, 'increase'),
    };
  }
}

type BucketState = { bucket: number };
type BucketActions = { reset: () => void };

class CounterBucketHandler extends SignalStateHandler<BucketState, BucketActions> {
  constructor(source: CounterHandler) {
    super({
      initialState: {
        bucket: 0,
      },
    });

    this.bindSubscribable(
      source,
      (bucket) => this.setState({ bucket }, 'sync-bucket'),
      (counterState) => ({
        bucket: Math.floor(counterState.count / 10),
      }),
      (current, next) => current.bucket === next.bucket
    );
  }

  getActions(): BucketActions {
    return {
      reset: () => this.setState({ bucket: 0 }, 'reset'),
    };
  }
}

const counter = new CounterHandler();
const bucket = new CounterBucketHandler(counter);`;

const statusQuoGlobalSetup = `import { setupStatusQuo } from '@veams/status-quo';

setupStatusQuo({
  devTools: {
    enabled: true,
  },
  distinct: {
    enabled: true,
    comparator: (previous, next) => JSON.stringify(previous) === JSON.stringify(next),
  },
});`;

const statusQuoDevToolsExample = `import { SignalStateHandler } from '@veams/status-quo';

type CounterState = { count: number };
type CounterActions = {
  decrease: () => void;
  increase: () => void;
  reset: () => void;
};

class CounterHandler extends SignalStateHandler<CounterState, CounterActions> {
  constructor() {
    super({
      initialState: { count: 0 },
      options: {
        // Override the default class-name label for this handler only.
        devTools: {
          namespace: 'Counter',
        },
      },
    });
  }

  getActions(): CounterActions {
    return {
      decrease: () => this.setState({ count: this.getState().count - 1 }, 'decrease'),
      increase: () => this.setState({ count: this.getState().count + 1 }, 'increase'),
      reset: () => this.setState({ count: 0 }, 'reset'),
    };
  }
}`;

const statusQuoGlobalDevToolsSetup = `import { setupStatusQuo } from '@veams/status-quo';

setupStatusQuo({
  devTools: {
    enabled: true,
  },
});`;

const statusQuoQueryQuickStart = `import { QueryClient } from '@tanstack/query-core';
import { setupQueryProvider } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const cache = setupQueryProvider(queryClient);

const userQuery = cache.createQuery(['user', 42], () => fetchUser(42), {
  enabled: false,
});

const updateUser = cache.createMutation(saveUser);

await userQuery.refetch();
await updateUser.mutate({ id: 42, name: 'Ada' });`;

const statusQuoQueryInvalidateExample = `await userQuery.invalidate({ refetchType: 'none' });
await cache.invalidateQueries({ queryKey: ['user'] });

cache.setQueryData(['user', 42], (current) =>
  current ? { ...current, name: 'Ada' } : current
);`;

const statusQuoQueryEscapeHatchExample = `const rawResult = userQuery.unsafe_getResult();
const rawClient = cache.unsafe_getClient();

rawClient.cancelQueries({ queryKey: ['user', 42] });`;

const statusQuoQueryFrameworkImports = `import { QueryClient } from '@tanstack/query-core';
import { setupQueryProvider } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const cache = setupQueryProvider(queryClient);`;

const statusQuoApiImports = `import {
  NativeStateHandler,
  ObservableStateHandler,
  SignalStateHandler,
  makeStateSingleton,
  setupStatusQuo,
} from '@veams/status-quo';
import {
  StateProvider,
  useProvidedStateActions,
  useProvidedStateHandler,
  useProvidedStateSubscription,
  useStateActions,
  useStateFactory,
  useStateHandler,
  useStateSingleton,
  useStateSubscription,
} from '@veams/status-quo/react';`;

const statusQuoHookUseStateHandlerExample = `const handler = useStateHandler(createDraftHandler, []);`;

const statusQuoHookStateProviderExample = `const handler = useStateHandler(createWizardFlowHandler, []);

return <StateProvider instance={handler}>{children}</StateProvider>;`;

const statusQuoHookUseProvidedStateHandlerExample = `const handler = useProvidedStateHandler();
handler.destroy();`;

const statusQuoHookUseStateActionsExample = `const actions = useStateActions(handler);
actions.save();`;

const statusQuoHookUseProvidedStateActionsExample = `const actions = useProvidedStateActions();
actions.nextStep();`;

const statusQuoHookUseStateSubscriptionExample = `const [profile, actions] = useStateSubscription(
  handler,
  (state) => state.profile
);`;

const statusQuoHookUseProvidedStateSubscriptionExample = `const [step] = useProvidedStateSubscription(
  (state) => state.step
);`;

const statusQuoHookUseStateFactoryExample = `const [state, actions] = useStateFactory(
  () => new DraftNoteHandler(),
  []
);`;

const statusQuoHookUseStateSingletonExample = `const [state, actions] = useStateSingleton(sharedCounterSingleton);`;

const statusQuoSubpathImports = `import {
  StateProvider,
  useProvidedStateSubscription,
  useStateFactory,
  useStateSubscription,
} from '@veams/status-quo/react';
import { ObservableStateHandler, makeStateSingleton } from '@veams/status-quo/store';`;

const statusQuoFrameworkCoreImports = `import {
  NativeStateHandler,
  ObservableStateHandler,
  SignalStateHandler,
  makeStateSingleton,
  setupStatusQuo,
} from '@veams/status-quo';`;

const statusQuoFrameworkReactImports = `import {
  StateProvider,
  useProvidedStateSubscription,
  useStateFactory,
  useStateSingleton,
  useStateSubscription,
} from '@veams/status-quo/react';`;

const statusQuoQueryApiImports = `import {
  setupQueryProvider,
  setupMutation,
  setupQuery,
  isQueryLoading,
  toQueryMetaState,
} from '@veams/status-quo-query';`;

const statusQuoPhilosophyCards: FeatureCard[] = [
  {
    description:
      'The native handler has zero dependencies. When you need more, move to RxJS or Signals without rewriting your components. Stores keep the same shape; only the internal runtime changes.',
    title: 'Zero dependencies, total scale',
    visual: 'swap-engine',
  },
  {
    description:
      'Handlers own transitions and expose actions. Views subscribe to snapshots and never touch store internals.',
    title: 'Separate view and state',
    visual: 'view-state',
  },
  {
    description:
      'Your state logic lives outside any UI library. Hooks provide the glue, not the business logic.',
    title: 'Framework-agnostic core',
    visual: 'framework-core',
  },
];

const statusQuoQueryPhilosophyCards: FeatureCard[] = [
  {
    description:
      'A snapshot should describe query state, not hide behavior inside it. Read state through `getSnapshot()`, act through explicit methods.',
    title: 'Read state, call commands',
    visual: 'passive-snapshot',
  },
  {
    description:
      'Exact-key behavior belongs on a handle. Broad cache work belongs on the cache facade. The API should make that scope visible.',
    title: 'Keep command scope honest',
    visual: 'handle-command',
  },
  {
    description:
      'Cross-query coordination should be explicit and centralized, so invalidation, refetching, and cache updates stay readable.',
    title: 'Coordinate through the cache',
    visual: 'cache-orchestration',
  },
];

const formOverviewCards: FeatureCard[] = [
  {
    description:
      'A feature handler can own one FormStateHandler as part of a broader screen workflow, while React bindings stay at the edge for inputs and submit wiring.',
    title: 'FormState inside feature state',
    visual: 'form-feature-owner',
  },
];

const methodologyInstrumentExample = `<section class="r-stage">
  <div class="u-grid-row">
    <article class="c-article c-article--default">
      <header class="c-article__header">
        <h1 class="c-article__header-headline">Clear roles make markup readable.</h1>
      </header>
      <div class="c-article__content">
        Layout comes from the region. Reusable UI comes from the component.
      </div>
    </article>
  </div>
</section>`;

const methodologyClassNamingExample = `<article class="c-article c-article--default is-bg-higlight-1">
  <header class="c-article__header is-header">
    <time class="c-article__header-time" datetime="">11/16/2016</time>
    <h1 class="c-article__header-headline">Article Headline</h1>
    <h2 class="c-article__header-subline">Article Subline</h2>
    <p class="c-article__header-intro">This is an intro text which can be used in every article component.</p>
  </header>
  <div class="c-article__content is-visible">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam aperiam architecto atque cupiditate dicta earum
    ex facilis harum incidunt, laboriosam officiis placeat quas recusandae, rerum, sit tempore tenetur. Impedit, velit.
  </div>
  <footer class="c-article__footer is-margin">
    <a class="c-article__footer-link" href="#">Footer Link in Article</a>
  </footer>
</article>`;

const methodologyDepthGoodExample = `<article class="c-article">
  <header class="c-article__header">
    <h1 class="c-article__header-h1">The methodology is designed for large, long-lived projects.</h1>
    <h2 class="c-article__header-h2">This is how we keep Sass structure scalable.</h2>
  </header>
  <div class="c-article__content"></div>
</article>`;

const methodologyDepthBadExample = `<article class="c-article">
  <header class="c-article__header">
    <h1 class="c-article__header__h1">The methodology is designed for large, long-lived projects.</h1>
    <h2 class="c-article__header__h2">This is how we keep Sass structure scalable.</h2>
  </header>
  <div class="c-article__content"></div>
</article>`;

const methodologyRegionsExample = `<section class="r-header">
  <div class="r-header__logo">
    <div class="c-brand">
      <a class="c-brand__link" href="/">VEAMS</a>
    </div>
  </div>

  <div class="r-header__navigation">
    <nav class="c-navigation" aria-label="Primary">
      <a class="c-navigation__link is-active" href="/">Documentation</a>
      <a class="c-navigation__link" href="/profile">Profile</a>
    </nav>
  </div>
</section>`;

const methodologyComponentsExample = `<article class="c-article c-article--default"></article>`;

const methodologyUtilitiesRowExample = `<div class="u-grid-row">
  <div class="is-grid-col is-col-mobile-p-12 is-col-tablet-l-6"></div>
  <div class="is-grid-col is-col-mobile-p-12 is-col-tablet-l-6"></div>
  <div class="is-grid-col is-col-mobile-p-12 is-col-tablet-l-6"></div>
</div>`;

const methodologyUtilitiesCollapsedExample = `<div class="u-grid-row is-collapsed">
  {{{yield}}}
</div>`;

const methodologyUtilitiesColumnExample = `<div class="u-grid-col{{#if props.colClasses}} {{props.colClasses}}{{/if}}">
  {{{yield}}}
</div>`;

const methodologyContextExample = `<div class="c-brand c-brand--compact">
  <span class="c-brand__logo" aria-hidden="true"></span>
  <span class="c-brand__title">SME Hub</span>
</div>`;

const methodologyModifierExample = `<nav class="c-navigation" aria-label="Primary">
  <a class="c-navigation__link is-active" href="/">Documentation</a>
  <a class="c-navigation__link" href="/profile">Profile</a>
</nav>

<aside class="c-panel has-shadow">
  <h3 class="c-panel__title">Quick Stats</h3>
</aside>`;

const methodologyVariablesExample = `$c-picture-border-color: #eee;
$color-white: #fff;

// Good
$color-welt-blue: blue;
$font-family-serif: Arial;

// Bad
$welt-color-blue: blue;
$family-font-serif: Arial;`;

const methodologyCommentsExample = `// [1] The combination 'display: flex; flex-direction: column;' is buggy in IE 11, therefore flex-basis is needed to show the teaser correctly.
.c-teaser-default__body {
  @include mq($from: medium) {
    flex-grow: 1; // [1]
    flex-shrink: 1; // [1]
  }
}`;

const methodologyMediaQueryBadExample = `@media {
  .is-col {
    color: red;
  }
}`;

const methodologyMediaQueryGoodExample = `.is-col {
  @media {
    color: red;
  }
}`;

const methodologyFullExample = `<section class="r-dashboard">
  <!-- Region context: finance variant of the dashboard layout -->
  <header class="r-dashboard__header">
    <div class="c-brand c-brand--compact">
      <span class="c-brand__logo" aria-hidden="true"></span>
      <span class="c-brand__title">SME Hub</span>
    </div>

    <nav class="c-navigation" aria-label="Primary">
      <a class="c-navigation__link is-active" href="/">
        <span class="c-navigation__icon" aria-hidden="true"></span>
        <span class="c-navigation__text">Dashboard</span>
      </a>
      <a class="c-navigation__link" href="/profile">
        <span class="c-navigation__icon" aria-hidden="true"></span>
        <span class="c-navigation__text">Profile</span>
      </a>
    </nav>
  </header>

  <main class="r-dashboard__main">
    <div class="u-grid-row has-gap-lg">
      <article class="c-card c-card--dashboard">
        <header class="c-card__header">
          <h2 class="c-card__title">Revenue Overview</h2>
          <span class="c-card__badge is-active">Active</span>
        </header>
        <div class="c-card__content is-collapsed">
          <p class="c-card__text">Quarterly totals and trend indicators.</p>
        </div>
      </article>

      <aside class="c-panel c-panel--summary has-shadow">
        <h3 class="c-panel__title">Quick Stats</h3>
        <ul class="c-panel__list">
          <li class="c-panel__item">Runway: 14 months</li>
          <li class="c-panel__item">Gross margin: 62%</li>
        </ul>
      </aside>
    </div>
  </main>
</section>`;

const methodologyUtilitiesExample = `${methodologyUtilitiesRowExample}

${methodologyUtilitiesCollapsedExample}

${methodologyUtilitiesColumnExample}`;

const methodologyContextStylingExample = `.c-brand {
  padding: 1.5rem;
}

.c-brand--header {
  color: #1847a8;
}

.c-brand--sidebar {
  color: #245646;
}`;

const methodologyModifierExampleMarkup = methodologyModifierExample;

const methodologyModifierExampleCss = `.c-navigation__link.is-active {
  color: #1847a8;
  font-weight: 700;
}

.has-shadow {
  box-shadow: 0 1.2rem 2.4rem rgba(24, 71, 168, 0.16);
}`;

const methodologyPatternExampleMarkup = methodologyFullExample;

const methodologyPatternExampleCss = `.r-dashboard {
  display: grid;
  gap: 3rem;
  padding: 3rem;
}

.r-dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.c-card--dashboard {
  padding: 2rem;
  border: 1px solid #d7dde8;
  background: #ffffff;
}

.c-panel--summary {
  padding: 2rem;
  background: #f5f8ff;
}`;

const formInstall = `npm install @veams/form @veams/status-quo react`;

const formQuickStartCore = `import { FormStateHandler } from '@veams/form';

type LoginValues = {
  email: string;
  password: string;
};

const loginForm = new FormStateHandler<LoginValues>({
  initialValues: {
    email: '',
    password: '',
  },
  validator: (values) => ({
    ...(values.email ? {} : { email: 'Email is required' }),
    ...(values.password ? {} : { password: 'Password is required' }),
  }),
});

loginForm.setFieldValue('email', 'hello@veams.org');
loginForm.validateForm();`;

const formQuickStartReact = `import { FormProvider, useUncontrolledField } from '@veams/form/react';

function EmailField() {
  const { meta, registerProps } = useUncontrolledField('email');

  return (
    <label>
      Email
      <input {...registerProps} type="email" />
      {meta.showError ? <span>{meta.error}</span> : null}
    </label>
  );
}

function LoginForm() {
  return (
    <FormProvider
      initialValues={{ email: '', password: '' }}
      onSubmit={async (values) => {
        await submitLogin(values);
      }}
      validator={(values) => ({
        ...(values.email ? {} : { email: 'Email is required' }),
        ...(values.password ? {} : { password: 'Password is required' }),
      })}
    >
      <EmailField />
      <button type="submit">Sign in</button>
    </FormProvider>
  );
}`;

const formFrameworkCoreImports = `import { FormStateHandler } from '@veams/form';`;

const formFrameworkReactImports = `import {
  Controller,
  FormProvider,
  useUncontrolledField,
} from '@veams/form/react';`;

const formFeatureOwnedExample = `import { NativeStateHandler } from '@veams/status-quo';
import { useStateFactory } from '@veams/status-quo/react';
import { FormStateHandler } from '@veams/form';
import { FormProvider, useUncontrolledField } from '@veams/form/react';

type LoginValues = {
  email: string;
  password: string;
};

type LoginState = {
  isPasswordVisible: boolean;
};

type LoginActions = {
  getFormHandler: () => FormStateHandler<LoginValues>;
  submitLogin: (values: LoginValues) => Promise<void>;
  togglePasswordVisibility: () => void;
};

class LoginStateHandler extends NativeStateHandler<LoginState, LoginActions> {
  private readonly formHandler = new FormStateHandler<LoginValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validator: (values) => ({
      ...(values.email ? {} : { email: 'Email is required' }),
      ...(values.password ? {} : { password: 'Password is required' }),
    }),
  });

  constructor() {
    super({
      initialState: {
        isPasswordVisible: false,
      },
    });
  }

  getActions(): LoginActions {
    return {
      getFormHandler: () => this.formHandler,
      submitLogin: async (_values) => undefined,
      togglePasswordVisibility: () => {
        this.setState({
          isPasswordVisible: !this.getState().isPasswordVisible,
        });
      },
    };
  }
}

function PasswordField({ isVisible }: { isVisible: boolean }) {
  const { registerProps } = useUncontrolledField('password', {
    type: isVisible ? 'text' : 'password',
  });

  return <input {...registerProps} />;
}

function LoginFeature() {
  const [state, actions] = useStateFactory(() => new LoginStateHandler(), []);

  return (
    <FormProvider
      formHandlerInstance={actions.getFormHandler()}
      onSubmit={actions.submitLogin}
    >
      <PasswordField isVisible={state.isPasswordVisible} />
      <button onClick={actions.togglePasswordVisibility} type="button">
        Toggle password visibility
      </button>
      <button type="submit">Sign in</button>
    </FormProvider>
  );
}`;

const formControllerExample = `import { Controller, FormProvider } from '@veams/form/react';

function ControlledRoleSelect() {
  return (
    <Controller
      name="role"
      render={({ field, fieldState }) => (
        <>
          <RoleSelect
            onBlur={field.onBlur}
            onChange={field.onChange}
            value={field.value as string}
          />
          {fieldState.touched && fieldState.error ? <span>{fieldState.error}</span> : null}
        </>
      )}
    />
  );
}

function RoleForm() {
  return (
    <FormProvider
      initialValues={{ role: 'user' }}
      onSubmit={(values) => saveRole(values.role)}
    >
      <ControlledRoleSelect />
      <button type="submit">Save</button>
    </FormProvider>
  );
}`;

const formValidatorFlowExample = `import { FormStateHandler } from '@veams/form';

type LoginValues = {
  email: string;
  password: string;
};

const validateLogin = (values: LoginValues) => {
  const errors: Partial<Record<keyof LoginValues, string>> = {};

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\\S+@\\S+\\.\\S+/.test(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 12) {
    errors.password = 'Use at least 12 characters';
  }

  return errors;
};

const loginForm = new FormStateHandler<LoginValues>({
  initialValues: {
    email: '',
    password: '',
  },
  validator: validateLogin,
});

// Field updates re-run the validator and keep isValid in sync.
loginForm.setFieldValue('email', 'john@veams.org');

// Submit flow should validate the full snapshot before side effects.
const isValid = loginForm.validateForm();
if (!isValid) {
  loginForm.touchAllFields();
}`;

const formValidatorServerErrorsExample = `import { FormStateHandler } from '@veams/form';

type SignupValues = {
  email: string;
  password: string;
};

const form = new FormStateHandler<SignupValues>({
  initialValues: {
    email: '',
    password: '',
  },
  validator: (values) => ({
    ...(values.email ? {} : { email: 'Email is required' }),
    ...(values.password ? {} : { password: 'Password is required' }),
  }),
});

async function submitSignup() {
  if (!form.validateForm()) {
    form.touchAllFields();
    return;
  }

  try {
    await signupApi(form.getState().values);
  } catch (error) {
    if (isApiValidationError(error)) {
      form.setFieldError('email', error.fieldErrors.email);
      form.setFieldError('password', error.fieldErrors.password);
      return;
    }

    throw error;
  }
}`;

const formValidatorZodExample = `import { z } from 'zod';
import { FormStateHandler } from '@veams/form';
import { toZodValidator } from '@veams/form/validators/zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(12, 'Use at least 12 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

const loginForm = new FormStateHandler<LoginValues>({
  initialValues: {
    email: '',
    password: '',
  },
  validator: toZodValidator(loginSchema),
});`;

const formValidatorTinyAdapterReference = `type ZodLikeIssue = {
  message: string;
  path: ReadonlyArray<unknown>;
};

type ZodLikeSchema<TValues extends Record<string, unknown>> = {
  safeParse(input: unknown):
    | { success: true }
    | { success: false; error: { issues: ReadonlyArray<ZodLikeIssue> } };
};

const toZodValidator = <TValues extends Record<string, unknown>>(
  schema: ZodLikeSchema<TValues>
) => {
  return (values: TValues) => {
    const parsed = schema.safeParse(values);

    if (parsed.success) {
      return {};
    }

    const errors: Partial<Record<keyof TValues, string>> = {};

    for (const issue of parsed.error.issues) {
      const field = issue.path[0];

      if (typeof field !== 'string') {
        continue;
      }

      const fieldName = field as keyof TValues;

      if (!errors[fieldName]) {
        errors[fieldName] = issue.message;
      }
    }

    return errors;
  };
};`;

const formNestedStateExample = `import { FormStateHandler } from '@veams/form';

type ProfileValues = {
  profile: {
    email: string;
    name: string;
  };
  settings: {
    newsletter: boolean;
  };
};

const profileForm = new FormStateHandler<ProfileValues>({
  initialValues: {
    profile: {
      email: '',
      name: '',
    },
    settings: {
      newsletter: false,
    },
  },
  validator: (values) => ({
    ...(values.profile.email ? {} : { 'profile.email': 'Email is required' }),
    ...(values.profile.name ? {} : { 'profile.name': 'Name is required' }),
  }),
});

profileForm.setFieldValue('profile.email', 'jane@veams.org');
profileForm.setFieldValue('settings.newsletter', true);
profileForm.setFieldTouched('profile.email', true);
profileForm.validateForm();`;

const formNestedReactExample = `import { FormProvider, useUncontrolledField } from '@veams/form/react';

function ProfileEmailField() {
  const { meta, registerProps } = useUncontrolledField('profile.email');

  return (
    <label>
      Email
      <input {...registerProps} type="email" />
      {meta.showError ? <span>{meta.error}</span> : null}
    </label>
  );
}

function NewsletterField() {
  const { registerProps } = useUncontrolledField('settings.newsletter', {
    type: 'checkbox',
  });

  return (
    <label>
      <input {...registerProps} />
      Newsletter
    </label>
  );
}

function ProfileForm() {
  return (
    <FormProvider
      initialValues={{
        profile: {
          email: '',
          name: '',
        },
        settings: {
          newsletter: false,
        },
      }}
      onSubmit={(values) => saveProfile(values)}
      validator={(values) => ({
        ...(values.profile.email ? {} : { 'profile.email': 'Email is required' }),
      })}
    >
      <ProfileEmailField />
      <NewsletterField />
      <button type="submit">Save</button>
    </FormProvider>
  );
}`;

const formSimpleWorkingExample = `import { FormProvider, useUncontrolledField } from '@veams/form/react';

function TextField({ label, name, type = 'text' }: { label: string; name: string; type?: string }) {
  const { meta, registerProps } = useUncontrolledField(name, { type });

  return (
    <label>
      {label}
      <input {...registerProps} />
      {meta.showError ? <span>{meta.error}</span> : null}
    </label>
  );
}

function LoginForm() {
  return (
    <FormProvider
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={async (values) => {
        await login(values);
      }}
      validator={(values) => ({
        ...(values.email ? {} : { email: 'Email is required' }),
        ...(values.password ? {} : { password: 'Password is required' }),
      })}
    >
      <TextField label="Email" name="email" type="email" />
      <TextField label="Password" name="password" type="password" />
      <button type="submit">Sign in</button>
    </FormProvider>
  );
}`;

const formNestedFeatureWorkingExample = `import { NativeStateHandler } from '@veams/status-quo';
import { useStateFactory } from '@veams/status-quo/react';
import { FormStateHandler } from '@veams/form';
import { FormProvider, useUncontrolledField } from '@veams/form/react';

type ProfileValues = {
  profile: {
    email: string;
    name: string;
  };
};

type FeatureState = {
  isSaving: boolean;
};

type FeatureActions = {
  getFormHandler: () => FormStateHandler<ProfileValues>;
  saveProfile: (values: ProfileValues) => Promise<void>;
};

class ProfileFeatureHandler extends NativeStateHandler<FeatureState, FeatureActions> {
  private readonly formHandler = new FormStateHandler<ProfileValues>({
    initialValues: {
      profile: {
        email: '',
        name: '',
      },
    },
  });

  constructor() {
    super({
      initialState: {
        isSaving: false,
      },
    });
  }

  getActions(): FeatureActions {
    return {
      getFormHandler: () => this.formHandler,
      saveProfile: async (_values) => undefined,
    };
  }
}

function ProfileFields() {
  const email = useUncontrolledField('profile.email');
  const name = useUncontrolledField('profile.name');

  return (
    <>
      <input {...email.registerProps} placeholder="Email" />
      <input {...name.registerProps} placeholder="Name" />
    </>
  );
}

function ProfileFeatureForm() {
  const [, actions] = useStateFactory(() => new ProfileFeatureHandler(), []);

  return (
    <FormProvider
      formHandlerInstance={actions.getFormHandler()}
      onSubmit={actions.saveProfile}
    >
      <ProfileFields />
      <button type="submit">Save profile</button>
    </FormProvider>
  );
}`;

const formFeatureValidationWorkingExample = `import { NativeStateHandler } from '@veams/status-quo';
import { useStateFactory } from '@veams/status-quo/react';
import { FormStateHandler } from '@veams/form';
import { FormProvider, useUncontrolledField } from '@veams/form/react';

type RegisterValues = {
  account: {
    email: string;
    password: string;
  };
};

type FeatureActions = {
  getFormHandler: () => FormStateHandler<RegisterValues>;
  submit: (values: RegisterValues) => Promise<void>;
};

class RegisterFeatureHandler extends NativeStateHandler<object, FeatureActions> {
  private readonly formHandler = new FormStateHandler<RegisterValues>({
    initialValues: {
      account: {
        email: '',
        password: '',
      },
    },
    validator: (values) => ({
      ...(values.account.email ? {} : { 'account.email': 'Email is required' }),
      ...(values.account.password.length >= 12
        ? {}
        : { 'account.password': 'Use at least 12 characters' }),
    }),
  });

  constructor() {
    super({ initialState: {} });
  }

  getActions(): FeatureActions {
    return {
      getFormHandler: () => this.formHandler,
      submit: async (values) => {
        try {
          await registerUser(values);
        } catch (error) {
          if (isApiValidationError(error)) {
            this.formHandler.setFieldError('account.email', error.fieldErrors.email);
            this.formHandler.setFieldError('account.password', error.fieldErrors.password);
            return;
          }

          throw error;
        }
      },
    };
  }
}

function RegisterForm() {
  const [, actions] = useStateFactory(() => new RegisterFeatureHandler(), []);
  const email = useUncontrolledField('account.email');
  const password = useUncontrolledField('account.password', { type: 'password' });

  return (
    <FormProvider formHandlerInstance={actions.getFormHandler()} onSubmit={actions.submit}>
      <input {...email.registerProps} />
      <input {...password.registerProps} />
      <button type="submit">Create account</button>
    </FormProvider>
  );
}`;

const formApiImports = `import {
  FormStateHandler,
  type FormActions,
  type FormFieldName,
  type FormState,
  type ValidatorFn,
} from '@veams/form';

import {
  Controller,
  FormProvider,
  useFieldMeta,
  useFormController,
  useUncontrolledField,
} from '@veams/form/react';`;

export const docsPackages: DocsPackage[] = [
  {
    accent: 'teal',
    description: 'Structure and scale without the noise.',
    id: 'methodology',
    sections: [
      {
        id: 'getting-started',
        pages: [
          {
            blocks: [
              {
                bullets: [
                  'How we scope and differentiate HTML.',
                  'How we bind JavaScript to DOM elements.',
                  'How we structure layouts.',
                  'How we write CSS classes.',
                  'How we expand the project over time.',
                ],
                id: 'why',
                paragraphs: [
                  'Our methodology defines how projects are structured for modularity, scalability, and maintainability. It spans HTML, CSS, and JavaScript so we can apply the same mental model across the whole frontend stack.',
                  'This approach is BEM-inspired, but it is not strict BEM. We apply a restricted depth rule to keep class names readable and maintainable.',
                  'This section focuses on the structure and styling rules. JavaScript binding rules are part of the same methodology but are documented separately.',
                ],
                title: 'Methodology Overview',
              },
              {
                codeExamples: [
                  {
                    code: methodologyInstrumentExample,
                    label: 'Instrument structure example',
                    language: 'html',
                  },
                ],
                featureCards: [
                  {
                    description: 'Structural sections like Header, Sidebar, and Main that shape the page skeleton. Never reused.',
                    title: 'Regions',
                    visual: 'methodology-regions',
                  },
                  {
                    description: 'Reusable UI elements like Cards, Buttons, and Navs that live inside regions.',
                    title: 'Components',
                    visual: 'methodology-components',
                  },
                  {
                    description: 'Low-level helpers like Grid systems or spacing that provide structure without content.',
                    title: 'Utilities',
                    visual: 'methodology-utilities',
                  },
                ],
                id: 'instruments',
                paragraphs: [
                  'Markup is structured using three instruments: Regions, Components, and Utilities. Each instrument has a specific purpose and unique attributes.',
                ],
                title: 'Instruments (Markup Structure)',
              },
            ],
            eyebrow: 'Getting Started',
            heroBullets: [
              'Use `Regions` for layout ownership, not reusable UI.',
              'Use `Components` for named interface pieces with clear inner structure.',
              'Use `Utilities` for tiny exceptions instead of bloating components.',
            ],
            heroParagraphs: [
              'VEAMS Methodology gives every piece of markup a clear job. **Regions** shape page structure, **Components** carry reusable UI, and **Utilities** handle small helper work. That keeps HTML legible and CSS predictable as the project grows.',
            ],
            id: 'overview',
            intro:
              'Start with the mental model first: name by responsibility, not by convenience.',
            summary: 'Structure first. Scale without chaos.',
            title: 'Overview',
          },
          {
            blocks: [
              {
                bullets: [
                  'Every HTML element gets a class.',
                  'Use a prefix to indicate the instrument (r-, c-, u-).',
                  'Parent elements use the prefixed class.',
                  'Child elements use the full parent class name + `__` + short element name.',
                ],
                id: 'principles',
                paragraphs: [
                  'This project uses a BEM-inspired naming approach based on Regions, Components, and Utilities. The goal is clarity and long-term maintainability.',
                ],
                title: 'General Principles',
              },
              {
                codeExamples: [
                  {
                    code: methodologyClassNamingExample,
                    label: 'Example snippet',
                    language: 'html',
                  },
                ],
                id: 'example',
                paragraphs: [
                  'This example shows how parents and children are named to maintain a clear hierarchy and ownership.',
                ],
                title: 'Example snippet',
              },
              {
                codeExamples: [
                  {
                    code: methodologyDepthGoodExample,
                    label: 'Do',
                    language: 'html',
                  },
                  {
                    code: methodologyDepthBadExample,
                    label: 'Do not',
                    language: 'html',
                  },
                ],
                id: 'depth',
                paragraphs: [
                  'Class names should only be one level deep (only one `__` segment). This ensures better readability and is sufficient to target a parent instrument and its child elements.',
                ],
                title: 'One level of depth',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'quick-start',
            intro: 'The class naming system is designed for clarity and long-term maintainability.',
            summary: 'Class patterns that stay calm.',
            title: 'Class Naming',
          },
        ],
        title: 'Getting Started',
      },
      {
        id: 'guides',
        pages: [
          {
            blocks: [
              {
                featureCards: [
                  {
                    description: 'Regions are high-level structural areas (Header, Sidebar, Main, Footer) that compose the page skeleton.',
                    title: 'The Page Skeleton',
                    visual: 'methodology-layout',
                  },
                ],
                id: 'role',
                paragraphs: [
                  'Regions are structural sections used to compose pages. They exist only in layout files and are not reusable by design.',
                  'Why use regions: Region styles are isolated from component styles. Layouts become drop-in replaceable because components can move without breaking layout CSS.',
                ],
                title: 'Regions (Layout Only)',
              },
              {
                codeExamples: [
                  {
                    code: methodologyRegionsExample,
                    label: 'Region markup',
                    language: 'html',
                  },
                ],
                id: 'markup',
                paragraphs: [
                  'Naming: Use the `r-` prefix for region/layout classes (example: `r-header`, `r-sidebar`).',
                  'Typical regions: Header region, Logo region in header, Navigation region in header, Stage region, Main content region, Sidebar region, Footer region.',
                ],
                title: 'Name page areas, not widgets',
              },
            ],
            eyebrow: 'Guides',
            id: 'regions',
            intro: 'Regions are the page skeleton. Keep them structural.',
            summary: 'Let layout own the layout.',
            title: 'Regions',
          },
          {
            blocks: [
              {
                bullets: [
                  'Components are closely related to content.',
                  'Component content varies by context.',
                  'Components are generic and reusable across the project.',
                  'Components can contain other components.',
                ],
                id: 'role',
                paragraphs: [
                  'Components are reusable building blocks that are tied to content. They can appear multiple times on a page and can contain other components.',
                  'Why use components: Reusability. You can drop a component into different pages and it should render consistently.',
                ],
                title: 'Components (Reusable)',
              },
              {
                codeExamples: [
                  {
                    code: methodologyComponentsExample,
                    label: 'Component markup',
                    language: 'html',
                  },
                ],
                id: 'markup',
                paragraphs: [
                  'Naming: Prefix component classes with `c-`.',
                ],
                title: 'Name the reusable thing once',
              },
            ],
            eyebrow: 'Guides',
            id: 'components',
            intro: 'Components should read like reusable building blocks, not like page positions.',
            summary: 'Build reusable UI.',
            title: 'Components',
          },
          {
            blocks: [
              {
                bullets: [
                  'Contexts use `--` after the instrument name.',
                  'Contexts share base styles but have independent overrides.',
                  'Contexts make it easy to understand what variant is rendered.',
                ],
                id: 'role',
                paragraphs: [
                  'Contexts are variations of instruments that share a base set of styles and add context-specific styles. Use contexts instead of duplicating components with slightly different styling.',
                  'We want to make sure that nothing affects a component from the outside and the component itself owns its representation. That is why we use context classes like `.c-brand--footer`.',
                ],
                title: 'Contexts',
              },
              {
                codeExamples: [
                  {
                    code: methodologyContextExample,
                    label: 'Context markup',
                    language: 'html',
                  },
                  {
                    code: methodologyContextStylingExample,
                    label: 'Context styling',
                    language: 'css',
                  },
                ],
                id: 'example',
                paragraphs: [
                  'The component itself stays in charge of the contextual difference. A new context class is added when a component should look different in certain areas.',
                ],
                title: 'Component owns its representation',
              },
            ],
            eyebrow: 'Guides',
            id: 'contexts',
            intro: 'When a component needs to look different, let the component own the difference.',
            summary: 'Style by contexts.',
            title: 'Contexts',
          },
          {
            blocks: [
              {
                bullets: [
                  'Use `.is-` or `.isnt-`, `has-` or `hasnt-` for modifiers.',
                  'Modifiers should only change a small part of the context.',
                ],
                id: 'role',
                paragraphs: [
                  'Modifiers are for small changes to the appearance of an instrument. Use them when the change is too small to justify a full context.',
                ],
                title: 'Modifiers',
              },
              {
                codeExamples: [
                  {
                    code: methodologyModifierExampleMarkup,
                    label: 'Modifier markup',
                    language: 'html',
                  },
                  {
                    code: methodologyModifierExampleCss,
                    label: 'Modifier styling',
                    language: 'css',
                  },
                ],
                id: 'example',
                paragraphs: [
                  'A modifier should read like a variation on an existing thing, not like a brand-new component family.',
                ],
                title: 'Keep the base instrument visible',
              },
            ],
            eyebrow: 'Guides',
            id: 'modifiers',
            intro: 'Modifiers are for variations on a thing, not replacements for the thing.',
            summary: 'Change state without changing names.',
            title: 'Modifiers',
          },
          {
            blocks: [
              {
                bullets: [
                  'Utilities are helpers that format or position content.',
                  'Utilities are not components and should avoid content semantics.',
                ],
                id: 'role',
                paragraphs: [
                  'Utilities are structural helpers that are not tied to content (for example, grid systems).',
                  'Why use utilities: Clear separation between content components and layout helpers.',
                ],
                title: 'Utilities (Helpers)',
              },
              {
                codeExamples: [
                  {
                    code: methodologyUtilitiesExample,
                    label: 'Utility usage',
                    language: 'html',
                  },
                ],
                id: 'usage',
                paragraphs: [
                  'Naming: Use the `u-` prefix for utilities (example: `u-grid-row`) and `is-` / `has-` for state and variant helpers (example: `is-active`, `has-shadow`).',
                ],
                title: 'Support, do not hijack',
              },
            ],
            eyebrow: 'Guides',
            id: 'utilities',
            intro: 'Utilities are great right up until they start impersonating components.',
            summary: 'Keep the helpers tiny.',
            title: 'Utilities',
          },
          {
            blocks: [
              {
                bullets: [
                  'Local variables should be prefixed with the component name: `$c-picture-border-color`.',
                  'Global variables should be written in standard way: `$color-white`.',
                  'Variables should follow a simple pattern: type, followed by category and its name.',
                ],
                codeExamples: [
                  {
                    code: methodologyVariablesExample,
                    label: 'Variable naming',
                    language: 'scss',
                  },
                ],
                id: 'variables',
                paragraphs: [
                  'We should make it easy for us to distinguish between global and local variables.',
                ],
                title: 'Variables',
              },
              {
                codeExamples: [
                  {
                    code: methodologyCommentsExample,
                    label: 'Comment style',
                    language: 'scss',
                  },
                ],
                id: 'comments',
                paragraphs: [
                  'Please comment your styles whenever you see the need to. At the beginning of the selector add your comment with `// [number]: message`. Use `[number]` next to your key-value pair.',
                ],
                title: 'Comments',
              },
              {
                bullets: [
                  'Resist Nesting: Minimize nesting as much as possible.',
                  'Do repeat yourself: gzip will squash extra bytes.',
                  'Media Query Nesting: Do not define classes in your media query blocks.',
                  'Do not mix components: Avoid declaring two component classes for one HTML element.',
                ],
                id: 'styling-rules',
                paragraphs: [
                  'These principles help maintain a clean and scalable CSS codebase.',
                ],
                title: 'Styling Rules',
              },
              {
                codeExamples: [
                  {
                    code: methodologyMediaQueryGoodExample,
                    label: 'Good',
                    language: 'scss',
                  },
                  {
                    code: methodologyMediaQueryBadExample,
                    label: 'Bad',
                    language: 'scss',
                  },
                ],
                id: 'mq-nesting',
                paragraphs: [
                  'Keep media queries nested inside the selector they affect.',
                ],
                title: 'Media Query Nesting',
              },
            ],
            eyebrow: 'Guides',
            id: 'best-practices',
            intro: 'Consistency and clarity are the keys to a maintainable stylesheet.',
            summary: 'Maintainable styles by design.',
            title: 'SCSS Best Practices',
          },
        ],
        title: 'Guides',
      },
      {
        id: 'examples',
        pages: [
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: methodologyPatternExampleMarkup,
                    label: 'Combined markup',
                    language: 'html',
                  },
                  {
                    code: methodologyPatternExampleCss,
                    label: 'Combined CSS',
                    language: 'css',
                  },
                ],
                id: 'combined-example',
                paragraphs: [
                  'This kind of slice is where the methodology becomes concrete. A region owns the page band, components own the reusable content pieces, utilities stay small, and modifier or context rules only appear where they actually earn their keep.',
                ],
                title: 'See the pieces together',
              },
            ],
            eyebrow: 'Examples',
            id: 'examples',
            intro:
              'Examples work best when the instruments show up together in one believable page slice.',
            summary: 'See the pieces together.',
            title: 'Examples',
          },
        ],
        title: 'Examples',
      },
    ],
    title: 'Methodology',
  },
  {
    accent: 'ember',
    description: 'Framework-agnostic state handlers with React hooks and explicit lifecycle.',
    githubPath: 'packages/status-quo',
    id: 'status-quo',
    npm: '@veams/status-quo',
    sections: [
      {
        id: 'getting-started',
        pages: [
          {
            blocks: [
              {
                featureCards: statusQuoPhilosophyCards,
                id: 'principles',
                paragraphs: [
                  'These principles are the shape of the package in practice: **a replaceable engine**, **a stable component contract**, and **state logic that stays outside the view layer**.',
                ],
                title: 'Principles in practice',
              },
              {
                bullets: [
                  'Scale the service and state handler layer without rewriting component wiring.',
                  'Let state shape and derived logic grow without breeding custom nested hooks in the view.',
                  'Keep ownership obvious because subscriptions, actions, and teardown do not get trapped inside components.',
                ],
                id: 'why',
                paragraphs: [
                  'The split between **service**, **state handler**, and the **component view** is the real payoff. Each layer gets room to grow on its own. Business logic can become richer, state can become more composed, and the component can stay focused on rendering snapshots and triggering actions.',
                  'That separation keeps React components from turning into ownership puzzles. You do not end up wondering which nested hook owns the subscription, where cleanup should happen, or which component secretly became the home of stateful behavior.',
                ],
                title: 'Why the split matters',
              },
              {
                bullets: [
                  'Choose between local factory instances and shared singletons.',
                  'Keep transitions, actions, and cleanup in one place.',
                  'Let the UI stay unaware of the runtime underneath.',
                ],
                id: 'where-it-fits',
                paragraphs: [
                  'Handlers encapsulate state transitions, expose actions, and clean up after themselves. You decide whether each component should have its own instance through a factory or share a singleton, while the UI stays blissfully unaware of the chosen implementation.',
                ],
                title: 'Composable handlers with clear ownership',
              },
              {
                bullets: [
                  'Handlers own transitions and action contracts.',
                  'Components consume snapshots instead of mutating store internals directly.',
                  'Lifecycle and teardown are part of the model, not an afterthought.',
                ],
                id: 'boundary',
                paragraphs: [
                  'Status Quo is opinionated about boundaries. It wants stateful objects to be explicit, portable, and disposable, which is why the handler API is more important than the hook layer around it.',
                ],
                title: 'Keep the boundary explicit',
              },
              {
                bullets: [
                  'Native handlers are zero-dependency and perfect for simple state.',
                  'Observable handlers are strong for stream-heavy composition.',
                  'Signal handlers are strong for compact value-style reactivity.',
                ],
                id: 'swap-engine',
                paragraphs: [
                  'One of the core ideas is that the reactive engine should be an implementation choice. Start with the zero-dependency native handler and scale up to observables or signals when necessary, without forcing the UI layer to relearn the state model.',
                ],
                title: 'Scale the engine, keep the API',
              },
            ],
            eyebrow: 'Getting Started',
            heroBullets: [
              'Zero-dependency native state handler by default.',
              'Small handler objects with explicit lifecycle.',
              'Snapshot subscriptions instead of framework-specific store APIs.',
            ],
            heroParagraphs: [
              'Status Quo treats state handlers as small, composable objects with explicit lifecycle and a tiny interface. The native handler has zero dependencies, making it the perfect starting point. When you need more, easily swap the engine under the hood: RxJS for observable streams or Preact Signals for ultra-light reactive state.',
            ],
            id: 'overview',
            intro: 'Start with the mental model first: handlers own state and lifecycle, hooks only translate snapshots into the UI layer.',
            summary: 'State management that stays out of your way.',
            title: 'Overview',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoFrameworkCoreImports,
                    label: 'Framework-agnostic core',
                    language: 'ts',
                  },
                  {
                    code: statusQuoFrameworkReactImports,
                    label: 'Optional React bindings',
                    language: 'ts',
                  },
                ],
                bullets: [
                  'The root package (`@veams/status-quo`) is framework-agnostic and owns the state model.',
                  'React bindings live in a separate subpath (`@veams/status-quo/react`).',
                  'Guides use React examples for readability, but the handler patterns stay the same outside React.',
                ],
                id: 'framework-support',
                paragraphs: [
                  'Status Quo is not tied to React. Keep handlers, actions, and lifecycle in the root package, then opt into React only for view-layer wiring when your app uses React.',
                  'Using React in guides is a documentation choice, not an architectural requirement. The handler boundary and engine choice (observables or signals) remain framework-level decisions, independent from the UI layer.',
                ],
                title: 'Framework Support',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'framework-support',
            intro: 'Use the root package as the framework-agnostic state layer, then add React bindings only where the UI needs them.',
            summary: 'Framework-neutral core, optional React layer.',
            title: 'Framework Support',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoInstall,
                    label: 'Install',
                    language: 'bash',
                  },
                ],
                id: 'install',
                paragraphs: [
                  'Install the core package. When using the native handler, the library is completely zero-dependency. You can also opt into peer-driven reactive backends like RxJS or Preact Signals if your state logic needs more powerful composition.',
                ],
                title: 'Install the package',
              },
              {
                codeExamples: [
                  {
                    code: statusQuoGlobalSetup,
                    label: 'Optional global setup',
                    language: 'ts',
                  },
                ],
                id: 'global-setup',
                paragraphs: [
                  'Global setup is optional. Use it when you want shared runtime defaults across handlers, for example distinct-update behavior or turning Redux DevTools on once for the whole app.',
                ],
                title: 'Configure runtime defaults',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'installation',
            intro: 'Install the zero-dependency package and start with the native handler, then opt into other reactive backends only when you need them.',
            summary: 'Install fast. Start clean.',
            title: 'Installation',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoQuickStartComponent,
                    label: 'Draft note component',
                    language: 'tsx',
                  },
                ],
                bullets: [
                  '`useStateHandler` gives you the raw lifecycle.',
                  '`useStateSubscription` lets you subscribe to a selected slice.',
                  '`useStateFactory` combines creation and subscription for the common case.',
                ],
                id: 'hooks-layer',
                liveExample: 'status-quo-local-draft',
                paragraphs: [
                  'Once the handler exists, wire it into React. `useStateFactory` is the fast path here because it creates the local instance and subscribes to snapshots in one step. The component can stay focused on inputs and presentation because the handler already owns the transitions.',
                ],
                title: 'Hook the handler into React',
              },
              {
                codeExamples: [
                  {
                    code: statusQuoQuickStartHandler,
                    label: 'Draft note handler',
                    language: 'ts',
                  },
                ],
                id: 'local-store',
                paragraphs: [
                  'Start by defining the handler itself. Keep the transitions, action contract, and initial state in one place so the React layer only has to subscribe and trigger actions. This draft-note example uses the native handler, which is completely zero-dependency and keeps the lifecycle boundary obvious from the start.',
                ],
                title: 'Create a local handler',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'quick-start',
            intro: 'The fastest path is a local handler plus `useStateFactory`, then expand into lower-level hooks only when you need more control.',
            summary: 'Zero dependencies. Fast local state.',
            title: 'Quick Start',
          },
        ],
        title: 'Getting Started',
      },
      {
        id: 'guides',
        pages: [
          {
            blocks: [
              {
                callout:
                  'Same hooks. Same snapshots. The real choice is how the handler likes to think.',
                codeExamples: [
                  {
                    code: statusQuoObservableHandlerExample,
                    label: 'Observable handler',
                    language: 'ts',
                  },
                  {
                    code: statusQuoSignalHandlerExample,
                    label: 'Signal handler',
                    language: 'ts',
                  },
                ],
                bullets: [
                  'Use `NativeStateHandler` as your default for zero dependencies.',
                  'Use `ObservableStateHandler` when the interesting work already feels like a stream.',
                  'Use `SignalStateHandler` when you want direct reads and cheap synchronous derivation.',
                ],
                id: 'engine-choice',
                paragraphs: [
                  'This is not a React decision. It is a handler decision. Start with the zero-dependency native handler and promote to other engines only when necessary. In both examples, a shared UI singleton exposes the current viewport and a local counter reacts by changing its `step`. The observable version derives that step with `pipe(...)`. The signal version derives the same value with `computed(...)`. Both are then bridged into the same `bindSubscribable()` contract, so the surrounding composition still reads the same.',
                ],
                title: 'Pick the engine that matches the state',
              },
              {
                bullets: [
                  'Choose observables when the interesting work happens over time.',
                  'Choose signals when the interesting work is derived from the current value right now.',
                  'If the hooks would have to change, the decision is happening at the wrong layer.',
                ],
                id: 'rule-of-thumb',
                paragraphs: [
                  'A simple rule of thumb: let the handler internals do the weird stuff so the component can stay boring. That is the whole point of the abstraction.',
                ],
                title: 'Rule of thumb',
              },
            ],
            eyebrow: 'Guides',
            id: 'handler-patterns',
            intro: 'Start with the zero-dependency native engine and scale to observables or signals when you need them.',
            summary: 'Native, streams, or signals. Same outside shape.',
            title: 'Pick your Engine',
          },
          {
            blocks: [
              {
                id: 'singleton-example',
                liveExample: 'status-quo-singleton-workspace',
                paragraphs: [
                  'Most handlers should start local. That keeps ownership obvious and teardown automatic. Promote the handler to a singleton when two parts of the UI genuinely need the same instance or when the state should survive a remount. In this example, a controls panel and a summary panel both read the same shared counter without a parent owning the instance.',
                ],
                title: 'Start local, then share',
              },
              {
                codeExamples: [
                  {
                    code: statusQuoSingletonHandlerExample,
                    label: 'Counter singleton handler',
                    language: 'ts',
                  },
                ],
                id: 'singleton-handler-source',
                paragraphs: [
                  'Start with the handler file. It owns transitions and exports the singleton definition.',
                ],
                title: 'Source: handler',
              },
              {
                id: 'singleton-source-bridge',
                paragraphs: [
                  'Once the singleton exists, consumers only subscribe to it. No parent has to recreate or pass the instance through props.',
                ],
                title: 'Bridge to consumers',
              },
              {
                codeExamples: [
                  {
                    code: statusQuoSingletonComponentExample,
                    label: 'Counter singleton consumers',
                    language: 'tsx',
                  },
                ],
                id: 'singleton-consumer-source',
                paragraphs: [
                  'The consumer file stays thin: read the shared snapshot and trigger actions from any component that needs the same instance.',
                ],
                title: 'Source: consumers',
              },
              {
                bullets: [
                  'Singletons stay alive by default, even when the last consumer disappears.',
                  'Use `destroyOnNoConsumers: true` when the shared instance should track mount lifecycle.',
                  'If you are unsure, keep it local first and promote later.',
                ],
                id: 'lifecycle-tradeoffs',
                paragraphs: [
                  'The default favors persistence, which fits app-level shared state better. If a singleton should behave more like a mounted resource, opt into teardown with `destroyOnNoConsumers: true`.',
                ],
                title: 'Singleton does not mean forever',
              },
            ],
            eyebrow: 'Guides',
            id: 'local-vs-singleton',
            intro: 'Local is the default. Singleton is the move once the same handler really has more than one owner.',
            summary: 'Start local. Share on purpose.',
            title: 'Local vs Singleton',
          },
          {
            blocks: [
              {
                callout:
                  'A provider scope is shared local state, not app-global state in disguise.',
                id: 'provider-scope-example',
                liveExample: 'status-quo-provider-wizard',
                paragraphs: [
                  'This is the pattern for sharing one local handler instance across a subtree without promoting it to a singleton.',
                  'The parent owns creation once with `useStateHandler()`, `StateProvider` shares the instance, and each child decides whether it needs snapshots, actions, or the raw handler.',
                ],
                title: 'Share one local instance across the subtree',
              },
              {
                codeExamples: [
                  {
                    code: statusQuoProviderHandlerExample,
                    label: 'Wizard scope handler',
                    language: 'ts',
                  },
                  {
                    code: statusQuoProviderComponentExample,
                    label: 'Wizard scope components',
                    language: 'tsx',
                  },
                ],
                id: 'provider-scope-source',
                paragraphs: [
                  'The source stays split on purpose: one file owns transitions, one file owns React wiring.',
                ],
                title: 'Source split',
              },
              {
                bullets: [
                  'Use a provider scope when a parent owns lifecycle but several descendants need the same handler.',
                  'Split render-heavy state readers from action-only bricks when they do not need to rerender together.',
                  'Reach for a singleton only when the handler should outlive that local subtree.',
                ],
                id: 'provider-scope-tradeoffs',
                paragraphs: [
                  'The flow still dies with the local scope; only access is shared.',
                  'This is often the clean middle ground between a local shortcut and a singleton. You keep ownership local, but you stop threading the handler through props or cramming state reads and actions into the same component just because the instance needs to be shared.',
                ],
                title: 'Keep ownership local, share access on purpose',
              },
            ],
            eyebrow: 'Guides',
            id: 'scoped-provider',
            intro: 'Use a provider scope when one local handler should be shared inside a subtree, while state readers and action-only components stay split.',
            summary: 'One handler. One scope. Cleaner bricks.',
            title: 'Scoped Provider',
          },
          {
            blocks: [
              {
                callout:
                  'Shortcuts are for components. Base hooks are there when the shortcut starts hiding too much.',
                codeExamples: [
                  {
                    code: statusQuoBaseCompositionExample,
                    label: 'Base composition',
                    language: 'tsx',
                  },
                  {
                    code: statusQuoShortcutCompositionExample,
                    label: 'Shortcut composition',
                    language: 'tsx',
                  },
                ],
                bullets: [
                  '`useStateFactory()` is the normal fast path for local state.',
                  '`useStateSingleton()` is the same shortcut when the instance is shared.',
                  'Drop to `useStateHandler()` plus `useStateActions()` and `useStateSubscription()` when you want to split those concerns on purpose.',
                ],
                id: 'hooks-composition',
                paragraphs: [
                  'Most of the time, the shortcut APIs are exactly what you want. They keep component code small and readable. The lower-level hooks are still worth knowing because they let you subscribe narrowly, grab actions without state, or stage the pieces separately.',
                ],
                title: 'Base hooks versus shortcuts',
              },
              {
                codeExamples: [
                  {
                    code: statusQuoBindSubscribableExample,
                    label: 'Compose with bindSubscribable',
                    language: 'ts',
                  },
                ],
                bullets: [
                  'Keep syncing logic inside the handler instead of scattering it across component effects.',
                  '`bindSubscribable()` works with any source that exposes `subscribe()` and optionally `getSnapshot()`.',
                  'Selectors and equality checks matter here too, especially when noisy upstream changes should not trigger work.',
                ],
                id: 'handler-composition',
                paragraphs: [
                  '`bindSubscribable()` is the low-level composition tool. Use it when one handler should react to another handler, a singleton, or another subscribable source. This is also the seam that makes `@veams/status-quo-query` fit naturally into the same model.',
                ],
                title: 'Compose handlers, not components',
              },
            ],
            eyebrow: 'Guides',
            id: 'composition',
            intro: 'There are two kinds of composition here: wiring hooks in React and wiring handlers to other subscribable sources.',
            summary: 'Shortcuts when you can. Low-level when it pays off.',
            title: 'Composition',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoSelectorSimpleExample,
                    label: 'Simple selector',
                    language: 'ts',
                  },
                  {
                    code: statusQuoSelectorExample,
                    label: 'Selector with equality',
                    language: 'ts',
                  },
                ],
                id: 'selector-example',
                paragraphs: [
                  'If a component only cares about `user.profile`, subscribe to `user.profile`. Selectors are the clean way to keep the store cohesive without pushing the whole state tree through every consumer.',
                ],
                title: 'Subscribe to the slice that matters',
              },
              {
                codeExamples: [
                  {
                    code: statusQuoSelectorProvidedExample,
                    label: 'Provider-scoped selector',
                    language: 'ts',
                  },
                  {
                    code: statusQuoSelectorSingletonExample,
                    label: 'Singleton selector',
                    language: 'ts',
                  },
                ],
                id: 'selector-surfaces',
                paragraphs: [
                  'Selectors are not limited to one hook. The same pattern applies when the source comes from provider scope or a singleton.',
                ],
                title: 'Use selectors on every subscription surface',
              },
              {
                codeExamples: [
                  {
                    code: statusQuoBindSubscribableExample,
                    label: 'Selector-style derivation with bindSubscribable',
                    language: 'ts',
                  },
                ],
                id: 'selector-bind-subscribable',
                paragraphs: [
                  'Selectors are also useful inside handlers. `bindSubscribable()` lets you map upstream state into a derived slice and skip noisy updates with an equality check, so the same “listen only to what matters” rule applies beyond React hooks.',
                ],
                title: 'Apply selector thinking in handler composition',
              },
              {
                callout: 'Selectors are the main tool for controlling rerender fanout.',
                bullets: [
                  'Subscribe to full state only when the component really needs all of it.',
                  'Reach for a selector as soon as one branch of state clearly drives the UI.',
                  'Add an equality function when referential comparison is still too noisy.',
                ],
                id: 'selector-guidelines',
                paragraphs: [
                  'This is the practical scaling tool in Status Quo. One handler can stay coherent while each consumer asks for only the bit it actually renders.',
                ],
                title: 'Keep rerenders boring',
              },
            ],
            eyebrow: 'Guides',
            id: 'selectors',
            intro: 'Do not pipe the whole handler into every component just because it is easy. Subscribe to the part that really drives the UI.',
            summary: 'Listen to less. Rerender less.',
            title: 'Selectors',
          },
          {
            blocks: [
              {
                callout:
                  'If the Redux DevTools browser extension is missing, Status Quo logs that once and keeps running without a devtools connection.',
                codeExamples: [
                  {
                    code: statusQuoGlobalDevToolsSetup,
                    label: 'Global default',
                    language: 'ts',
                  },
                  {
                    code: statusQuoDevToolsExample,
                    label: 'Per-handler override',
                    language: 'ts',
                  },
                ],
                id: 'devtools-setup',
                paragraphs: [
                  'Status Quo can connect handlers to the **Redux DevTools** browser extension without changing the handler model. Turn it on once through `setupStatusQuo({ devTools: { enabled: true } })`, then override per handler with `options.devTools` when you need a custom namespace or want to opt a handler out.',
                ],
                title: 'Wire handlers into Redux DevTools',
              },
              {
                bullets: [
                  'Works for `NativeStateHandler`, `ObservableStateHandler`, and `SignalStateHandler`.',
                  'Every `setState(nextState, actionName)` call is sent to the Redux DevTools timeline.',
                  'If you omit `namespace`, Status Quo uses the handler class name by default.',
                ],
                id: 'devtools-defaults',
                paragraphs: [
                  'That class-name fallback is the convenience path when devtools are enabled globally. If you want a stable or shorter label, set `options.devTools.namespace` on that handler explicitly.',
                ],
                title: 'Global defaults, local overrides',
              },
              {
                bullets: [
                  'Reset, commit, jump to action, and jump to state are supported from the extension UI.',
                  'The handler remains the source of truth; the extension is only a debugging surface.',
                  'Explicit action names matter here because they become the timeline labels.',
                ],
                id: 'devtools-behavior',
                paragraphs: [
                  'This is intentionally lightweight. Status Quo does not turn handlers into Redux stores. It only mirrors transitions into the extension so you can inspect and replay state changes while keeping the handler model intact.',
                ],
                title: 'What the integration actually does',
              },
            ],
            eyebrow: 'Guides',
            id: 'devtools',
            intro: 'Use Redux DevTools when you want to inspect handler transitions in the browser without changing the state model itself.',
            summary: 'Inspect transitions with Redux DevTools.',
            title: 'Devtools',
          },
        ],
        title: 'Guides',
      },
      {
        id: 'api',
        pages: [
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoApiImports,
                    label: 'Root + React exports',
                    language: 'ts',
                  },
                  {
                    code: statusQuoSubpathImports,
                    label: 'Subpath exports',
                    language: 'ts',
                  },
                ],
                id: 'entry-points',
                paragraphs: [
                  'The root package is framework-agnostic and covers handlers, runtime setup, and singleton helpers. Use `@veams/status-quo/react` for the React integration layer and `@veams/status-quo/store` when you want the store primitives grouped separately.',
                ],
                title: 'Entry points',
              },
              {
                bullets: [
                  'Use it once during app startup, not inside components.',
                  '`distinct.enabled` toggles package-wide distinct update behavior.',
                  '`distinct.comparator` replaces the default equality strategy.',
                  '`devTools.enabled` turns Redux DevTools on by default for handlers.',
                ],
                id: 'setup-status-quo',
                paragraphs: [
                  'Use `setupStatusQuo(config?)` when you want package-wide defaults for how handlers behave. The most important global knobs are distinct-update behavior and whether handlers should connect to Redux DevTools by default. Local handler options can still override those defaults.',
                ],
                title: 'setupStatusQuo',
              },
              {
                bullets: [
                  'Creates one handler instance per component mount.',
                  'Accepts a factory and optional factory params.',
                  'Use it when you want full control over lifecycle and composition.',
                ],
                codeExamples: [
                  {
                    code: statusQuoHookUseStateHandlerExample,
                    label: 'Simple example',
                    language: 'tsx',
                  },
                ],
                id: 'use-state-handler',
                paragraphs: [
                  'Use `useStateHandler(factory, params?)` as the low-level hook for local handler creation. It gives you the handler instance itself, which makes it the right starting point when you want to compose state access and action access separately.',
                ],
                title: 'useStateHandler',
              },
              {
                bullets: [
                  'Shares one handler instance with a subtree through React context.',
                  'Keeps creation ownership in the parent component.',
                  'Works well when state readers and action-only bricks should stay split.',
                ],
                codeExamples: [
                  {
                    code: statusQuoHookStateProviderExample,
                    label: 'Simple example',
                    language: 'tsx',
                  },
                ],
                id: 'state-provider',
                paragraphs: [
                  'Use `StateProvider` when a parent already owns a handler instance and descendant components should consume that same instance without prop drilling. It is the scoped-sharing option between a local handler and a singleton.',
                ],
                title: 'StateProvider',
              },
              {
                bullets: [
                  'Reads the shared handler instance from the nearest `StateProvider`.',
                  'Useful when a descendant needs the raw handler for manual composition.',
                  'Throws when used outside a matching provider scope.',
                ],
                codeExamples: [
                  {
                    code: statusQuoHookUseProvidedStateHandlerExample,
                    label: 'Simple example',
                    language: 'tsx',
                  },
                ],
                id: 'use-provided-state-handler',
                paragraphs: [
                  'Use `useProvidedStateHandler()` when provider scope is already set up and a child component needs direct access to the shared handler instance. This is the low-level entry point for provider-based composition.',
                ],
                title: 'useProvidedStateHandler',
              },
              {
                bullets: [
                  'Returns handler actions without subscribing to state.',
                  'Useful for action-only components or event wiring.',
                  'Pair it with `useStateHandler` when you want manual composition.',
                ],
                codeExamples: [
                  {
                    code: statusQuoHookUseStateActionsExample,
                    label: 'Simple example',
                    language: 'tsx',
                  },
                ],
                id: 'use-state-actions',
                paragraphs: [
                  'Use `useStateActions(handler)` when a component needs to trigger behavior but does not need to rerender from state changes. It keeps action access explicit and avoids unnecessary subscriptions.',
                ],
                title: 'useStateActions',
              },
              {
                bullets: [
                  'Returns actions from the nearest `StateProvider` without subscribing to state.',
                  'Strong fit for toolbar, button row, or command-only bricks.',
                  'Lets action access stay separate from rendering concerns.',
                ],
                codeExamples: [
                  {
                    code: statusQuoHookUseProvidedStateActionsExample,
                    label: 'Simple example',
                    language: 'tsx',
                  },
                ],
                id: 'use-provided-state-actions',
                paragraphs: [
                  'Use `useProvidedStateActions()` when a child component only needs to trigger behavior from the shared scoped handler. This is the clean way to keep action-only UI out of rerender fanout.',
                ],
                title: 'useProvidedStateActions',
              },
              {
                bullets: [
                  'Subscribes to full state or a selected slice.',
                  'Works with either a handler instance or a singleton.',
                  'Accepts an optional equality function for stable selector results.',
                ],
                codeExamples: [
                  {
                    code: statusQuoHookUseStateSubscriptionExample,
                    label: 'Simple example',
                    language: 'tsx',
                  },
                ],
                id: 'use-state-subscription',
                paragraphs: [
                  'Use `useStateSubscription(source, selector?, isEqual?)` when you want the rendering surface itself: selected state plus actions. This is the main hook for controlling what a component actually listens to.',
                ],
                title: 'useStateSubscription',
              },
              {
                bullets: [
                  'Subscribes to the nearest `StateProvider` instead of accepting a source argument.',
                  'Supports full snapshots, selectors, and custom equality just like `useStateSubscription`.',
                  'Best when the instance is already shared through provider scope.',
                ],
                codeExamples: [
                  {
                    code: statusQuoHookUseProvidedStateSubscriptionExample,
                    label: 'Simple example',
                    language: 'tsx',
                  },
                ],
                id: 'use-provided-state-subscription',
                paragraphs: [
                  'Use `useProvidedStateSubscription(selector?, isEqual?)` when the handler instance already comes from `StateProvider` and the component only needs to declare what slice it should listen to.',
                ],
                title: 'useProvidedStateSubscription',
              },
              {
                bullets: [
                  'Combines handler creation and subscription.',
                  'Best for local component state with one obvious consumer.',
                  'The shortest path from factory to rendered state.',
                ],
                codeExamples: [
                  {
                    code: statusQuoHookUseStateFactoryExample,
                    label: 'Simple example',
                    language: 'tsx',
                  },
                ],
                id: 'use-state-factory',
                paragraphs: [
                  'Use `useStateFactory(factory, selector?, isEqual?, params?)` when you want the convenience path. It is the fastest way to create a local handler and subscribe to it in one step.',
                ],
                title: 'useStateFactory',
              },
              {
                bullets: [
                  'Subscribes to a shared singleton instance.',
                  'Lets multiple consumers read the same handler state.',
                  'Lifecycle behavior comes from the singleton definition itself.',
                ],
                codeExamples: [
                  {
                    code: statusQuoHookUseStateSingletonExample,
                    label: 'Simple example',
                    language: 'tsx',
                  },
                ],
                id: 'use-state-singleton',
                paragraphs: [
                  'Use `useStateSingleton(singleton, selector?, isEqual?)` when state should outlive a single component tree or when multiple consumers should observe the same handler instance.',
                ],
                title: 'useStateSingleton',
              },
              {
                bullets: [
                  'Defines the shared lifecycle and subscription contract.',
                  'Provides the base behavior other handlers build on.',
                  'Useful as the conceptual root of the package surface.',
                ],
                id: 'base-state-handler',
                paragraphs: [
                  'Use `BaseStateHandler` as the shared foundation when you are reasoning about the handler contract itself. Most app code will extend one of the concrete handler implementations rather than extending the base class directly.',
                ],
                title: 'BaseStateHandler',
              },
              {
                bullets: [
                  'Zero-dependency native handler implementation.',
                  'Plain JS based and perfect for simple state management.',
                  'Keeps the same external contract as the other handlers.',
                ],
                id: 'native-state-handler',
                paragraphs: [
                  'Use `NativeStateHandler` as your default starting point. It has zero external dependencies and provides a clean, predictable state model using plain JavaScript. Scale up to other handlers only when your composition needs it.',
                ],
                title: 'NativeStateHandler',
              },
              {
                bullets: [
                  'RxJS-backed handler implementation.',
                  'Strong fit for stream composition and operator-heavy state flows.',
                  'Keeps the same external contract as the Signals version.',
                ],
                id: 'observable-state-handler',
                paragraphs: [
                  'Use `ObservableStateHandler` when your state composition naturally benefits from observables, subscriptions, and stream operators. The UI-facing API stays the same; only the internal reactive engine changes.',
                ],
                title: 'ObservableStateHandler',
              },
              {
                bullets: [
                  'Signals-backed handler implementation.',
                  'Strong fit for lightweight value-style derivation.',
                  'Matches the same outer API as the RxJS version.',
                ],
                id: 'signal-state-handler',
                paragraphs: [
                  'Use `SignalStateHandler` when you want a compact reactive engine with direct derivation and minimal runtime overhead. It is the lighter-weight option when stream composition is not the main need.',
                ],
                title: 'SignalStateHandler',
              },
              {
                bullets: [
                  'Promotes a handler factory into shared state.',
                  'Supports lifecycle control through `destroyOnNoConsumers`.',
                  'Returns a singleton definition that hooks can subscribe to.',
                ],
                id: 'make-state-singleton',
                paragraphs: [
                  'Use `makeStateSingleton(factory, options?)` when state should be shared across consumers instead of created per mount. This is the boundary where local handler patterns become app-level shared state.',
                ],
                title: 'makeStateSingleton',
              },
              {
                bullets: [
                  '`StateSingleton` and `StateSingletonOptions` describe the singleton helper surface.',
                  '`StateSubscriptionHandler` describes the subscribable handler contract used by the hooks.',
                  'These types exist to keep app-level abstractions on the public API boundary.',
                ],
                id: 'types',
                paragraphs: [
                  'Use the exported types when you are wrapping Status Quo in your own abstractions and want to stay on supported public contracts rather than reaching into internals.',
                ],
                title: 'Types',
              },
            ],
            eyebrow: 'API',
            id: 'api',
            intro: 'Start at the root for framework-agnostic pieces, then import the React integration from `@veams/status-quo/react` when you are wiring handlers into React.',
            summary: 'The full surface, minus the noise.',
            title: 'API',
          },
        ],
        title: 'API',
      },
      {
        id: 'examples',
        pages: [
          {
            blocks: [
              {
                bullets: [
                  'Use `useStateFactory()` when one component owns the handler lifecycle.',
                  'Keep the handler file focused on transitions and the component file focused on inputs.',
                  'This is the default starting point before considering provider scope or a singleton.',
                ],
                codeExamples: [
                  {
                    code: statusQuoQuickStartHandler,
                    label: 'Draft note handler',
                    language: 'ts',
                  },
                  {
                    code: statusQuoQuickStartComponent,
                    label: 'Draft note component',
                    language: 'tsx',
                  },
                ],
                id: 'local-example',
                paragraphs: [
                  'This example shows the cleanest local-state path in Status Quo. The handler owns the draft transitions, while the React component uses `useStateFactory()` as the shortcut that creates the handler and subscribes in one line.',
                  'The live demo comes first so you can see the lifecycle in action: edit the draft, flip the tone, then reset it. Below that, the source stays split so the handler logic and the React wiring are readable on their own.',
                ],
                liveExample: 'status-quo-local-draft',
                title: 'Local state with `useStateFactory`',
              },
            ],
            eyebrow: 'Examples',
            id: 'example-local-state',
            intro: 'Start with local ownership when one component owns the handler lifecycle.',
            summary: 'Local state with the shortest valid setup.',
            title: 'Local state with `useStateFactory`',
          },
          {
            blocks: [
              {
                bullets: [
                  'Use `makeStateSingleton()` only when several consumers truly need the same handler instance.',
                  'The singleton owns lifecycle, so components only subscribe to it.',
                  'This is the promotion path from local state to shared state.',
                ],
                codeExamples: [
                  {
                    code: statusQuoSingletonHandlerExample,
                    label: 'Counter singleton handler',
                    language: 'ts',
                  },
                  {
                    code: statusQuoSingletonComponentExample,
                    label: 'Counter singleton consumers',
                    language: 'tsx',
                  },
                ],
                id: 'singleton-example',
                paragraphs: [
                  'This example shows the moment where local state should become shared state. The handler is lifted into a singleton because both panels need the same counter value and neither component should recreate the instance.',
                  'The handler file only defines the shared counter and exports the singleton. The React file stays thin and uses `useStateSingleton()` from two different consumers.',
                ],
                liveExample: 'status-quo-singleton-workspace',
                title: 'Singleton counter shared across consumers',
              },
            ],
            eyebrow: 'Examples',
            id: 'example-singleton-counter',
            intro: 'Promote local state to shared state only when multiple consumers need one handler instance.',
            summary: 'One counter handler shared by multiple consumers.',
            title: 'Singleton counter shared across consumers',
          },
          {
            blocks: [
              {
                bullets: [
                  'Use the base hooks when the shortcut starts hiding too much.',
                  'Keep `useStateHandler()`, `useStateActions()`, and `useStateSubscription()` separate when each concern should be explicit.',
                  'This composition style works well when the parent should pass the handler down intentionally.',
                ],
                codeExamples: [
                  {
                    code: statusQuoCompositionHandlerExample,
                    label: 'Checklist handler',
                    language: 'ts',
                  },
                  {
                    code: statusQuoCompositionComponentExample,
                    label: 'Checklist components',
                    language: 'tsx',
                  },
                ],
                id: 'composition-example',
                paragraphs: [
                  'This example stays local, but it deliberately avoids the shortcut. The parent creates one handler instance with `useStateHandler()`, summary components subscribe only to the data they render, and controls read actions separately with `useStateActions()`.',
                  'That split is the value of base composition: ownership is still local, but lifecycle, subscriptions, and commands are each expressed in the place that actually needs them.',
                ],
                liveExample: 'status-quo-composition-checklist',
                title: 'Base hook composition without shortcuts',
              },
            ],
            eyebrow: 'Examples',
            id: 'example-base-hook-composition',
            intro: 'Use base hooks directly when ownership and subscriptions should stay explicit.',
            summary: 'Composable lifecycle, subscriptions, and actions.',
            title: 'Base hook composition without shortcuts',
          },
          {
            blocks: [
              {
                bullets: [
                  'Use provider scope when one local handler should be shared inside a subtree.',
                  'The parent still owns lifecycle; the provider only shares access.',
                  'Descendants can subscribe narrowly or grab actions without subscribing.',
                ],
                codeExamples: [
                  {
                    code: statusQuoProviderHandlerExample,
                    label: 'Wizard scope handler',
                    language: 'ts',
                  },
                  {
                    code: statusQuoProviderComponentExample,
                    label: 'Wizard scope components',
                    language: 'tsx',
                  },
                ],
                id: 'provider-example',
                paragraphs: [
                  'This example is the middle ground between prop threading and a singleton. One parent owns the wizard flow locally, then `StateProvider` shares that same instance with progress and command components deeper in the tree.',
                  'The split source makes the boundary explicit: the handler file owns transitions, while the React file shows the provider boundary plus the descendant hooks that consume it.',
                ],
                liveExample: 'status-quo-provider-wizard',
                title: 'Scoped provider for shared local state',
              },
            ],
            eyebrow: 'Examples',
            id: 'example-scoped-provider',
            intro: 'Share one locally owned handler across a subtree without promoting to singleton scope.',
            summary: 'Provider-scoped shared local state.',
            title: 'Scoped provider for shared local state',
          },
          {
            blocks: [
              {
                bullets: [
                  'Selectors are how you control rerender fanout without fragmenting the handler.',
                  'Return only the slice the component renders, then add an equality function when the selector creates new objects.',
                  'Compare render counts to see the optimization, not just the API surface.',
                ],
                codeExamples: [
                  {
                    code: statusQuoSelectorHandlerExample,
                    label: 'Profile handler',
                    language: 'ts',
                  },
                  {
                    code: statusQuoSelectorComponentExample,
                    label: 'Selector-optimized components',
                    language: 'tsx',
                  },
                ],
                id: 'selector-example',
                paragraphs: [
                  'This example focuses on selector optimization rather than ownership. One component subscribes to a derived identity object with a custom equality function, while another subscribes to the full snapshot and rerenders on every change.',
                  'The demo makes the tradeoff visible. Toggle unrelated UI state and watch the selector-driven card stay stable until the selected name or role actually changes.',
                ],
                liveExample: 'status-quo-selector-profile',
                title: 'Selector optimization with custom equality',
              },
            ],
            eyebrow: 'Examples',
            id: 'example-selector-optimization',
            intro: 'Use selectors to minimize rerenders while keeping one coherent handler model.',
            summary: 'Selector-based rerender control with custom equality.',
            title: 'Selector optimization with custom equality',
          },
        ],
        title: 'Examples',
      },
    ],
    title: 'Status Quo',
  },
  {
    accent: 'ocean',
    description: 'Query and mutation handles over TanStack Query core, plus a cache facade for client-level operations.',
    githubPath: 'packages/status-quo-query',
    id: 'status-quo-query',
    npm: '@veams/status-quo-query',
    sections: [
      {
        id: 'getting-started',
        pages: [
          {
            blocks: [
              {
                bullets: [
                  'Query and mutation handles shaped to fit the Status Quo model.',
                  'Passive snapshots that are easy to sync into state handlers.',
                  'A cache facade for broader coordination when the flow crosses query boundaries.',
                ],
                id: 'shape',
                paragraphs: [
                  'Status Quo Query exists to align TanStack Query with the Status Quo mental model. Instead of pushing raw observer objects through your app, it gives you query and mutation handles that are easier to bridge into state handlers and other explicit state flows.',
                ],
                title: 'Bring query state into the same flow',
              },
              {
                featureCards: statusQuoQueryPhilosophyCards,
                id: 'principles',
                paragraphs: [
                  'The wrapper stays useful when each layer keeps a narrow job: **snapshots are passive**, **commands are explicit**, and **broad cache work has one clear home**.',
                ],
                title: 'Principles in practice',
              },
              {
                bullets: [
                  'Snapshots are passive state only.',
                  'Commands live on the handle: `refetch`, `mutate`, `reset`, `invalidate`.',
                  'Broad orchestration stays on the cache facade.',
                ],
                id: 'passive-snapshots',
                paragraphs: [
                  'A snapshot should describe state, not smuggle behavioral commands inside it.',
                ],
                title: 'Keep snapshots passive',
              },
              {
                bullets: [
                  'Exact-key invalidation belongs on a query handle.',
                  'Broad filters belong on the cache facade.',
                  'Unsafe access is explicit so it does not become the default path.',
                ],
                id: 'scope',
                paragraphs: [
                  'The package separates command scope deliberately. A handle should act on the thing it already owns; broader cache work should stay in the cache layer.',
                ],
                title: 'Keep command scope honest',
              },
            ],
            eyebrow: 'Getting Started',
            heroBullets: [
              'Query and mutation handles that fit the Status Quo model.',
              'Passive snapshots that sync cleanly into state handlers.',
              'Explicit cache orchestration when the flow goes broader.',
            ],
            heroParagraphs: [
              'Status Quo Query connects TanStack Query to the Status Quo way of working. Queries and mutations expose passive snapshots and explicit commands, so syncing remote state into a handler feels natural instead of like an adapter bolted on afterward.',
            ],
            id: 'overview',
            intro: 'Start by understanding how query handles, mutation handles, and cache orchestration line up with the Status Quo handler model.',
            summary: 'TanStack Query, aligned with Status Quo.',
            title: 'Overview',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoQueryFrameworkImports,
                    label: 'Framework-agnostic service layer',
                    language: 'ts',
                  },
                ],
                bullets: [
                  'Built on `@tanstack/query-core`, not on framework hooks.',
                  'No component bindings in this package; it exposes subscribable handles and cache commands.',
                  'React can be used around it, but the query/mutation API stays framework-neutral.',
                ],
                id: 'framework-support',
                paragraphs: [
                  'Status Quo Query is not tied to React. Keep it in the service and state handler layer, then let your UI framework consume snapshots and trigger commands.',
                  'React examples in guides are integration examples only. They demonstrate one rendering layer, while the query facade itself remains framework-agnostic.',
                ],
                title: 'Framework Support',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'framework-support',
            intro: 'Treat query and mutation handles as framework-neutral service objects, then consume them from your chosen UI layer.',
            summary: 'Framework-neutral query facade.',
            title: 'Framework Support',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoQueryInstall,
                    label: 'Install',
                    language: 'bash',
                  },
                ],
                id: 'install',
                paragraphs: [
                  'Install the wrapper package plus `@tanstack/query-core`. The package stays focused on the service layer, so the core TanStack dependency remains explicit.',
                ],
                title: 'Install the package',
              },
              {
                bullets: [
                  'Bring your own `QueryClient`.',
                  'Use `setupQueryProvider(queryClient)` when you want the combined facade.',
                  'Use `setupQuery` or `setupMutation` directly when you want a narrower entry point.',
                ],
                id: 'entry-points',
                paragraphs: [
                  'The installation flow is really about choosing the entry point that matches how much of the package surface you want to expose at one time.',
                ],
                title: 'Choose an entry point',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'installation',
            intro: 'The package builds on a normal `QueryClient`, then lets you decide whether you want the combined cache facade or the narrower factories.',
            summary: 'Bring a QueryClient. Keep the rest simple.',
            title: 'Installation',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoQueryQuickStart,
                    label: 'Setup cache, query, and mutation',
                    language: 'ts',
                  },
                ],
                id: 'first-flow',
                paragraphs: [
                  'A good quick start creates both a query and a mutation, because the package is about the service layer around both patterns rather than just one observer type.',
                ],
                title: 'Create the first end-to-end flow',
              },
              {
                bullets: [
                  'Use `cache.createQuery` for the query handle.',
                  'Use `cache.createMutation` for the mutation handle.',
                  'Call commands on the handle, not on the snapshot.',
                ],
                id: 'workflow',
                paragraphs: [
                  'The main habit change is simple: snapshots are read-only state, while commands stay on the thing that owns them.',
                ],
                title: 'Keep commands on the handle',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'quick-start',
            intro: 'Use the cache facade for a first working flow, then split into lower-level factories only when the app structure really benefits from it.',
            summary: 'One cache. One query. One mutation.',
            title: 'Quick Start',
          },
        ],
        title: 'Getting Started',
      },
      {
        id: 'guides',
        pages: [
          {
            blocks: [
              {
                bullets: [
                  'Handle-local commands are for one query or one mutation.',
                  'Cache-level commands are for broader orchestration.',
                  'The same codebase will usually need both levels.',
                ],
                id: 'levels',
                paragraphs: [
                  'The most important guide decision is not query versus mutation, it is handle scope versus cache scope. Keeping those two levels distinct is what makes the wrapper useful.',
                ],
                title: 'Choose the right control level',
              },
            ],
            eyebrow: 'Guides',
            id: 'cache-vs-handle',
            intro: 'Use the handle when you already know the specific query or mutation you want to act on; use the cache facade when the operation spans multiple queries.',
            summary: 'Keep local actions local.',
            title: 'Cache vs Handle',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoQueryInvalidateExample,
                    label: 'Invalidate and patch cache',
                    language: 'ts',
                  },
                ],
                id: 'invalidate-example',
                paragraphs: [
                  'Invalidation is where the handle/cache split becomes practical. Exact-key invalidation belongs on the query handle, while broader key filters and direct cache updates belong on the cache facade.',
                ],
                title: 'Coordinate invalidation and cache updates',
              },
              {
                bullets: [
                  '`query.invalidate()` targets the current query key.',
                  '`cache.invalidateQueries()` supports broader filters.',
                  '`cache.setQueryData()` is the imperative path when you already know the correct next cache value.',
                ],
                id: 'invalidate-guidelines',
                paragraphs: [
                  'Use the narrower command first. Reach for the broad cache methods when the behavior truly crosses query boundaries.',
                ],
                title: 'Keep invalidation deliberate',
              },
            ],
            eyebrow: 'Guides',
            id: 'invalidation',
            intro: 'Invalidation is best when the API makes scope obvious. The wrapper does that by putting exact-key behavior on the handle and broader filters on the cache facade.',
            summary: 'Make cache scope obvious.',
            title: 'Invalidation',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoQueryEscapeHatchExample,
                    label: 'Unsafe escape hatches',
                    language: 'ts',
                  },
                ],
                id: 'unsafe-example',
                paragraphs: [
                  'The package includes escape hatches because TanStack Query is broad and some advanced workflows will need the raw client or observer result. The important part is that these APIs are clearly marked as unsafe.',
                ],
                title: 'Use escape hatches deliberately',
              },
              {
                callout: 'Unsafe access should be the exception, not the normal integration path.',
                bullets: [
                  '`unsafe_getResult()` exposes the raw observer result for one handle.',
                  '`unsafe_getClient()` exposes the raw `QueryClient`.',
                  'Prefer the smaller facade until it is genuinely insufficient.',
                ],
                id: 'unsafe-guidelines',
                paragraphs: [
                  'The package keeps these methods available so you are not boxed in, but the naming is there to discourage casual overuse.',
                ],
                title: 'Keep the small facade as the default',
              },
            ],
            eyebrow: 'Guides',
            id: 'escape-hatches',
            intro: 'Escape hatches are healthy when they are explicit. Use them when you truly need raw TanStack behavior, not as the first integration step.',
            summary: 'Stay small. Escape when you must.',
            title: 'Escape Hatches',
          },
        ],
        title: 'Guides',
      },
      {
        id: 'api',
        pages: [
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoQueryApiImports,
                    label: 'Root exports',
                    language: 'ts',
                  },
                ],
                id: 'entry-points',
                paragraphs: [
                  'Use the root package when you want the whole service layer in one import. The public surface is intentionally small enough that most integrations do not need anything narrower.',
                ],
                title: 'Entry points',
              },
              {
                bullets: [
                  'Binds one TanStack `QueryClient` to the query factory.',
                  'Returns `createQuery` for building query handles.',
                  'Use it when you want only the query surface without the full cache facade.',
                ],
                id: 'setup-query',
                paragraphs: [
                  'Use `setupQuery(queryClient)` when you want a focused query-only entry point. It keeps the dependency on one `QueryClient` explicit and gives you a factory for creating query handles.',
                ],
                title: 'setupQuery',
              },
              {
                bullets: [
                  'Creates one query handle for one key and one query function.',
                  'The returned handle exposes `getSnapshot`, `subscribe`, `refetch`, `invalidate`, and `unsafe_getResult`.',
                  '`QueryInvalidateOptions` controls exact-key invalidation behavior.',
                ],
                id: 'create-query',
                paragraphs: [
                  'Use `createQuery(queryKey, queryFn, options?)` when you want one focused query handle with passive snapshot state and explicit commands. It is the main object most application code should work with after setup.',
                ],
                title: 'createQuery',
              },
              {
                bullets: [
                  'Includes `data`, `error`, `status`, `fetchStatus`, and the common boolean flags.',
                  'Represents passive query state only.',
                  'Designed to be read, not used as a command object.',
                ],
                id: 'query-snapshot',
                paragraphs: [
                  'Use `QueryServiceSnapshot` when you want the current state of a query handle in a small predictable shape. It is the stable surface for rendering and derived state checks.',
                ],
                title: 'QueryServiceSnapshot',
              },
              {
                bullets: [
                  'Binds one TanStack `QueryClient` to the mutation factory.',
                  'Returns `createMutation` for building mutation handles.',
                  'Use it when your integration only needs mutation behavior.',
                ],
                id: 'setup-mutation',
                paragraphs: [
                  'Use `setupMutation(queryClient)` when you want a focused mutation-only entry point. It mirrors the query setup shape so the package stays consistent across both handle types.',
                ],
                title: 'setupMutation',
              },
              {
                bullets: [
                  'Creates one mutation handle around one mutation function.',
                  'The returned handle exposes `getSnapshot`, `subscribe`, `mutate`, `reset`, and `unsafe_getResult`.',
                  'Best fit when application code should trigger one concrete mutation workflow.',
                ],
                id: 'create-mutation',
                paragraphs: [
                  'Use `createMutation(mutationFn, options?)` when you want one explicit mutation handle with clear commands and passive state. It is the mutation-side equivalent of `createQuery`.',
                ],
                title: 'createMutation',
              },
              {
                bullets: [
                  'Includes `data`, `error`, `status`, `variables`, and the common mutation flags.',
                  'Represents passive mutation state only.',
                  'Useful for rendering mutation progress and results without leaking commands into state reads.',
                ],
                id: 'mutation-snapshot',
                paragraphs: [
                  'Use `MutationServiceSnapshot` when the UI needs the current mutation state in a small readable shape. It is the surface for pending, success, error, and variables state.',
                ],
                title: 'MutationServiceSnapshot',
              },
              {
                bullets: [
                  'Returns `CacheApi` around one `QueryClient`.',
                  'Combines `createQuery` and `createMutation` with broader cache operations.',
                  'Acts as the shared cache instance for one app runtime boundary.',
                  'Best fit when one integration owns orchestration across queries and mutations.',
                ],
                id: 'setup-cache',
                paragraphs: [
                  'Use `setupQueryProvider(queryClient)` when you want one top-level facade for the whole service layer. The returned cache instance is a thin wrapper over your `QueryClient`: it creates query and mutation handles and centralizes cross-query cache commands in one place.',
                ],
                title: 'setupQueryProvider',
              },
              {
                bullets: [
                  'Exposes `invalidateQueries`, `refetchQueries`, `cancelQueries`, `removeQueries`, `resetQueries`, `getQueryData`, and `setQueryData`.',
                  'Also exposes `createQuery` and `createMutation` so setup stays centralized.',
                  '`unsafe_getClient()` is the explicit escape hatch back to the raw TanStack client.',
                ],
                id: 'cache-api',
                paragraphs: [
                  'Use `CacheApi` when the operation crosses query boundaries or when you need direct cache reads and writes. This is where orchestration belongs, not on individual snapshots.',
                ],
                title: 'CacheApi',
              },
              {
                bullets: [
                  '`toQueryMetaState(snapshot)` reduces a query snapshot to `status` and `fetchStatus`.',
                  '`isQueryLoading(metaState)` answers the common loading check on that reduced state.',
                  'These helpers are small on purpose and stay close to the query snapshot model.',
                ],
                id: 'helpers',
                paragraphs: [
                  'Use the helper functions when you want lightweight derived query state without repeatedly checking the full snapshot shape in application code.',
                ],
                title: 'Helpers',
              },
            ],
            eyebrow: 'API',
            id: 'api',
            intro: 'The public surface is split into query handles, mutation handles, and one cache facade for broader orchestration.',
            summary: 'Everything you can call, in one place.',
            title: 'API',
          },
        ],
        title: 'API',
      },
      {
        id: 'examples',
        pages: [
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoQueryQuickStart,
                    label: 'User query and mutation flow',
                    language: 'ts',
                  },
                ],
                id: 'user-flow',
                paragraphs: [
                  'This example shows the main package story: one cache facade, one query handle, one mutation handle, and commands that stay on the owning handle.',
                ],
                title: 'User workflow example',
              },
            ],
            eyebrow: 'Examples',
            id: 'example-user-workflow',
            intro: 'Start with a complete query and mutation flow around one cache facade.',
            summary: 'Query and mutation handles in one working flow.',
            title: 'User workflow example',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoQueryInvalidateExample,
                    label: 'Follow-up cache coordination',
                    language: 'ts',
                  },
                ],
                id: 'cache-follow-up',
                paragraphs: [
                  'A realistic example usually ends with some cache coordination after a mutation. That is why the cache facade exists alongside the narrower handles.',
                ],
                title: 'Cache follow-up example',
              },
            ],
            eyebrow: 'Examples',
            id: 'example-cache-follow-up',
            intro: 'Use cache commands after mutations when workflows require coordinated follow-up behavior.',
            summary: 'Cache orchestration after a mutation.',
            title: 'Cache follow-up example',
          },
        ],
        title: 'Examples',
      },
    ],
    title: 'Status Quo Query',
  },
  {
    accent: 'violet',
    description:
      'Generic form state over Status Quo, with optional React bindings for native and controlled fields.',
    githubPath: 'packages/form',
    id: 'form',
    npm: '@veams/form',
    sections: [
      {
        id: 'getting-started',
        pages: [
          {
            blocks: [
              {
                featureCards: formOverviewCards,
                id: 'ownership-map',
                paragraphs: [
                  'Use this as the mental model: feature state owns form state, and the React layer only binds inputs to that existing controller.',
                ],
                title: 'Ownership map',
              },
              {
                bullets: [
                  'Root entrypoint stays generic and framework-agnostic.',
                  'React bindings live under `@veams/form/react`.',
                  'Feature handlers can own the form handler instead of React owning it.',
                ],
                id: 'shape',
                paragraphs: [
                  'The package is deliberately split in the same way as Status Quo itself. The root gives you a typed `FormStateHandler` with validation, touched state, and submit state. The React entrypoint only handles binding that controller into native form elements or controlled components.',
                ],
                title: 'Keep the form model generic',
              },
              {
                bullets: [
                  'Validation lives close to the values.',
                  'Touched state stays explicit instead of being inferred from ad-hoc component flags.',
                  'Submission state is part of the same form snapshot.',
                ],
                id: 'why',
                paragraphs: [
                  'This keeps form concerns in one coherent object instead of scattering them across local component state, event handlers, and one-off helpers.',
                ],
                title: 'One handler for the full form lifecycle',
              },
            ],
            eyebrow: 'Getting Started',
            heroBullets: [
              'Typed values, errors, touched state, and submit state in one handler.',
              'A root API that does not depend on React.',
              'React helpers for uncontrolled native fields and controlled third-party inputs.',
            ],
            heroParagraphs: [
              'VEAMS Form builds on Status Quo to give forms the same explicit ownership model as the rest of the state layer. Keep the form controller generic, then opt into the React bindings only where the view needs them.',
            ],
            id: 'overview',
            intro: 'Start with the package split: generic form state at the root, React-only wiring under `@veams/form/react`.',
            summary: 'Explicit form state, clean React wiring.',
            title: 'Overview',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: formFrameworkCoreImports,
                    label: 'Framework-agnostic core',
                    language: 'ts',
                  },
                  {
                    code: formFrameworkReactImports,
                    label: 'Optional React bindings',
                    language: 'ts',
                  },
                ],
                bullets: [
                  'The root package (`@veams/form`) is framework-agnostic and owns the form model.',
                  'React bindings are optional and live in `@veams/form/react`.',
                  'Guides can use React examples for clarity while the core form patterns stay framework-independent.',
                ],
                id: 'framework-support',
                paragraphs: [
                  'VEAMS Form is not bound to React. Keep validation, errors, touched state, and submit state in `FormStateHandler`, then add React bindings only where the view needs them.',
                  'Using React in docs examples is a teaching choice, not a runtime requirement. The form controller API remains portable outside React.',
                ],
                title: 'Framework Support',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'framework-support',
            intro: 'Model form state in the framework-agnostic root package, then opt into React bindings only at the view boundary.',
            summary: 'Framework-neutral form model, optional React binding.',
            title: 'Framework Support',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: formInstall,
                    label: 'Install',
                    language: 'bash',
                  },
                ],
                id: 'install',
                paragraphs: [
                  'Install the form package alongside Status Quo. Add React when you want the provider, field hooks, and controller bindings.',
                ],
                title: 'Install the package',
              },
              {
                bullets: [
                  'Use the root package for `FormStateHandler` and types.',
                  'Use `@veams/form/react` for `FormProvider`, `useUncontrolledField`, and `Controller`.',
                  'Keep feature state in Status Quo handlers and let them own the form handler when the flow needs more than plain field state.',
                ],
                id: 'entry-points',
                paragraphs: [
                  'The main setup choice is which layer should own the controller lifecycle: the form provider itself or a higher-level feature handler.',
                ],
                title: 'Choose the owning layer',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'installation',
            intro: 'Install the generic core first, then opt into the React subpath when the UI needs it.',
            summary: 'Small install surface, clear entry points.',
            title: 'Installation',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: formQuickStartCore,
                    label: 'Generic form state',
                    language: 'ts',
                  },
                ],
                id: 'generic-handler',
                paragraphs: [
                  'You do not have to subclass anything to get a useful form controller. The built-in handler already owns values, errors, touched state, and submit state.',
                ],
                title: 'Create the form controller',
              },
              {
                codeExamples: [
                  {
                    code: formQuickStartReact,
                    label: 'React binding',
                    language: 'tsx',
                  },
                ],
                bullets: [
                  '`FormProvider` owns one controller instance locally when you do not pass `formHandlerInstance`.',
                  '`useUncontrolledField()` wires native inputs without turning every field into controlled React state.',
                  '`useFieldMeta()` is already included in the hook result as `meta` for validation UI.',
                ],
                id: 'react-layer',
                paragraphs: [
                  'The fast path for a plain React form is the provider plus uncontrolled field registration. That keeps render churn low while still syncing the DOM to the shared form snapshot.',
                ],
                title: 'Bind it into React',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'quick-start',
            intro: 'Start with one plain `FormStateHandler`, then bind it into React only where the UI needs it.',
            summary: 'One form handler, one provider, one clean flow.',
            title: 'Quick Start',
          },
        ],
        title: 'Getting Started',
      },
      {
        id: 'guides',
        pages: [
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: formFeatureOwnedExample,
                    label: 'Feature-owned form handler',
                    language: 'tsx',
                  },
                ],
                bullets: [
                  'Keep the form handler inside a broader feature handler when the form is only one part of the screen state.',
                  'Expose `getFormHandler()` as the seam between feature state and the React form provider.',
                  'Share validators and submit logic with the rest of the feature actions instead of scattering them across the view.',
                ],
                id: 'feature-owned',
                paragraphs: [
                  'This is the pattern that matches the referenced login implementation. The feature handler owns both UI state and form state, while the provider simply binds the existing controller into React.',
                ],
                title: 'Let the feature own the form',
              },
            ],
            eyebrow: 'Guides',
            id: 'feature-owned',
            intro: 'When a form is part of a richer screen flow, keep the controller inside the feature handler and pass it down explicitly.',
            summary: 'The feature owns the workflow, not the view.',
            title: 'Feature-Owned Forms',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: formValidatorFlowExample,
                    label: 'Typed validator flow',
                    language: 'ts',
                  },
                ],
                bullets: [
                  'Keep validators deterministic: same input values should always return the same error map.',
                  'Return only active errors. Missing keys should mean valid fields.',
                  'Use the validator for cross-field rules when one field depends on another.',
                ],
                id: 'validator-basics',
                paragraphs: [
                  'A validator in `FormStateHandler` is a pure function over the full value snapshot. That design is deliberate: it allows single-field updates and full-submit validation to run the same business rules and produce the same error shape.',
                  'In practice, this means `setFieldValue()` and `validateForm()` stay consistent. The UI can trust `errors`, `isValid`, and touched state without adding hidden ad-hoc checks in components.',
                ],
                title: 'Model validation as one typed function',
              },
              {
                codeExamples: [
                  {
                    code: formValidatorServerErrorsExample,
                    label: 'Merge API validation errors',
                    language: 'ts',
                  },
                ],
                bullets: [
                  'Use `validateForm()` for client-side rules before submit.',
                  'Use `setFieldError()` for backend field errors after submit.',
                  'Call `touchAllFields()` on invalid submit so errors become visible immediately.',
                ],
                id: 'validator-submit-cycle',
                paragraphs: [
                  'Client and server validation should not compete. The clean split is: local validator for synchronous checks, server responses mapped with `setFieldError()` for authoritative backend constraints.',
                  'This keeps the submit cycle explicit and debuggable: validate, touch, submit, map remote errors, and retry with corrected values.',
                ],
                title: 'Compose client and server validation',
              },
              {
                codeExamples: [
                  {
                    code: formValidatorZodExample,
                    label: 'Schema adapter with Zod',
                    language: 'ts',
                  },
                ],
                bullets: [
                  'Use `toZodValidator(schema)` from `@veams/form/validators/zod` for the common integration path.',
                  'Keep schema declarations and form adapters close to each other in the feature boundary.',
                ],
                id: 'validator-zod-adapter',
                paragraphs: [
                  'When your project already has a schema layer, connect it to forms through one narrow adapter that returns the standard form error map.',
                  'That keeps validation behavior consistent across forms while still giving each feature room to customize how schema issues are translated into field-level messages.',
                ],
                title: 'Integrate schema validation without coupling',
              },
              {
                codeExamples: [
                  {
                    code: formValidatorTinyAdapterReference,
                    label: 'Tiny adapter reference',
                    language: 'ts',
                  },
                ],
                id: 'validator-zod-adapter-reference',
                paragraphs: [
                  'Need custom issue mapping or schema wrappers? Use this tiny adapter reference as a starting point.',
                  'The package currently ships a Zod adapter because it is the most requested schema integration in current usage. Adapters for other schema libraries are welcome through PRs as long as the integration keeps the package dependency-free.',
                ],
                title: 'Adapter Reference',
              },
            ],
            eyebrow: 'Guides',
            id: 'validators',
            intro: 'Use one typed validator as the source of truth for field and submit checks, then layer server errors through explicit field updates.',
            summary: 'Predictable validation, from keypress to submit.',
            title: 'Validators',
          },
          {
            blocks: [
              {
                bullets: [
                  'Keep native inputs uncontrolled by default through `useUncontrolledField()`.',
                  'This reduces render churn because typing does not require controlled `value` props on every keypress.',
                  'Browser-native behavior like autofill and text selection stays predictable.',
                  'Use `Controller` only for components that explicitly require controlled props.',
                ],
                id: 'uncontrolled-principle',
                paragraphs: [
                  'The default form path is intentionally uncontrolled for native fields. The form handler still owns values, errors, touched state, and submit state, while React primarily binds DOM events and metadata to that handler.',
                  'This keeps field components small and avoids turning every native input into a controlled component without a concrete need.',
                ],
                title: 'Prefer uncontrolled fields by default',
              },
              {
                codeExamples: [
                  {
                    code: formControllerExample,
                    label: 'Controller bridge',
                    language: 'tsx',
                  },
                ],
                bullets: [
                  'Use `Controller` for third-party selects, date pickers, or custom widgets that expect `value` and `onChange`.',
                  'The render prop gives you `field` and `fieldState`, mirroring the native-field hooks.',
                  'Keep native inputs on `useUncontrolledField()` unless a component truly requires controlled props.',
                ],
                id: 'controller',
                paragraphs: [
                  'The package supports both native uncontrolled inputs and controlled third-party components, but the two paths stay explicit so each integration makes its tradeoff visible.',
                ],
                title: 'Bridge controlled components on purpose',
              },
            ],
            eyebrow: 'Guides',
            id: 'controlled-fields',
            intro: 'Controlled components should be the explicit exception for widgets that need them, not the default for every field.',
            summary: 'Stay uncontrolled by default. Control when required.',
            title: 'Controlled Fields',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: formNestedStateExample,
                    label: 'Nested state with dot-paths',
                    language: 'ts',
                  },
                  {
                    code: formNestedReactExample,
                    label: 'Nested fields in React',
                    language: 'tsx',
                  },
                ],
                bullets: [
                  'Use dot-path field names such as `profile.email` and `settings.newsletter`.',
                  'Return dot-path keys from validators so field metadata resolves correctly.',
                  'Nested support is designed for object trees; treat array index paths as out of scope unless you provide your own mapping layer.',
                ],
                id: 'nested-fields',
                paragraphs: [
                  'Nested forms work by addressing fields through dot-path names. This keeps the API flat at the call site while values stay nested in state.',
                  'The same path convention is used by `setFieldValue()`, field registration hooks, touched state, and error maps, so nested fields behave consistently across state and view.',
                ],
                title: 'Nested object fields with dot-paths',
              },
            ],
            eyebrow: 'Guides',
            id: 'advanced-nested-fields',
            intro: 'Use dot-path field names to model nested object forms without flattening your state shape.',
            summary: 'Nested values, same API surface.',
            title: 'Advanced Nested Fields',
          },
        ],
        title: 'Guides',
      },
      {
        id: 'api',
        pages: [
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: formApiImports,
                    label: 'Public entry points',
                    language: 'ts',
                  },
                ],
                id: 'entry-points',
                paragraphs: [
                  'The public surface is intentionally small. One root entrypoint for generic state and one React subpath for view bindings.',
                ],
                title: 'Entry points',
              },
              {
                bullets: [
                  '`FormStateHandler<T>` owns `values`, `errors`, `touched`, `isSubmitting`, and `isValid`.',
                  'Nested fields are addressed with dot-path names such as `profile.email`.',
                  '`validateForm()`, `touchAllFields()`, `resetForm()`, and the field setters are the main imperative API.',
                  '`ValidatorFn<T>` returns a partial error map keyed by form field name.',
                  '`@veams/form/validators/zod` exposes `toZodValidator(schema)` as an optional adapter without adding a package peer dependency.',
                ],
                id: 'core-api',
                paragraphs: [
                  'The root API is the generic form model. It is suitable both for direct imperative usage and as a dependency owned by a broader Status Quo feature handler.',
                ],
                title: 'Generic form state API',
              },
              {
                bullets: [
                  '`FormProvider` creates one local controller unless you pass `formHandlerInstance`.',
                  'When `formHandlerInstance` is provided, keep `initialValues` and `validator` on that handler instead of the provider.',
                  '`useUncontrolledField()` registers native inputs, selects, radios, checkboxes, and textareas.',
                  '`useFieldMeta()` exposes per-field error and touched state.',
                  '`Controller` bridges controlled component libraries through a render prop.',
                ],
                id: 'react-api',
                paragraphs: [
                  'The React API is only about binding the existing controller shape into components. The goal is to keep form behavior in the handler while the view stays thin.',
                ],
                title: 'React API',
              },
            ],
            eyebrow: 'API',
            id: 'api',
            intro: 'The package API is split by responsibility: generic form state at the root, React bindings under the subpath.',
            summary: 'Everything public, without hidden layers.',
            title: 'API',
          },
        ],
        title: 'API',
      },
      {
        id: 'examples',
        pages: [
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: formSimpleWorkingExample,
                    label: 'Working simple form',
                    language: 'tsx',
                  },
                ],
                bullets: [
                  'Provider owns local form lifecycle.',
                  'Validator stays close to the form values.',
                  'Native fields register through `useUncontrolledField()`.',
                ],
                id: 'simple-form',
                paragraphs: [
                  'Start with a complete working form. Keep state local, wire fields directly, and validate synchronously before submit.',
                ],
                title: 'Simple form',
              },
            ],
            eyebrow: 'Examples',
            id: 'example-simple-form',
            intro: 'Start with a complete local form before introducing feature-level orchestration.',
            summary: 'Working local form with validator and native fields.',
            title: 'Simple form',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: formNestedFeatureWorkingExample,
                    label: 'Working nested feature form',
                    language: 'tsx',
                  },
                ],
                bullets: [
                  'Feature handler owns the form instance.',
                  'Nested values are addressed with dot-path fields.',
                  'Provider binds the existing handler without duplicate initial values.',
                ],
                id: 'nested-feature-form',
                paragraphs: [
                  'When a form is only one part of a feature, keep ownership in the feature handler and keep the React layer focused on registration and rendering.',
                ],
                title: 'Nested feature form',
              },
            ],
            eyebrow: 'Examples',
            id: 'example-nested-feature-form',
            intro: 'When form state is part of a larger feature, keep ownership in the feature handler.',
            summary: 'Nested values with dot-path fields in a feature-owned form.',
            title: 'Nested feature form',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: formFeatureValidationWorkingExample,
                    label: 'Working feature form with validation',
                    language: 'tsx',
                  },
                ],
                bullets: [
                  'Client rules live in the form validator.',
                  'Server errors map back through `setFieldError()`.',
                  'One feature action owns the submit lifecycle.',
                ],
                id: 'feature-form-validation',
                paragraphs: [
                  'This pattern keeps validation explicit from keystroke to backend response: local validator first, API field errors second, one consistent error map.',
                ],
                title: 'Feature form with validation',
              },
            ],
            eyebrow: 'Examples',
            id: 'example-feature-form-validation',
            intro: 'Combine local validator rules with backend error mapping in one feature-owned submit flow.',
            summary: 'Feature submit lifecycle with client and server validation.',
            title: 'Feature form with validation',
          },
        ],
        title: 'Examples',
      },
    ],
    title: 'Form',
  },
];

export const defaultPackage =
  docsPackages.find((entry) => entry.id === 'methodology') ?? docsPackages[0];
export const defaultPage = defaultPackage.sections[0].pages[0];
export const defaultPath = `/packages/${defaultPackage.id}/${defaultPage.id}`;

export function getFirstPage(packageDoc: DocsPackage): PackagePage {
  return packageDoc.sections[0].pages[0];
}

export function getPackagePages(packageDoc: DocsPackage): PackagePage[] {
  return packageDoc.sections.flatMap((section) => section.pages);
}

export function getPackageDocs(packageId: string | undefined): DocsPackage | undefined {
  return docsPackages.find((entry) => entry.id === packageId);
}

export function getPageDocs(
  packageDoc: DocsPackage,
  pageId: string | undefined
): PackagePage | undefined {
  return getPackagePages(packageDoc).find((entry) => entry.id === pageId);
}

export function getPackagePath(packageId: string, pageId: string): string {
  return `/packages/${packageId}/${pageId}`;
}
