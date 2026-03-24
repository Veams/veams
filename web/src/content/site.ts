import islandArchitectureImg from '../assets/island-architecture.jpg';

export type CodeExample = {
  code: string;
  description?: string;
  label: string;
  language: string;
};

export type FeatureCard = {
  description: string;
  link?: string;
  title: string;
  visual:
    | 'query-management'
    | 'form-feature-owner'
    | 'framework-core'
    | 'handle-command'
    | 'passive-snapshot'
    | 'swap-engine'
    | 'view-state'
    | 'methodology-regions'
    | 'methodology-components'
    | 'methodology-utilities'
    | 'methodology-layout'
    | 'status-quo-architecture'
    | 'query-architecture'
    | 'query-facade'
    | 'form-architecture'
    | 'form-ref-bridge'
    | 'vent-card-publish'
    | 'partial-hydration-architecture'
    | 'partial-hydration-triggers'
    | 'css-animations-architecture'
    | 'status-quo-leaf';
};

export type LiveExampleId =
  | 'status-quo-local-draft'
  | 'status-quo-singleton-workspace'
  | 'status-quo-composition-checklist'
  | 'status-quo-provider-wizard'
  | 'status-quo-selector-profile'
  | 'vent-release-bus'
  | 'css-animations-showcase';

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
  featureCards?: FeatureCard[];
  heroBullets?: string[];
  heroImage?: string;
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

const statusQuoInstallNative = `npm install @veams/status-quo`;

const statusQuoInstallObservable = `npm install @veams/status-quo rxjs`;

const statusQuoInstallSignal = `npm install @veams/status-quo @preact/signals-core`;

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

const _statusQuoNativeHandlerExample = `import { NativeStateHandler } from '@veams/status-quo';

type CounterState = { count: number };
type CounterActions = { increase: () => void };

// The native engine is zero-dependency and uses standard event listeners.
export class NativeCounterHandler extends NativeStateHandler<CounterState, CounterActions> {
  constructor() {
    super({
      initialState: { count: 0 },
    });
  }

  getActions(): CounterActions {
    return {
      increase: () => this.setState({ count: this.getState().count + 1 }, 'increase'),
    };
  }
}`;

const statusQuoNativeHandlerCompositionExample = `import {
  NativeStateHandler,
  makeStateSingleton,
} from '@veams/status-quo';

type Viewport = 'compact' | 'wide';
type UiState = { viewport: Viewport };
type UiActions = { setViewport: (viewport: Viewport) => void };

class UiStateHandler extends NativeStateHandler<UiState, UiActions> {
  constructor() {
    super({ initialState: { viewport: 'compact' } });
  }

  getActions(): UiActions {
    return {
      setViewport: (viewport) => this.setState({ viewport }, 'set-viewport'),
    };
  }
}

const uiStateSingleton = makeStateSingleton(() => new UiStateHandler());

type CounterState = { count: number; step: number };
type CounterActions = { increase: () => void };

class CounterHandler extends NativeStateHandler<CounterState, CounterActions> {
  constructor() {
    super({ initialState: { count: 0, step: 1 } });

    const uiStateHandler = uiStateSingleton.getInstance();

    // Use the native bindSubscribable to sync state manually.
    this.bindSubscribable(
      uiStateHandler,
      (selection) => {
        this.setState({ step: selection.step }, 'sync-step');
      },
      // Manually derive the step from the upstream UI state.
      (uiState) => ({
        step: uiState.viewport === 'compact' ? 1 : 5,
      }),
      // Avoid redundant updates if the derived step stays the same.
      (current, next) => current.step === next.step
    );
  }

  getActions(): CounterActions {
    return {
      increase: () => {
        const { count, step } = this.getState();
        this.setState({ count: count + step }, 'increase');
      },
    };
  }
}`;

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
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);
const applicationId = 'app-1';
const productId = 'product-1';

const fetchProduct = async (currentApplicationId: string, currentProductId: string) => ({
  applicationId: currentApplicationId,
  name: 'Ada',
  productId: currentProductId,
});

const saveProduct = async (variables: {
  applicationId: string;
  productId: string;
  productName: string;
}) => ({
  ...variables,
  saved: true as const,
});

const [createQuery, createMutation] = manager.createQueryAndMutation([
  'applicationId',
  'productId',
] as const);

const productQuery = createQuery(
  ['product', { deps: { applicationId, productId }, view: { page: 1 } }],
  () => fetchProduct(applicationId, productId),
  { enabled: false }
);

const updateProduct = createMutation(saveProduct, {
  invalidateOn: 'success',
});

await productQuery.refetch();
await updateProduct.mutate({
  applicationId,
  productId,
  productName: 'Ada',
});`;

const statusQuoQueryTrackedIntersectionExample = `import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);

const fetchProduct = async (applicationId: string, productId: string) => ({
  applicationId,
  name: 'Ada',
  productId,
});

const saveProduct = async (variables: {
  applicationId: string;
  productId: string;
  productName: string;
}) => variables;

const [createQuery, createMutation] = manager.createQueryAndMutation([
  'applicationId',
  'productId',
] as const);

createQuery(
  ['product', { deps: { applicationId: 'app-1', productId: 'product-1' }, view: { page: 1 } }],
  () => fetchProduct('app-1', 'product-1')
);

createQuery(
  ['product', { deps: { applicationId: 'app-1', productId: 'product-2' }, view: { page: 1 } }],
  () => fetchProduct('app-1', 'product-2')
);

const renameProduct = createMutation(saveProduct);

await renameProduct.mutate({
  applicationId: 'app-1',
  productId: 'product-1',
  productName: 'Ada',
});

// Default matchMode is 'intersection', so only the
// app-1 / product-1 query is invalidated.`;

const statusQuoQueryTrackedUnionExample = `import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);

const fetchProduct = async (applicationId: string, productId: string) => ({
  applicationId,
  name: 'Ada',
  productId,
});

const syncProductData = async (variables: {
  applicationId: string;
  productId: string;
}) => variables;

const [createQuery, createMutation] = manager.createQueryAndMutation([
  'applicationId',
  'productId',
] as const);

createQuery(
  ['product', { deps: { applicationId: 'app-1', productId: 'product-1' }, view: { page: 1 } }],
  () => fetchProduct('app-1', 'product-1')
);

createQuery(
  ['product', { deps: { applicationId: 'app-2', productId: 'product-1' }, view: { page: 1 } }],
  () => fetchProduct('app-2', 'product-1')
);

const syncProduct = createMutation(syncProductData, {
  matchMode: 'union',
});

await syncProduct.mutate({
  applicationId: 'app-1',
  productId: 'product-1',
});

// 'union' invalidates queries that match either dependency:
// applicationId === 'app-1' or productId === 'product-1'.`;

const statusQuoQueryTrackedLifecycleExample = `import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);

const fetchProducts = async (applicationId: string) => [{ applicationId, productId: 'product-1' }];

const removeProducts = async (variables: { applicationId: string }) => variables;

const [createQuery, createMutation] = manager.createQueryAndMutation([
  'applicationId',
] as const);

createQuery(
  ['product-list', { deps: { applicationId: 'app-1' }, view: { page: 1 } }],
  () => fetchProducts('app-1')
);

const cleanupProducts = createMutation(removeProducts, {
  invalidateOn: 'settled',
});

await cleanupProducts.mutate({
  applicationId: 'app-1',
});

// 'settled' invalidates after success or error.`;

const statusQuoQueryTrackedCustomResolverExample = `import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);

const saveProduct = async (variables: {
  payload: { applicationId: string };
  product: { id: string };
  productName: string;
}) => variables;

const trackedMutation = manager.createMutation(saveProduct, {
  resolveDependencies: (variables: {
    payload: { applicationId: string };
    product: { id: string };
  }) => ({
    applicationId: variables.payload.applicationId,
    productId: variables.product.id,
  }),
});

await trackedMutation.mutate({
  payload: { applicationId: 'app-1' },
  product: { id: 'product-1' },
  productName: 'Ada',
});`;

const statusQuoQueryTrackedPairExample = `import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);
const applicationId = 'app-1';
const productId = 'product-1';

const fetchProduct = async (currentApplicationId: string, currentProductId: string) => ({
  applicationId: currentApplicationId,
  name: 'Ada',
  productId: currentProductId,
});

const saveProduct = async (variables: {
  applicationId: string;
  productId: string;
  productName: string;
}) => variables;

const [createQuery, createMutation] =
  manager.createQueryAndMutation(['applicationId', 'productId'] as const);

const productQuery = createQuery(
  ['product', { deps: { applicationId, productId }, view: { page: 1 } }],
  () => fetchProduct(applicationId, productId)
);

const saveProductMutation = createMutation(saveProduct);

await saveProductMutation.mutate({
  applicationId,
  productId,
  productName: 'Ada',
});`;

const statusQuoQueryInvalidateExample = `await userQuery.invalidate({ refetchType: 'none' });
await manager.invalidateQueries({ queryKey: ['user'] });

manager.setQueryData(['user', 42], (current) =>
  current ? { ...current, name: 'Ada' } : current
);`;

const statusQuoQuerySpecificExample = `// A handle (Query or Mutation) knows its own key and context.
const userQuery = manager.createUntrackedQuery(['user', 42], fetchUser);

// Specific action: no keys required.
await userQuery.refetch();
await userQuery.invalidate();`;

const statusQuoQueryGlobalExample = `// The Manager acts on the entire cache using filters.
await manager.invalidateQueries({ 
  queryKey: ['user'], 
  exact: false 
});

// Orchestrate state across different keys.
manager.setQueryData(['user', 42], (user) => ({ ...user, name: 'Grace' }));`;

const statusQuoQueryEscapeHatchExample = `const rawResult = userQuery.unsafe_getResult();
const rawClient = manager.unsafe_getClient();

rawClient.cancelQueries({ queryKey: ['user', 42] });`;

const statusQuoQueryFrameworkImports = `import { QueryClient } from '@tanstack/query-core';
import { setupQueryManager } from '@veams/status-quo-query';

const queryClient = new QueryClient();
const manager = setupQueryManager(queryClient);`;

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
  useProvidedStateActions,
  useProvidedStateHandler,
  useProvidedStateSubscription,
  useStateActions,
  useStateFactory,
  useStateHandler,
  useStateSingleton,
  useStateSubscription,
} from '@veams/status-quo/react';`;

const statusQuoQueryApiImports = `import {
  setupQueryManager,
  setupMutation,
  setupQuery,
  isQueryLoading,
  toQueryMetaState,
} from '@veams/status-quo-query';`;

const ventInstall = `npm install @veams/vent`;

const ventQuickStart = `import createVent from '@veams/vent';

type Events = 'release:queued' | 'release:clear';

type ReleaseMessage = {
  channel: 'docs' | 'ops' | 'ui';
  text: string;
};

const vent = createVent<Events, ReleaseMessage>();

vent.subscribe('release:queued', (payload) => {
  console.log('queued for', payload.channel, payload.text);
});

vent.publish('release:queued', {
  channel: 'docs',
  text: 'Ship the package page before form.',
});`;

const ventReactImports = `import createVent from '@veams/vent';
import {
  VentProvider,
  useVent,
  useVentSubscribe,
} from '@veams/vent/react';`;

const ventReactQuickStart = `import createVent from '@veams/vent';
import { VentProvider, useVent, useVentSubscribe } from '@veams/vent/react';

type Events = 'release:queued' | 'release:clear';
type ReleaseMessage = {
  channel: 'docs' | 'ops' | 'ui';
  text: string;
};

const vent = createVent<Events, ReleaseMessage>();

function Composer() {
  const eventBus = useVent<Events, ReleaseMessage>();

  return (
    <button
      onClick={() =>
        eventBus.publish('release:queued', {
          channel: 'docs',
          text: 'Ship the package page before form.',
        })
      }
      type="button"
    >
      Publish
    </button>
  );
}

function Feed() {
  useVentSubscribe<Events, ReleaseMessage>('release:queued', (payload) => {
    console.log(payload.text);
  });

  return null;
}

function App() {
  return (
    <VentProvider instance={vent}>
      <Composer />
      <Feed />
    </VentProvider>
  );
}`;

const ventPluginSetup = `import Veams from '@veams/core';
import VentPlugin from '@veams/vent/plugin';

Veams.onInitialize(() => {
  Veams.use(VentPlugin, {
    furtherEvents: {
      'release:queued': 'release:queued',
      'release:clear': 'release:clear',
    },
  });
});`;

const ventExampleSetup = `import createVent from '@veams/vent';
import { VentProvider } from '@veams/vent/react';

type EventTopic = 'release:queued' | 'release:clear';
type ReleaseMessage = {
  channel: 'docs' | 'ops' | 'ui';
  text: string;
};

const vent = createVent<EventTopic, ReleaseMessage>();

function App() {
  return <VentProvider instance={vent}>{/* children */}</VentProvider>;
}`;

const ventExampleSubscribers = `import { useVent, useVentSubscribe } from '@veams/vent/react';

function Composer() {
  const vent = useVent<'release:queued' | 'release:clear', ReleaseMessage>();

  return (
    <button
      onClick={() =>
        vent.publish('release:queued', {
          channel: 'ops',
          text: 'Queue the rollout.',
        })
      }
      type="button"
    >
      Publish event
    </button>
  );
}

function Metrics() {
  useVentSubscribe<'release:queued' | 'release:clear', ReleaseMessage>(
    'release:queued',
    (payload) => {
      console.log('metrics update', payload.channel);
    }
  );

  return null;
}`;

const ventOverviewCards: FeatureCard[] = [
  {
    description:
      'One card can publish a typed event, another card can react to it independently. Vent keeps that collaboration explicit without turning the event flow into shared state ownership.',
    title: 'Publish here, react there',
    visual: 'vent-card-publish',
  },
];

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
      'Exact-key behavior belongs on a handle. Broad management work belongs on the query manager. The API should make that scope visible.',
    title: 'Keep command scope honest',
    visual: 'handle-command',
  },
  {
    description:
      'Cross-query coordination should be explicit and centralized, so invalidation, refetching, and state updates stay readable.',
    title: 'Coordinate through the manager',
    visual: 'query-management',
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

const partialHydrationInstall = `npm install @veams/partial-hydration`;

const partialHydrationQuickStart = `import { createHydration } from '@veams/partial-hydration';
import { hydrateRoot } from 'react-dom/client';

// A simple React component
function Navigation({ title }: { title: string }) {
  return <nav><h1>{title}</h1></nav>;
}

Navigation.displayName = 'Navigation';

const hydration = createHydration({
  components: {
    // Key must match the wrapper's data-component value.
    // When using withHydration(), that value comes from Component.displayName.
    Navigation: {
      Component: Navigation,
      on: 'init',
      render: (Component, props, el) => {
        hydrateRoot(el, <Component {...props} />);
      }
    },
    // Lazy: Load non-critical UI only when it enters the viewport
    HeavyChart: {
      Component: () => import('./HeavyChart'),
      on: 'in-viewport',
      render: async (Loader, props, el) => {
        const mod = await Loader();
        const Component = mod.default;

        hydrateRoot(el, <Component {...props} />);
      }
    }
  }
});

// Start scanning the DOM for these components
hydration.init(document);`;

const partialHydrationDomExample = `<!-- The encoded props are placed immediately before the component wrapper -->
<script type="application/hydration-data" data-internal-ref="Navigation-1234abcd">
  {"items":["Home","About"]}
</script>

<!-- data-component is the primary lookup attribute on the client -->
<div 
  data-component="Navigation" 
  data-internal-id="Navigation-1234abcd" 
  class="site-nav"
>
  <!-- Pre-rendered SSR HTML goes here -->
  <nav><h1>Welcome</h1></nav>
</div>`;

const partialHydrationLazyExample = `const hydration = createHydration({
  components: {
    // Must match the wrapper's data-component value.
    HeavyChart: {
      // Return a dynamic import instead of the component itself
      Component: () => import('./HeavyChart'),
      on: 'in-viewport',
      render: async (Loader, props, el) => {
        // Await the loader to get the module when the trigger fires
        const mod = await Loader();
        const Component = mod.default;

        // Hydrate the server-rendered markup
        hydrateRoot(el, <Component {...props} />);
      }
    }
  }
});`;

const _partialHydrationHocExample = `import { withHydration } from '@veams/partial-hydration/react';

MyComponent.displayName = 'MyComponent';

// Wrap your component to enable partial hydration metadata.
// The wrapper gets data-component="MyComponent" during SSR.
export const MyHydratedComponent = withHydration(MyComponent);
`;

const partialHydrationHocConfigExample = `import { withHydration } from '@veams/partial-hydration/react';

const MyComponent = ({ title }: { title: string }) => <h1>{title}</h1>;

MyComponent.displayName = 'MyComponent';

// Add custom classes and attributes to the wrapper div
export const MyHydratedComponent = withHydration(MyComponent, {
  modifiers: 'my-custom-wrapper-class',
  attributes: {
    'data-testid': 'hydrated-wrapper',
    'aria-live': 'polite'
  }
});
`;

const partialHydrationProviderExample = `import { HydrationProvider } from '@veams/partial-hydration/react';

function CustomHydrationWrapper({
  children,
  cmpId,
  componentName,
}: {
  children: React.ReactNode;
  cmpId: string;
  componentName: string;
}) {
  return (
    <div data-component={componentName} data-internal-id={cmpId}>
      {/* Provide the ID to the React tree */}
      <HydrationProvider componentId={cmpId}>
        {children}
      </HydrationProvider>
    </div>
  );
}`;

const partialHydrationCompleteExample = `// 1. Server-Side (or Static Site Generation)
import { withHydration } from '@veams/partial-hydration/react';
import { Navigation } from './Navigation';
import { HeavyChart } from './HeavyChart';

// Wrap components to inject hydration metadata into HTML
Navigation.displayName = 'Navigation';
const HydratedNav = withHydration(Navigation);

HeavyChart.displayName = 'HeavyChart';
const HydratedChart = withHydration(HeavyChart);

export function Page() {
  return (
    <main>
      <HydratedNav items={['Home', 'About']} />
      <article>Static content here...</article>
      <HydratedChart data={[1, 2, 3]} />
    </main>
  );
}

// 2. Client-Side (Entry Point)
import { createHydration } from '@veams/partial-hydration';
import { hydrateRoot } from 'react-dom/client';
import { Navigation } from './Navigation'; // Imported immediately

const hydration = createHydration({
  components: {
    // Keys must match the server-rendered data-component values.
    Navigation: {
      Component: Navigation,
      on: 'init',
      render: (Component, props, el) => {
        hydrateRoot(el, <Component {...props} />);
      }
    },
    // Lazy: Load heavy UI only when scrolled into view
    HeavyChart: {
      Component: () => import('./HeavyChart'),
      on: 'in-viewport',
      config: { rootMargin: '200px' },
      render: async (Loader, props, el) => {
        const mod = await Loader();
        const Component = mod.default ?? mod.HeavyChart;

        hydrateRoot(el, <Component {...props} />);
      }
    }
  }
});

// Start the hydration engine
hydration.init(document);`;

const _partialHydrationIsomorphicIdExample = `import { useIsomorphicId } from '@veams/partial-hydration/react';

function MyField() {
  // Generates an ID that is stable across server and client.
  const id = useIsomorphicId();
  
  return (
    <>
      <label htmlFor={id}>Email</label>
      <input id={id} type="email" />
    </>
  );
}`;

const partialHydrationApiExample = `import { createHydration } from '@veams/partial-hydration';
import {
  withHydration,
  useIsomorphicId
} from '@veams/partial-hydration/react';`;

const partialHydrationCreateOptionsExample = `const hydration = createHydration({
  components: {
    // Key must match the wrapper's data-component attribute in the DOM.
    // withHydration() writes data-component from Component.displayName.
    'SearchFilter': {
      // The actual component instance or a dynamic import factory.
      Component: () => import('./SearchFilter'),
      
      // Activation strategy: 'init', 'dom-ready', 'fonts-ready', 'in-viewport'.
      on: 'in-viewport',
      
      // Optional: configuration for the 'in-viewport' IntersectionObserver.
      config: {
        rootMargin: '200px'
      },
      
      // Render function: called with Component, parsed Props, and the DOM Element. Can be async.
      render: async (Loader, props, el, id) => {
        const mod = await Loader();
        const Component = mod.default;
        const root = createRoot(el);
        root.render(<Component {...props} />);
      }
    }
  }
});`;

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
  useFormMeta,
  useUncontrolledField,
} from '@veams/form/react';`;

const _cssAnimationsInstall = `npm install @veams/css-animations`;

const cssAnimationsScssUsage = `// Import the full bundle (variables, mixins, and all animations)
@import "@veams/css-animations";

// OR import specific pieces for a smaller footprint
@import "@veams/css-animations/variables";
@import "@veams/css-animations/mixins";
@import "@veams/css-animations/animations/feedback-effects/fb-border-simple";

.my-element {
  // Use the setup mixin for feedback animations (creates pseudo-element)
  @include fb-setup;
  
  // Apply the animation mixin
  @include fb-border-simple;
}`;

const cssAnimationsCssUsage = `/* Import the full compiled bundle */
@import "@veams/css-animations/index.css";

/* OR import specific compiled animations */
@import "@veams/css-animations/animations/feedback-effects/fb-border-simple.css";`;

const cssAnimationsTsUsage = `import { ANIMATIONS } from '@veams/css-animations';

// Use constants for type-safe class names or animation names
function MyComponent({ isError }) {
  return (
    <div className={isError ? ANIMATIONS.FEEDBACK.BORDER_SIMPLE : ''}>
      Content
    </div>
  );
}`;

const cssAnimationsVarsUsage = `:root {
  /* Override default animation settings globally */
  --veams-transition-duration: 400ms;
  --veams-transition-ease-method: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Customize specific effect colors */
  --veams-animation-bg-color: rgba(209, 45, 105, 0.2);
  --veams-animation-border: 3px solid #d12d69;
}`;

export const docsPackages: DocsPackage[] = [
  {
    accent: 'teal',
    description: 'Structure, state, and hydration for modern frontends.',
    id: 'ecosystem',
    sections: [
      {
        id: 'overview',
        pages: [
          {
            blocks: [],
            eyebrow: 'Welcome',
            featureCards: [
              {
                description:
                  'A structural CSS and HTML methodology to keep large codebases scalable and predictable.',
                link: '/packages/methodology/overview',
                title: 'Methodology',
                visual: 'methodology-layout',
              },
              {
                description:
                  'Framework-agnostic state handlers with React hooks and explicit lifecycle management.',
                link: '/packages/status-quo/overview',
                title: 'Status Quo',
                visual: 'framework-core',
              },
              {
                description:
                  'Stable query and mutation handles over TanStack Query, plus a centralized query manager.',
                link: '/packages/status-quo-query/overview',
                title: 'Status Quo Query',
                visual: 'query-facade',
              },
              {
                description:
                  'A typed publish/subscribe bus with optional React bindings for provider-scoped subscriptions.',
                link: '/packages/vent/overview',
                title: 'Vent',
                visual: 'vent-card-publish',
              },
              {
                description:
                  'Generic form state engine with optional React bindings for high-performance uncontrolled inputs.',
                link: '/packages/form/overview',
                title: 'Form',
                visual: 'form-architecture',
              },
              {
                description:
                  'A collection of high-performance CSS animations for modern web applications.',
                link: '/packages/css-animations/overview',
                title: 'CSS Animations',
                visual: 'css-animations-architecture',
              },
              {
                description:
                  'Activate interactive components in a static HTML environment using the Islands Architecture.',
                link: '/packages/partial-hydration/overview',
                title: 'Partial Hydration',
                visual: 'partial-hydration-architecture',
              },
            ],
            heroParagraphs: [
              'VEAMS provides a suite of modular, framework-agnostic packages designed to keep your frontend architecture **clean**, **scalable**, and **highly performant** without too much magic! From structural methodologies to advanced state management and partial hydration, each tool is built to solve complex problems without coupling your business logic to a specific UI framework.',
            ],
            id: 'landing',
            intro: '',
            summary: 'The Architectural Blueprint for Modern Frontends.',
            title: 'Ecosystem Overview',
          },
        ],
        title: 'Overview',
      },
    ],
    title: 'Ecosystem',
  },
  {
    accent: 'graphite',
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
                    description:
                      'Structural sections like Header, Sidebar, and Main that shape the page skeleton. Never reused.',
                    title: 'Regions',
                    visual: 'methodology-regions',
                  },
                  {
                    description:
                      'Reusable UI elements like Cards, Buttons, and Navs that live inside regions.',
                    title: 'Components',
                    visual: 'methodology-components',
                  },
                  {
                    description:
                      'Low-level helpers like Grid systems or spacing that provide structure without content.',
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
            intro: 'Start with the mental model first: name by responsibility, not by convenience.',
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
                    description:
                      'Regions are high-level structural areas (Header, Sidebar, Main, Footer) that compose the page skeleton.',
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
                paragraphs: ['Naming: Prefix component classes with `c-`.'],
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
            intro:
              'When a component needs to look different, let the component own the difference.',
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
                paragraphs: ['These principles help maintain a clean and scalable CSS codebase.'],
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
                paragraphs: ['Keep media queries nested inside the selector they affect.'],
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
            intro:
              'Start with the mental model first: handlers own state and lifecycle, hooks only translate snapshots into the UI layer.',
            summary: 'State management that stays out of your way.',
            title: 'Overview',
          },
          {
            blocks: [
              {
                featureCards: [
                  {
                    description:
                      'State transitions are owned by the handler, while the view layer only subscribes to read-only snapshots.',
                    title: 'Handler-Driven Flow',
                    visual: 'status-quo-architecture',
                  },
                ],
                id: 'core-flow',
                paragraphs: [
                  'Status Quo separates the state model from the UI layer. This separation is achieved through a clear boundary: handlers own transitions and lifecycle, while components subscribe to snapshots and trigger actions.',
                ],
                title: 'Core Architecture',
              },
              {
                bullets: [
                  'Immutability: Each state change creates a new snapshot.',
                  'Explicit Transitions: All state changes go through the handler.',
                  'Unidirectional Data Flow: Views read state and call actions.',
                ],
                id: 'core-contract',
                paragraphs: [
                  'The core contract ensures that your application state remains predictable and testable, regardless of its size or complexity.',
                ],
                title: 'The Core Contract',
              },
              {
                featureCards: statusQuoPhilosophyCards,
                id: 'why-it-scales',
                paragraphs: [
                  'Status Quo is designed for long-term growth by providing **a replaceable engine**, **a stable component contract**, and **state logic that stays outside the view layer**.',
                ],
                title: 'Why it scales',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'concepts',
            intro:
              'Understand the architectural boundary between handlers, engines, and the view layer.',
            summary: 'The mental model behind the package.',
            title: 'Concepts',
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
            intro:
              'Use the root package as the framework-agnostic state layer, then add React bindings only where the UI needs them.',
            summary: 'Framework-neutral core, optional React layer.',
            title: 'Framework Support',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoInstallNative,
                    label: 'Native (Zero-dependency)',
                    language: 'bash',
                  },
                  {
                    code: statusQuoInstallObservable,
                    label: 'Observable (RxJS)',
                    language: 'bash',
                  },
                  {
                    code: statusQuoInstallSignal,
                    label: 'Signal (Preact Signals)',
                    language: 'bash',
                  },
                ],
                id: 'install',
                paragraphs: [
                  'Install the package based on your preferred reactive engine. The native handler is completely zero-dependency, while the observable and signal versions require their respective peer dependencies.',
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
            intro:
              'Install the zero-dependency package and start with the native handler, then opt into other reactive backends only when you need them.',
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
            intro:
              'The fastest path is a local handler plus `useStateFactory`, then expand into lower-level hooks only when you need more control.',
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
                    code: statusQuoNativeHandlerCompositionExample,
                    description:
                      'The native engine relies on `bindSubscribable()` to manually derive state. You provide a selector function to map upstream state and a comparison function to prevent redundant updates. This is the zero-dependency default.',
                    label: 'Native (Manual Sync)',
                    language: 'ts',
                  },
                  {
                    code: statusQuoObservableHandlerExample,
                    description:
                      'The observable engine uses RxJS operators like `pipe()` and `map()` to transform state into a stream. This is ideal when your transitions already feel like a reactive event flow.',
                    label: 'Observable (Streams)',
                    language: 'ts',
                  },
                  {
                    code: statusQuoSignalHandlerExample,
                    description:
                      'The signal engine uses `computed()` to automatically track dependencies. When the upstream signal changes, the derivation updates itself, making deep reactive trees easy to manage.',
                    label: 'Signal (Auto-Tracking)',
                    language: 'ts',
                  },
                ],
                bullets: [
                  'Use `NativeStateHandler` as your zero-dependency default for standard state.',
                  'Use `ObservableStateHandler` when the interesting work already feels like a stream.',
                  'Use `SignalStateHandler` when you want direct reads and cheap synchronous derivation.',
                ],
                id: 'engine-choice',
                paragraphs: [
                  'The engine is a handler decision, not a view decision. The native version is the cleanest starting point because it has no peer-dependency requirements. The observable version excels at complex async coordination through RxJS, while the signal version provides ultra-light reactive derivation via Preact Signals. All three options share the same `bindSubscribable()` contract, ensuring that the surrounding composition and React wiring remain identical regardless of the underlying engine.',
                ],
                title: 'Pick the engine that matches the state',
              },
              {
                featureCards: [
                  {
                    description:
                      'When your handler needs to coordinate multiple async events, debouncing, or complex time-based transitions, RxJS streams provide the more powerful abstraction.',
                    title: 'Stream-heavy logic',
                    visual: 'swap-engine',
                  },
                  {
                    description:
                      'When your state tree has many interdependent derived values, signals allow for automatic tracking and fine-grained updates without manual sync logic.',
                    title: 'Deeply reactive derivations',
                    visual: 'view-state',
                  },
                ],
                id: 'when-to-scale',
                paragraphs: [
                  'Native handlers are excellent for most features, as `bindSubscribable()` already allows for manual state derivation and synchronization. You should consider scaling to other engines only when the manual logic becomes repetitive or the state transitions become inherently complex.',
                ],
                title: 'When to scale',
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
            intro:
              'Start with the zero-dependency native engine and scale to observables or signals when you need them.',
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
            intro:
              'Local is the default. Singleton is the move once the same handler really has more than one owner.',
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
            intro:
              'Use a provider scope when one local handler should be shared inside a subtree, while state readers and action-only components stay split.',
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
            intro:
              'There are two kinds of composition here: wiring hooks in React and wiring handlers to other subscribable sources.',
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
            intro:
              'Do not pipe the whole handler into every component just because it is easy. Subscribe to the part that really drives the UI.',
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
            intro:
              'Use Redux DevTools when you want to inspect handler transitions in the browser without changing the state model itself.',
            summary: 'Inspect transitions with Redux DevTools.',
            title: 'Devtools',
          },
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
                  '`BaseStateHandler` is the abstract root class for all handler implementations.',
                  'Public instance methods are `getInitialState()`, `getState()`, `getSnapshot()`, `setState(newState, actionName?)`, and `destroy()`.',
                  'Use it as the contract reference when building your own handler class on top of the Status Quo lifecycle and subscription model.',
                ],
                id: 'base-state-handler',
                paragraphs: [
                  'This class is the conceptual center of the package. Most application code will not instantiate it directly, but the rest of the public surface builds on its state, action, and subscription contract.',
                ],
                title: 'BaseStateHandler',
              },
              {
                bullets: [
                  '`makeStateSingleton(factory, options?)` promotes a handler factory into shared state.',
                  '`factory` creates the handler instance. `options?.destroyOnNoConsumers` controls whether the instance is destroyed when the last subscriber leaves.',
                  'Returns a `StateSingleton` definition that `useStateSingleton()` can subscribe to.',
                ],
                id: 'make-state-singleton',
                paragraphs: [
                  'Use this helper when state should outlive a single component mount and be shared across multiple consumers.',
                ],
                title: 'makeStateSingleton',
              },
              {
                bullets: [
                  '`NativeStateHandler` is constructed with `{ initialState, options? }`.',
                  '`initialState` seeds the handler value. `options?.devTools`, `options?.distinct`, and `options?.useDistinctUntilChanged` control runtime behavior.',
                  'Use it as the default concrete base when plain JavaScript state is enough and you do not need RxJS or Signals helpers.',
                ],
                id: 'native-state-handler',
                paragraphs: [
                  'This is the zero-dependency concrete handler base. It keeps the external API the same as the other engines while staying as small as possible.',
                ],
                title: 'NativeStateHandler',
              },
              {
                bullets: [
                  '`ObservableStateHandler` is constructed with `{ initialState, options? }`.',
                  'Alongside the shared handler API, it adds `getObservable(options?)` and `getObservableItem(key)` for RxJS-oriented integrations.',
                  'Use it when state composition naturally benefits from observables, operators, and stream-based transforms.',
                ],
                id: 'observable-state-handler',
                paragraphs: [
                  'This is the RxJS-backed concrete base. The app-facing handler contract stays stable while the underlying reactive engine becomes observable-driven.',
                ],
                title: 'ObservableStateHandler',
              },
              {
                bullets: [
                  '`setupStatusQuo(config?)` should be called once near app startup.',
                  '`config?.devTools` sets global Redux DevTools defaults. `config?.distinct` sets package-wide distinct-update defaults.',
                  'Local handler options still win when a specific instance needs different behavior.',
                ],
                codeExamples: [
                  {
                    code: statusQuoGlobalSetup,
                    description:
                      'Use `setupStatusQuo()` at your app entry point (e.g., in main.ts or index.ts) to set global defaults that apply to every handler instance, unless overridden locally.',
                    label: 'Global Configuration',
                    language: 'ts',
                  },
                ],
                id: 'setup-status-quo',
                paragraphs: [
                  'This is the package-wide runtime setup function. It keeps app-level defaults explicit instead of hiding them behind individual handler constructors.',
                ],
                title: 'setupStatusQuo',
              },
              {
                bullets: [
                  '`SignalStateHandler` is constructed with `{ initialState, options? }`.',
                  'Alongside the shared handler API, it adds `getSignal()` for direct signal consumption.',
                  'Use it when you want a lightweight reactive engine with signal-style reads and updates.',
                ],
                id: 'signal-state-handler',
                paragraphs: [
                  'This is the Signals-backed concrete base. It keeps the outer API aligned with the other handler implementations while exposing signal access for reactive integrations.',
                ],
                title: 'SignalStateHandler',
              },
              {
                bullets: [
                  '`StateProvider({ instance, children })` takes one existing handler instance and a subtree.',
                  '`instance` is the handler to share. `children` is the provider scope that should read from it.',
                  'Use it when the parent owns handler creation and descendants should consume that same instance without prop drilling.',
                ],
                id: 'state-provider',
                paragraphs: [
                  'This is the scoped-sharing surface in the React layer. It keeps creation ownership and consumption scope explicit.',
                ],
                title: 'StateProvider',
              },
              {
                bullets: [
                  '`StateSingleton`, `StateSingletonOptions`, and `StateSubscriptionHandler` are the main exported API types.',
                  '`StateSingletonOptions` describes singleton lifecycle behavior such as `destroyOnNoConsumers`.',
                  'Use these types when you are wrapping Status Quo in your own abstractions and want to stay on the public contract boundary.',
                ],
                id: 'types',
                paragraphs: [
                  'The type exports exist so application-level abstractions can depend on supported public interfaces rather than reaching into internal files.',
                ],
                title: 'Types',
              },
              {
                bullets: [
                  '`useProvidedStateActions()` takes no parameters.',
                  'Returns the action object from the nearest `StateProvider` without subscribing to state updates.',
                  'Use it for command-only UI such as buttons, toolbars, or menu actions.',
                ],
                id: 'use-provided-state-actions',
                paragraphs: [
                  'This is the action-only provider hook. It keeps action access separate from render subscriptions.',
                ],
                title: 'useProvidedStateActions',
              },
              {
                bullets: [
                  '`useProvidedStateHandler()` takes no parameters.',
                  'Returns the raw handler instance from the nearest `StateProvider`.',
                  'Use it when a child component needs low-level manual composition against the shared handler.',
                ],
                id: 'use-provided-state-handler',
                paragraphs: [
                  'This is the lowest-level provider hook in the React surface and the right tool when higher-level convenience hooks are too opinionated.',
                ],
                title: 'useProvidedStateHandler',
              },
              {
                bullets: [
                  '`useProvidedStateSubscription(selector?, isEqual?)` subscribes to the nearest `StateProvider`.',
                  '`selector?` narrows the subscribed slice. `isEqual?` customizes change detection for selected values.',
                  'Returns `[selectedState, actions]` and is the provider-scoped counterpart to `useStateSubscription()`.',
                ],
                id: 'use-provided-state-subscription',
                paragraphs: [
                  'Use this hook when provider scope already owns the instance and the component only needs to declare what slice should drive rerenders.',
                ],
                title: 'useProvidedStateSubscription',
              },
              {
                bullets: [
                  '`useStateActions(handler)` takes one handler instance or compatible subscribable handler surface.',
                  'Returns the action object without subscribing to state changes.',
                  'Use it when a component should trigger behavior but should not rerender from state updates.',
                ],
                id: 'use-state-actions',
                paragraphs: [
                  'This hook is the action-only counterpart to the state subscription hooks and keeps write access explicit.',
                ],
                title: 'useStateActions',
              },
              {
                bullets: [
                  '`useStateFactory(factory, selector?, isEqual?, params?)` combines creation and subscription.',
                  '`factory` creates the handler. `selector?` narrows the subscribed slice. `isEqual?` customizes equality. `params?` are forwarded to the factory.',
                  'Returns `[selectedState, actions]` and is the shortest path from handler factory to rendered state.',
                ],
                id: 'use-state-factory',
                paragraphs: [
                  'Use this hook when one component both owns the handler lifecycle and consumes its state directly.',
                ],
                title: 'useStateFactory',
              },
              {
                bullets: [
                  '`useStateHandler(factory, params?)` creates one handler instance per component mount.',
                  '`factory` builds the handler. `params?` is the optional tuple forwarded to that factory.',
                  'Returns the raw handler instance so you can compose state reads and action reads manually.',
                ],
                id: 'use-state-handler',
                paragraphs: [
                  'This is the lowest-level local React hook and the right starting point when you want full control over handler lifecycle and composition.',
                ],
                title: 'useStateHandler',
              },
              {
                bullets: [
                  '`useStateSingleton(singleton, selector?, isEqual?)` subscribes to a shared singleton definition.',
                  '`singleton` is the object returned by `makeStateSingleton()`. `selector?` narrows the subscribed slice. `isEqual?` customizes equality.',
                  'Returns `[selectedState, actions]` while keeping creation and lifecycle ownership on the singleton definition itself.',
                ],
                id: 'use-state-singleton',
                paragraphs: [
                  'Use this hook when shared state should outlive one component tree or be consumed by multiple unrelated branches.',
                ],
                title: 'useStateSingleton',
              },
              {
                bullets: [
                  '`useStateSubscription(source, selector?, isEqual?)` subscribes to a handler instance or singleton.',
                  '`source` is the handler or singleton to read from. `selector?` narrows the subscribed slice. `isEqual?` customizes equality.',
                  'Returns `[selectedState, actions]` and is the main React rendering surface for Status Quo state.',
                ],
                id: 'use-state-subscription',
                paragraphs: [
                  'Use this hook when the component should rerender from state and you want the selection boundary to stay explicit.',
                ],
                title: 'useStateSubscription',
              },
            ],
            eyebrow: 'Guides',
            id: 'api-reference',
            intro:
              'Start at the root for framework-agnostic pieces, then import the React integration from `@veams/status-quo/react` when you are wiring handlers into React.',
            summary: 'The full surface, minus the noise.',
            title: 'API Reference',
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
            intro:
              'Promote local state to shared state only when multiple consumers need one handler instance.',
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
            intro:
              'Share one locally owned handler across a subtree without promoting to singleton scope.',
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
    description:
      'Query and mutation handles over TanStack Query core, plus a query manager for client-level operations.',
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
                  'A query manager for broader coordination when the flow crosses query boundaries.',
                  'Tracked invalidation that removes most manual cache-key bookkeeping after mutations.',
                ],
                id: 'shape',
                paragraphs: [
                  'Status Quo Query exists to align TanStack Query with the Status Quo mental model. Instead of pushing raw observer objects through your app, it gives you query and mutation handles that are easier to bridge into state handlers and other explicit state flows.',
                ],
                title: 'Bring query state into the same flow',
              },
              {
                bullets: [
                  'Declare domain dependencies once in `deps`.',
                  'Keep pagination, sorting, and filters readable in `view`.',
                  'Let tracked mutations invalidate matching queries automatically.',
                ],
                id: 'tracked-invalidation-benefits',
                paragraphs: [
                  'The newest addition is tracked invalidation. Instead of teaching every mutation which query keys it must remember to invalidate, the facade keeps a dependency registry behind the manager. Queries register themselves under named dependencies, and mutations invalidate by those same names.',
                  'For developers this reduces repeated cache-key logic, makes invalidation intent explicit in the key shape, and lowers the chance that one dependent query is forgotten during a write flow.',
                ],
                title: 'Tracked invalidation reduces cache bookkeeping',
              },
              {
                featureCards: statusQuoQueryPhilosophyCards,
                id: 'principles',
                paragraphs: [
                  'The wrapper stays useful when each layer keeps a narrow job: **snapshots are passive**, **commands are explicit**, and **broad management work has one clear home**.',
                ],
                title: 'Principles in practice',
              },
            ],
            eyebrow: 'Getting Started',
            heroBullets: [
              'Query and mutation handles that fit the Status Quo model.',
              'Passive snapshots that sync cleanly into state handlers.',
              'Explicit management when the flow goes broader.',
              'Tracked invalidation that maps domain dependencies instead of manual cache keys.',
            ],
            heroParagraphs: [
              'Status Quo Query connects TanStack Query to the Status Quo way of working. Queries and mutations expose passive snapshots and explicit commands, and tracked invalidation lets the facade coordinate cache refreshes by named domain dependencies instead of repetitive manual key invalidation.',
            ],
            id: 'overview',
            intro:
              'Start by understanding how query handles, mutation handles, and query management line up with the Status Quo handler model.',
            summary: 'TanStack Query, aligned with Status Quo.',
            title: 'Overview',
          },
          {
            blocks: [
              {
                featureCards: [
                  {
                    description:
                      'The service layer (Query/Mutation) syncs state into the handler. The handler can trigger service commands like `refetch()`, and the view observes the resulting snapshot.',
                    title: 'Service-Enhanced Flow',
                    visual: 'query-architecture',
                  },
                ],
                id: 'command-boundary',
                paragraphs: [
                  'Status Quo Query extends the core architecture by adding a dedicated service layer. This layer handles the complexities of data fetching and cache management while keeping the handler as the single source of truth for the UI.',
                ],
                title: 'Service & Handler Integration',
              },
              {
                featureCards: [
                  {
                    description:
                      'The Query Manager acts as a single command center for all queries and mutations, making coordination readable and predictable.',
                    title: 'Centralized Management',
                    visual: 'query-facade',
                  },
                ],
                id: 'query-management',
                paragraphs: [
                  'Cross-query coordination should not be scattered across multiple hooks. The Query Manager provides a centralized API for invalidation, manual state updates, and global query management.',
                ],
                title: 'The Query Manager',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'concepts',
            intro:
              'Status Quo Query treats TanStack Query as an engine and provides a structured service layer focused on explicit commands and passive snapshots.',
            summary: 'Structure the service layer, simplify the view.',
            title: 'Concepts',
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
                  'No component bindings in this package; it exposes subscribable handles and manager commands.',
                  'React can be used around it, but the query/mutation API stays framework-neutral.',
                ],
                id: 'framework-support',
                paragraphs: [
                  'Status Quo Query is not tied to React. Keep it in the service and state handler layer, then let your UI framework consume snapshots and trigger commands.',
                  'React examples in guides are integration examples only. They demonstrate one rendering layer, while the query manager itself remains framework-agnostic.',
                ],
                title: 'Framework Support',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'framework-support',
            intro:
              'Treat query and mutation handles as framework-neutral service objects, then consume them from your chosen UI layer.',
            summary: 'Framework-neutral query manager.',
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
                  'Use `setupQueryManager(queryClient)` when you want the combined query manager.',
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
            intro:
              'The package builds on a normal `QueryClient`, then lets you decide whether you want the combined query manager or the narrower factories.',
            summary: 'Bring a QueryClient. Keep the rest simple.',
            title: 'Installation',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoQueryQuickStart,
                    label: 'Setup manager, tracked query, and tracked mutation',
                    language: 'ts',
                  },
                ],
                id: 'first-flow',
                paragraphs: [
                  'A good quick start creates both a query and a mutation, because the package is about the service layer around both patterns rather than just one observer type.',
                  'The tracked version is now the recommended starting point for most feature work. It keeps cache invalidation closer to domain dependencies and further away from hand-maintained key lists.',
                ],
                title: 'Create the first end-to-end flow',
              },
              {
                bullets: [
                  'Use `manager.createQueryAndMutation(...)` when query and mutation share the same dependency names.',
                  'Put invalidation-relevant values into `deps` and view-only variants into `view`.',
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
            intro:
              'Use the query manager for a first working flow, then split into lower-level factories only when the app structure really benefits from it.',
            summary: 'One manager. One query. One mutation.',
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
                  'Use the **Handle** when you are acting on one specific data source (e.g., refetching a single profile).',
                  'Use the **Manager** for cross-cutting concerns (e.g., invalidating all user-related data).',
                  'The Handle is for UI observation and local action; the Manager is for orchestration and manual state control.',
                ],
                codeExamples: [
                  {
                    code: statusQuoQuerySpecificExample,
                    label: 'Specific Action (Handle)',
                    language: 'ts',
                  },
                  {
                    code: statusQuoQueryGlobalExample,
                    label: 'Global Action (Manager)',
                    language: 'ts',
                  },
                ],
                id: 'scope-levels',
                paragraphs: [
                  'Understanding command scope is key to using Status Quo Query effectively. We distinguish between **Specific Scope** (The Handle) and **Global Scope** (The Manager).',
                  'A **Handle** (Query or Mutation) is a local instance that already knows its key and logic. It is the cleanest way to trigger actions like `refetch()` or `mutate()` because you do not need to repeat keys or configuration.',
                  'The **Query Manager** is your central command center. It is the right place for operations that do not have a natural single owner, such as clearing the entire cache on logout or updating a user list after a creation mutation elsewhere.',
                ],
                title: 'Specific vs. Global Control',
              },
            ],
            eyebrow: 'Guides',
            id: 'command-scope',
            intro:
              'Choose the right tool for the task: use focused handles for local data and the query manager for broad system coordination.',
            summary: 'Understand when to use specific handles or the global manager.',
            title: 'Global vs. Specific Control',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoQueryInvalidateExample,
                    label: 'Invalidate and patch state',
                    language: 'ts',
                  },
                ],
                id: 'invalidate-example',
                paragraphs: [
                  'Invalidation is where the handle/manager split becomes practical. Exact-key invalidation belongs on the query handle, while broader key filters and direct state updates belong on the query manager.',
                  'Tracked invalidation adds a third path: let the manager invalidate exact matching queries automatically by dependency name after a tracked mutation.',
                ],
                title: 'Coordinate invalidation and state updates',
              },
              {
                bullets: [
                  '`query.invalidate()` targets the current query key.',
                  '`createMutation(...)` can invalidate matching tracked queries automatically.',
                  '`manager.invalidateQueries()` supports broader filters.',
                  '`manager.setQueryData()` is the imperative path when you already know the correct next state value.',
                ],
                id: 'invalidate-guidelines',
                paragraphs: [
                  'Use the narrower command first. Reach for the broad manager methods when the behavior truly crosses query boundaries.',
                ],
                title: 'Keep invalidation deliberate',
              },
            ],
            eyebrow: 'Guides',
            id: 'invalidation',
            intro:
              'Invalidation is best when the API makes scope obvious. The wrapper does that by putting exact-key behavior on the handle and broader filters on the query manager.',
            summary: 'Make management scope obvious.',
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
            intro:
              'Escape hatches are healthy when they are explicit. Use them when you truly need raw TanStack behavior, not as the first integration step.',
            summary: 'Stay small. Escape when you must.',
            title: 'Escape Hatches',
          },
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
                  '`createMutation(mutationFn, options?)` accepts one TanStack-compatible mutation function and tracked invalidation options.',
                  '`mutationFn(variables)` performs the async write. `options?` configures retry, lifecycle callbacks, and tracked matching.',
                  'Returns a mutation handle with `getSnapshot()`, `subscribe(listener)`, `mutate(variables, mutateOptions?)`, `reset()`, and `unsafe_getResult()`.',
                ],
                id: 'create-mutation',
                paragraphs: [
                  'Use `createMutation` for the default dependency-tracked write workflow. It keeps invalidation close to domain keys instead of scattering exact cache keys across mutations.',
                ],
                title: 'createMutation',
              },
              {
                bullets: [
                  '`createUntrackedMutation(mutationFn, options?)` keeps the plain mutation handle without tracked invalidation.',
                  'Use it when invalidation is fully manual or handled entirely elsewhere.',
                  'Returns the same mutation handle shape as `createMutation(...)`, but without `dependencyKeys`, `resolveDependencies`, `invalidateOn`, or `matchMode`.',
                ],
                id: 'create-untracked-mutation',
                paragraphs: [
                  'Reach for `createUntrackedMutation` when the write should stay fully manual and should not participate in dependency-based invalidation.',
                ],
                title: 'createUntrackedMutation',
              },
              {
                bullets: [
                  '`createMutation(mutationFn, options?)` adds automatic invalidation on top of the normal mutation handle.',
                  '`options.dependencyKeys?` enables the default variable reader. `options.resolveDependencies?` is the escape hatch for nested or transformed mutation variables.',
                  '`invalidateOn?` supports `success`, `error`, and `settled`. `matchMode?` supports `intersection` and `union`.',
                ],
                id: 'create-mutation-options',
                paragraphs: [
                  'Use `createMutation` when the write should invalidate queries by named dependencies instead of forcing callers to remember exact cache keys manually.',
                ],
                title: 'createMutation Options',
              },
              {
                bullets: [
                  '`createQuery(queryKey, queryFn, options?)` accepts one tracked query key, one query function, and optional observer options.',
                  '`queryKey` must end with an object segment that contains `deps` and may contain `view`.',
                  'Returns a query handle with `getSnapshot()`, `subscribe(listener)`, `refetch(options?)`, `invalidate(options?)`, and `unsafe_getResult()`.',
                ],
                id: 'create-query',
                paragraphs: [
                  'Use `createQuery` for the default dependency-tracked read workflow. It registers itself under named dependencies so tracked mutations can find it later.',
                ],
                title: 'createQuery',
              },
              {
                bullets: [
                  '`createUntrackedQuery(queryKey, queryFn, options?)` keeps the plain query handle without dependency registration.',
                  'Use it when the query should not participate in tracked invalidation, or when you want a very small TanStack wrapper only.',
                  'Returns the same query handle shape as `createQuery(...)`, but does not require a `{ deps, view? }` key segment.',
                ],
                id: 'create-untracked-query',
                paragraphs: [
                  'Reach for `createUntrackedQuery` when the cache entry should stay completely manual and independent from the tracked registry.',
                ],
                title: 'createUntrackedQuery',
              },
              {
                bullets: [
                  '`createQueryAndMutation(dependencyKeys)` returns the tracked query factory plus a tracked mutation factory with default dependency resolution.',
                  'Declare the dependency names once, then let the paired mutation factory read `variables[dependencyKey]` automatically.',
                  'Use the paired helper when one feature flow shares the same dependency names across its tracked queries and tracked mutations.',
                ],
                id: 'create-query-and-mutation',
                paragraphs: [
                  'This helper is the most ergonomic tracked entry point. It keeps dependency names in one place and removes the need to repeat `dependencyKeys` on every tracked mutation in the same flow.',
                ],
                title: 'createQueryAndMutation',
              },
              {
                bullets: [
                  '`matchMode` belongs to tracked mutations and supports `intersection` and `union`.',
                  'Default is `intersection`, which invalidates only queries matching every provided dependency pair.',
                  '`union` broadens invalidation to queries matching any provided dependency pair.',
                ],
                id: 'tracked-matching-examples',
                paragraphs: [
                  'Match strategy controls invalidation breadth. Keep it narrow with `intersection`, or broaden it intentionally with `union` when one mutation needs to fan out across a larger cache slice.',
                ],
                title: 'Tracked Match Modes',
              },
              {
                bullets: [
                  '`invalidateOn` supports `success`, `error`, and `settled`; default is `success`.',
                  '`resolveDependencies(variables)` maps mutation variables into named dependency pairs when the default variable reader is not enough.',
                  'Standalone tracked mutations need either `dependencyKeys` or `resolveDependencies`.',
                ],
                id: 'tracked-options-examples',
                paragraphs: [
                  'These options define when tracked invalidation runs and how dependency values are derived from mutation variables.',
                ],
                title: 'Tracked mutation options',
              },
              {
                bullets: [
                  '`isQueryLoading(query)` accepts a reduced meta state with `status` and `fetchStatus`.',
                  'Returns `true` only for the initial loading case: `status === "pending"` and `fetchStatus === "fetching"`.',
                  'Use it after `toQueryMetaState(snapshot)` when the UI only needs a simple loading answer.',
                ],
                id: 'is-query-loading',
                paragraphs: [
                  'This helper exists to keep the common loading check small and repeatable instead of spreading status comparisons across components.',
                ],
                title: 'isQueryLoading',
              },
              {
                bullets: [
                  '`MutationServiceSnapshot` is the passive state shape returned by `getSnapshot()` and `subscribe(listener)` on a mutation handle.',
                  'Fields include `data`, `error`, `status`, `variables`, `isError`, `isIdle`, `isPending`, and `isSuccess`.',
                  'It is state-only by design. Commands stay on the mutation handle, not on the snapshot.',
                ],
                id: 'mutation-snapshot',
                paragraphs: [
                  'Use `MutationServiceSnapshot` as the read model for rendering mutation state without leaking imperative commands into view code.',
                ],
                title: 'MutationServiceSnapshot',
              },
              {
                bullets: [
                  '`QueryManager` groups the broad management API around one `QueryClient`.',
                  'Factory methods are `createQuery(queryKey, queryFn, options?)`, `createMutation(mutationFn, options?)`, `createQueryAndMutation(dependencyKeys)`, `createUntrackedQuery(queryKey, queryFn, options?)`, and `createUntrackedMutation(mutationFn, options?)`.',
                  'Management methods are `cancelQueries(filters?, options?)`, `getQueryData(queryKey)`, `invalidateQueries(filters?, options?)`, `refetchQueries(filters?, options?)`, `removeQueries(filters?)`, `resetQueries(filters?, options?)`, `setQueryData(queryKey, updater)`, and `unsafe_getClient()`.',
                ],
                id: 'query-manager',
                paragraphs: [
                  'Use `QueryManager` when an operation crosses handle boundaries or when integration code needs one centralized surface for creation, tracked invalidation, and cache management.',
                ],
                title: 'QueryManager',
              },
              {
                bullets: [
                  '`QueryServiceSnapshot` is the passive state shape returned by `getSnapshot()` and `subscribe(listener)` on a query handle.',
                  'Fields include `data`, `error`, `status`, `fetchStatus`, `isError`, `isFetching`, `isPending`, and `isSuccess`.',
                  'It is designed for reads and derived state only. Commands stay on the query handle.',
                ],
                id: 'query-snapshot',
                paragraphs: [
                  'Use `QueryServiceSnapshot` as the rendering surface when the UI needs current query state in a stable, framework-neutral shape.',
                ],
                title: 'QueryServiceSnapshot',
              },
              {
                bullets: [
                  '`setupMutation(queryClient)` binds one TanStack `QueryClient` to the mutation factory.',
                  'The only parameter is the `queryClient` instance that should own cache coordination and observer lifecycle.',
                  'Returns the `createMutation` factory for focused mutation-only integrations.',
                ],
                id: 'setup-mutation',
                paragraphs: [
                  'Use `setupMutation` when your integration only needs mutation handles and not the broader query manager facade.',
                ],
                title: 'setupMutation',
              },
              {
                bullets: [
                  '`setupQuery(queryClient)` binds one TanStack `QueryClient` to the query factory.',
                  'The only parameter is the `queryClient` instance that should own cache coordination and observer lifecycle.',
                  'Returns the `createQuery` factory for focused query-only integrations.',
                ],
                id: 'setup-query',
                paragraphs: [
                  'Use `setupQuery` when you only need per-query handles and want the dependency on one `QueryClient` to stay explicit.',
                ],
                title: 'setupQuery',
              },
              {
                bullets: [
                  '`setupQueryManager(queryClient)` binds one TanStack `QueryClient` to the full facade.',
                  'The only parameter is the `queryClient` instance that should back both factories and manager operations.',
                  'Returns a `QueryManager` with both factories and cross-query management methods on one object.',
                ],
                id: 'setup-manager',
                paragraphs: [
                  'Use `setupQueryManager` when one runtime boundary should own query creation, mutation creation, and cache-level management from the same entry point.',
                ],
                title: 'setupQueryManager',
              },
              {
                bullets: [
                  '`toQueryMetaState(snapshot)` accepts any object with `status` and `fetchStatus`, typically a `QueryServiceSnapshot`.',
                  'Returns a smaller `QueryMetaState` object containing only those two fields.',
                  'Use it to keep UI helpers and selectors focused on the minimal query state they actually need.',
                ],
                id: 'to-query-meta-state',
                paragraphs: [
                  'This helper narrows the full query snapshot to the smallest state surface needed for meta checks such as loading or idle state.',
                ],
                title: 'toQueryMetaState',
              },
            ],
            eyebrow: 'Guides',
            id: 'api',
            intro:
              'The public surface is split into query handles, mutation handles, and one query manager for broader management.',
            summary: 'Everything you can call, in one place.',
            title: 'API Reference',
          },
          {
            blocks: [
              {
                bullets: [
                  '`view` is still part of the TanStack cache key, so page 1 and page 2 remain separate cache entries.',
                  'Tracked invalidation intentionally matches only `deps`, because pagination, sorting, and filters usually describe presentation variants rather than domain identity.',
                  'That split keeps the cache key expressive without turning every UI variant into an invalidation dependency.',
                ],
                id: 'faq-deps-vs-view',
                paragraphs: [
                  'A common question is whether `view` should participate in automatic invalidation. The short answer is no: it still shapes cache identity, but it is intentionally excluded from tracked matching.',
                ],
                title: 'Why `view` is not tracked',
              },
              {
                bullets: [
                  'If one mutation truly should refresh only one page, use `query.invalidate()` or `manager.invalidateQueries({ queryKey, exact: true })` for that exact key.',
                  'If page-specific invalidation is part of the domain semantics, move that value from `view` into `deps` intentionally.',
                  'Broad tracked invalidation is often the right tradeoff after create, delete, rename, or filter-affecting updates because those writes can shift pagination, sorting, and list membership across multiple views.',
                ],
                id: 'faq-narrow-vs-broad',
                paragraphs: [
                  'The default behavior favors correctness across related list variants. Narrow invalidation stays available as an explicit manual escape hatch when you need it.',
                ],
                title: 'When to stay broad and when to narrow',
              },
            ],
            eyebrow: 'Guides',
            id: 'faq',
            intro:
              'These edge cases come up quickly once you start using `deps` and `view` deliberately. The key is to separate cache identity from invalidation semantics.',
            summary: 'Other facts about usage.',
            title: 'FAQ',
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
                    code: statusQuoQueryQuickStart,
                    label: 'User query and mutation flow',
                    language: 'ts',
                  },
                ],
                id: 'user-flow',
                paragraphs: [
                  'This example shows the main package story: one query manager, one query handle, one mutation handle, and commands that stay on the owning handle.',
                ],
                title: 'User workflow example',
              },
            ],
            eyebrow: 'Examples',
            id: 'example-user-workflow',
            intro: 'Start with a complete query and mutation flow around one query manager.',
            summary: 'Query and mutation handles in one working flow.',
            title: 'User workflow example',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoQueryInvalidateExample,
                    label: 'Follow-up management coordination',
                    language: 'ts',
                  },
                ],
                id: 'manager-follow-up',
                paragraphs: [
                  'A realistic example usually ends with some state coordination after a mutation. That is why the query manager exists alongside the narrower handles.',
                ],
                title: 'Manager follow-up example',
              },
            ],
            eyebrow: 'Examples',
            id: 'example-manager-follow-up',
            intro:
              'Use manager commands after mutations when workflows require coordinated follow-up behavior.',
            summary: 'Manager management after a mutation.',
            title: 'Manager follow-up example',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoQueryTrackedPairExample,
                    label: 'Paired tracked factories',
                    language: 'ts',
                  },
                ],
                id: 'tracked-pair-example',
                paragraphs: [
                  'This is the shortest tracked setup that still shows the full value: declare dependency names once, register the query with `deps`, and let the paired mutation invalidate automatically by reading the same keys from the mutation variables.',
                ],
                title: 'Paired tracked workflow',
              },
            ],
            eyebrow: 'Examples',
            id: 'example-tracked-pair',
            intro: 'Use the paired helper when one feature flow shares the same dependency names.',
            summary: 'Declare dependency keys once, reuse them across tracked queries and mutations.',
            title: 'Paired tracked workflow',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoQueryTrackedIntersectionExample,
                    label: 'Intersection matching',
                    language: 'ts',
                  },
                  {
                    code: statusQuoQueryTrackedUnionExample,
                    label: 'Union matching',
                    language: 'ts',
                  },
                ],
                id: 'tracked-match-mode-examples',
                paragraphs: [
                  'These two examples show the same tracked setup with different invalidation breadth. `intersection` keeps the fan-out narrow, while `union` deliberately expands it.',
                ],
                title: 'Tracked match mode examples',
              },
            ],
            eyebrow: 'Examples',
            id: 'example-tracked-match-modes',
            intro: 'Choose match mode based on how broad the mutation impact really is.',
            summary: 'Compare `intersection` and `union` with concrete tracked queries.',
            title: 'Tracked match mode examples',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: statusQuoQueryTrackedLifecycleExample,
                    label: 'Lifecycle timing',
                    language: 'ts',
                  },
                  {
                    code: statusQuoQueryTrackedCustomResolverExample,
                    label: 'Custom dependency resolver',
                    language: 'ts',
                  },
                ],
                id: 'tracked-option-examples',
                paragraphs: [
                  'Use these patterns when tracked invalidation needs custom timing or when mutation variables do not expose the dependency values in the default shape.',
                ],
                title: 'Tracked option examples',
              },
            ],
            eyebrow: 'Examples',
            id: 'example-tracked-options',
            intro: 'Adjust invalidation timing or dependency resolution when the default flow is not enough.',
            summary: 'Examples for `invalidateOn` and `resolveDependencies`.',
            title: 'Tracked option examples',
          },
        ],
        title: 'Examples',
      },
    ],
    title: 'Status Quo Query',
  },
  {
    accent: 'ochre',
    description:
      'Typed publish/subscribe events with a narrow React provider layer for UI-scoped subscriptions.',
    githubPath: 'packages/vent',
    id: 'vent',
    npm: '@veams/vent',
    sections: [
      {
        id: 'getting-started',
        pages: [
          {
            blocks: [
              {
                featureCards: ventOverviewCards,
                id: 'overview-shape',
                paragraphs: [
                  'Vent is the smallest coordination layer in the VEAMS ecosystem: publish an event, let interested consumers react, and keep ownership local instead of building another shared mutable state surface.',
                ],
                title: 'Keep event boundaries explicit',
              },
              {
                bullets: [
                  'Use the root package for the event bus itself.',
                  'Use `@veams/vent/react` only when React should manage subscription lifecycle.',
                ],
                id: 'entries',
                paragraphs: [
                  'The package surface stays intentionally narrow. Most consumers only need the root bus and, in React applications, the provider-based subscription layer.',
                ],
                title: 'Three small entry points',
              },
            ],
            eyebrow: 'Getting Started',
            heroBullets: [
              'Typed topics and payloads over a tiny publish/subscribe core.',
              'Optional React bindings for provider-scoped subscriptions.',
              'A simple event boundary when a store would be heavier than the problem.',
            ],
            heroParagraphs: [
              'Vent gives you a focused event bus when one part of the app needs to signal another part without sharing state ownership. It is useful for transient coordination such as notifications, orchestration signals, and integration boundaries where a store would be heavier than the actual problem.',
            ],
            id: 'overview',
            intro:
              'Start with the root event bus, then add React bindings only when the component tree needs one shared instance.',
            summary: 'A narrow event bus for decoupled coordination.',
            title: 'Overview',
          },
          {
            blocks: [
              {
                bullets: [
                  'Events represent something that happened, not long-lived state.',
                  'Publishers should not know which subscribers exist.',
                  'Subscribers can be replaced, added, or removed without changing the publisher flow.',
                ],
                id: 'event-model',
                paragraphs: [
                  'Vent works best for transient coordination. If the value itself must remain readable and derivable over time, use a state handler. If the important thing is that something happened and multiple listeners may react, an event bus is the simpler fit.',
                ],
                title: 'Choose events for transient coordination',
              },
              {
                bullets: [
                  'Use one event bus per feature boundary when possible.',
                  'Keep topic names explicit, usually namespaced by feature or workflow.',
                  'Prefer typed payloads over `any` so event contracts stay readable.',
                ],
                id: 'contracts',
                paragraphs: [
                  'A good Vent setup is intentionally boring: one clear topic vocabulary, payloads that describe the event data, and subscribers that only do their own work after the event is emitted.',
                ],
                title: 'Treat topics as contracts',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'concepts',
            intro:
              'Use Vent when coordination should stay decoupled and short-lived, not when you need another source of durable state.',
            summary: 'Events for signals, state for ownership.',
            title: 'Concepts',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: `import createVent from '@veams/vent';`,
                    label: 'Framework-agnostic root',
                    language: 'ts',
                  },
                  {
                    code: ventReactImports,
                    label: 'Optional React entry',
                    language: 'ts',
                  },
                ],
                bullets: [
                  'The root package is framework-agnostic and owns the bus.',
                  'React bindings live under `@veams/vent/react`.',
                ],
                id: 'framework-support',
                paragraphs: [
                  'Vent keeps integration layers at the edge. React does not own the event model; it only helps subscribe and provide one shared instance in a component subtree.',
                ],
                title: 'Keep integration surfaces separate',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'framework-support',
            intro:
              'Use the root API everywhere, then add the React subpath only where the component tree needs provider-based subscriptions.',
            summary: 'Generic root, optional React layer.',
            title: 'Framework Support',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: ventInstall,
                    label: 'Install',
                    language: 'bash',
                  },
                ],
                id: 'install',
                paragraphs: [
                  'Install the package once. The React entrypoint is exposed as a subpath, so there is no separate React package to add.',
                ],
                title: 'Install the package',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'installation',
            intro: 'Add the package, then pick the entrypoint that matches your runtime boundary.',
            summary: 'One package, multiple narrow surfaces.',
            title: 'Installation',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: ventQuickStart,
                    label: 'Typed root event bus',
                    language: 'ts',
                  },
                  {
                    code: ventReactQuickStart,
                    label: 'React provider and subscriber',
                    language: 'tsx',
                  },
                ],
                id: 'first-flow',
                paragraphs: [
                  'The quickest path is one event type, one publisher, and one subscriber. From there, React can host the shared bus with a provider if multiple components need to participate in the same event flow.',
                ],
                title: 'Publish once, react in multiple places',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'quick-start',
            intro:
              'Create the bus, subscribe to a topic, and publish a typed payload. Add the React provider only when multiple components need the same instance.',
            summary: 'A minimal event bus with optional React scope.',
            title: 'Quick Start',
          },
        ],
        title: 'Getting Started',
      },
      {
        id: 'api',
        pages: [
          {
            blocks: [
              {
                paragraphs: [
                  'Use the root package for the generic event bus, `@veams/vent/react` for the React provider and hooks, and `@veams/vent/plugin` only when your runtime already revolves around Veams globals.',
                ],
                id: 'entry-points',
                title: 'Entry points',
              },
              {
                bullets: [
                  '`createEventHandling()` takes no runtime parameters.',
                  'Its generic parameters let you type topics, payloads, and callback scope when you need stricter contracts.',
                  'Returns one `EventHandler` instance with `publish`, `subscribe`, `unsubscribe`, and their aliases.',
                ],
                id: 'create-event-handling',
                paragraphs: [
                  'Use `createEventHandling()` from the root package when you want a plain event bus with no framework dependency. This is the primary entrypoint for Vent.',
                ],
                title: 'createEventHandling',
              },
              {
                bullets: [
                  '`publish(topic, data?, scope?)` emits one event for one topic. `data?` is the payload and `scope?` becomes the callback `this` context.',
                  '`subscribe(topic, callback)` registers one callback for one or multiple space-separated topics.',
                  '`unsubscribe(topic, callback, completely?)` removes callback registrations. Set `completely` to `true` when you also want empty topic buckets removed immediately.',
                  'Aliases are `trigger` for `publish`, `on` for `subscribe`, and `off` for `unsubscribe`.',
                ],
                id: 'event-handler',
                paragraphs: [
                  'The `EventHandler` API stays intentionally small. It only deals with event publishing and subscription lifecycle. There is no state snapshot layer in this package.',
                ],
                title: 'EventHandler',
              },
              {
                codeExamples: [
                  {
                    code: ventPluginSetup,
                    label: 'Plugin entry',
                    language: 'ts',
                  },
                ],
                bullets: [
                  'Import the default plugin export from `@veams/vent/plugin` and call `initialize(veams, options?)`.',
                  '`veams` is the host object to enrich. `options?.furtherEvents` lets you merge additional event names into `Veams.EVENTS`.',
                  'The plugin attaches `Veams.Vent` and keeps this global integration out of the generic root API.',
                ],
                id: 'plugin-api',
                paragraphs: [
                  'Use the plugin entry when your runtime already revolves around Veams and you want the bus attached there. The plugin remains a separate concern so the root package stays generic.',
                ],
                title: 'VentPlugin.initialize',
              },
              {
                bullets: [
                  '`VentProvider({ children, instance })` takes one existing bus instance and exposes it through React context.',
                  '`children` is the subtree that should share the bus. `instance` is the `EventHandler` to provide.',
                  'Use it when multiple components in one subtree should publish and subscribe against the same bus instance.',
                ],
                id: 'vent-provider',
                paragraphs: [
                  'The React subpath stays narrow on purpose. `VentProvider` only shares an existing bus; it does not add selectors, caching, or another abstraction on top.',
                ],
                title: 'VentProvider',
              },
              {
                bullets: [
                  '`useVent()` takes no parameters.',
                  'Returns the current `EventHandler` from the nearest `VentProvider`.',
                  'Throws when used outside provider scope so missing bus ownership fails loudly.',
                ],
                id: 'use-vent',
                paragraphs: [
                  'Use `useVent()` when a component needs direct access to the provided bus instance for manual publish or subscribe composition.',
                ],
                title: 'useVent',
              },
              {
                bullets: [
                  '`useVentSubscribe(topic, callback)` subscribes inside an effect and cleans up automatically.',
                  '`topic` can be one topic or a space-separated topic string. `callback` receives the typed payload and preserves the event scope binding.',
                  'Use it when a component should react to bus events without manually wiring subscription lifecycle.',
                ],
                id: 'use-vent-subscribe',
                paragraphs: [
                  'This hook is the convenience path for React subscribers. It keeps effect cleanup consistent while leaving the event model itself unchanged.',
                ],
                title: 'useVentSubscribe',
              },
            ],
            eyebrow: 'API',
            id: 'api',
            intro:
              'The public surface is split into one generic event bus, one narrow React entry, and one separate plugin entry.',
            summary: 'Everything the package exposes, without extra layers.',
            title: 'API Reference',
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
                    code: ventExampleSetup,
                    label: 'Provider setup',
                    language: 'tsx',
                  },
                  {
                    code: ventExampleSubscribers,
                    label: 'Publisher and subscriber roles',
                    language: 'tsx',
                  },
                ],
                id: 'release-bus',
                liveExample: 'vent-release-bus',
                paragraphs: [
                  'This example shows the intended React shape: one provider-scoped bus, one publisher, and multiple subscribers that update independently from the same event stream.',
                ],
                title: 'Provider-scoped release bus',
              },
            ],
            eyebrow: 'Examples',
            id: 'example-release-bus',
            intro:
              'Use one shared Vent instance in a subtree when several components should react to the same transient workflow events.',
            summary: 'A real event bus with decoupled React subscribers.',
            title: 'Provider-scoped release bus',
          },
        ],
        title: 'Examples',
      },
    ],
    title: 'Vent',
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
            intro:
              'Start with the package split: generic form state at the root, React-only wiring under `@veams/form/react`.',
            summary: 'Explicit form state, clean React wiring.',
            title: 'Overview',
          },
          {
            blocks: [
              {
                featureCards: [
                  {
                    description:
                      'The FormStateHandler is a pure, framework-agnostic object that manages values, errors, and validation logic independently of any UI library.',
                    title: 'Generic Form Engine',
                    visual: 'form-architecture',
                  },
                ],
                id: 'form-engine',
                paragraphs: [
                  'Following the Status Quo philosophy, the `FormStateHandler` is the central engine of the package. It exists entirely outside the React lifecycle, owning the source of truth for all form data and validation states.',
                  'This framework-agnostic core makes your form logic portable and testable. You can define complex validation rules and state transitions once and rely on the handler to maintain a consistent state snapshot, regardless of how or where it is rendered.',
                ],
                title: 'The FormStateHandler Engine',
              },
              {
                featureCards: [
                  {
                    description:
                      'React bindings provide the bridge between the FormStateHandler and the DOM, utilizing hooks and refs for high-performance uncontrolled inputs.',
                    title: 'React View Bindings',
                    visual: 'form-ref-bridge',
                  },
                ],
                id: 'react-bindings',
                paragraphs: [
                  'The React layer provides the "glue" that connects the generic engine to the browser. Registration happens through hooks like `useUncontrolledField()`, which creates a stable bridge between DOM elements and the handler.',
                  'To keep render performance high, the UI does not render current values from state snapshots. Instead, only metadata (like validation errors or touched state) flows back via snapshots to trigger UI updates, while the DOM element itself maintains the value.',
                  'When programmatic updates are needed, the bridge hook uses a `ref` to imperatively sync the DOM with the handler state, bypassing the React re-render cycle for input values.',
                ],
                title: 'React Integration & Performance',
              },
              {
                bullets: [
                  'Uncontrolled by Default: Sync DOM to state only when needed.',
                  'Centralized Validation: One validator function for the whole form.',
                  'Nested Snapshots: Subscribe to individual field meta for performance.',
                ],
                id: 'form-principles',
                paragraphs: [
                  'These principles keep form management predictable and ensure that your UI stays performant even with complex validation rules.',
                ],
                title: 'Key Principles',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'concepts',
            intro:
              'Status Quo Form separates the generic state engine from the React view bindings for maximum performance and portability.',
            summary: 'Generic engine, optimized React bindings.',
            title: 'Concepts',
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
            intro:
              'Model form state in the framework-agnostic root package, then opt into React bindings only at the view boundary.',
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
            intro:
              'Install the generic core first, then opt into the React subpath when the UI needs it.',
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
            intro:
              'Start with one plain `FormStateHandler`, then bind it into React only where the UI needs it.',
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
            intro:
              'When a form is part of a richer screen flow, keep the controller inside the feature handler and pass it down explicitly.',
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
                  'Use `setSubmitError()` for backend failures that do not belong to one field.',
                  'Call `touchAllFields()` on invalid submit so errors become visible immediately.',
                ],
                id: 'validator-submit-cycle',
                paragraphs: [
                  'Client and server validation should not compete. The clean split is: local validator for synchronous checks, server field responses mapped with `setFieldError()`, and generic backend failures mapped with `setSubmitError()`.',
                  'This keeps the submit cycle explicit and debuggable: validate, touch, submit, map remote field errors or form-level failures, and retry with corrected values.',
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
            intro:
              'Use one typed validator as the source of truth for field and submit checks, then layer server errors through explicit field updates.',
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
            intro:
              'Controlled components should be the explicit exception for widgets that need them, not the default for every field.',
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
            intro:
              'Use dot-path field names to model nested object forms without flattening your state shape.',
            summary: 'Nested values, same API surface.',
            title: 'Advanced Nested Fields',
          },
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
                  '`Controller({ name, render })` bridges controlled inputs through a render prop.',
                  '`name` is the dot-path field name. `render` receives `{ field, fieldState }` so controlled widgets can bind `value`, `onChange`, and `onBlur` explicitly.',
                  'Use it for third-party inputs that require controlled props. Native fields should usually stay on `useUncontrolledField()`.',
                ],
                id: 'controller-api',
                paragraphs: [
                  'This is the narrow controlled-component bridge. It exists so controlled widgets stay explicit instead of turning the whole form API into a controlled model.',
                ],
                title: 'Controller',
              },
              {
                bullets: [
                  '`FormProvider(props)` has two valid shapes.',
                  'Local mode takes `{ children, initialValues, onSubmit, validator?, ...formProps }`. External mode takes `{ children, formHandlerInstance, onSubmit, ...formProps }`.',
                  '`onSubmit(values, form)` receives the validated values and the resolved `FormStateHandler`. The provider calls `validateForm()` and `touchAllFields()` before invoking it.',
                ],
                id: 'form-provider-api',
                paragraphs: [
                  'Use `FormProvider` to own or bridge one controller instance into a React subtree. The API stays explicit about whether React owns the controller lifecycle or just hosts it.',
                ],
                title: 'FormProvider',
              },
              {
                codeExamples: [
                  {
                    code: formValidatorFlowExample,
                    label: 'Handler validation lifecycle',
                    language: 'ts',
                  },
                ],
                bullets: [
                  '`new FormStateHandler(config)` takes `{ initialValues, validator?, options? }`.',
                  '`initialValues` seeds `values` with the same nested shape the form will keep for its whole lifetime. `validator?` returns the typed field-error map. `options?.devTools` configures the underlying Status Quo devtools integration.',
                  'The state snapshot is `{ values, errors, submitError, touched, isSubmitting, isValid }`.',
                  '`errors` contains active field-level messages keyed by dot-path. Missing keys mean valid fields. `submitError` is the form-level backend message and stays separate from field validation.',
                  '`isValid` is derived from the field error map only. A `submitError` may exist while `isValid` is still `true`.',
                  '`setFieldValue(name, value)` updates the nested value, reruns the validator for the full snapshot, updates `errors`, and clears stale `submitError`.',
                  '`validateForm()` reruns the validator against the current snapshot, stores the resulting field errors, and returns the boolean result for submit flow control.',
                  '`setFieldError(name, errorMessage?)` is for authoritative backend field constraints. `setSubmitError(errorMessage?)` is for generic backend failures that do not belong to one field.',
                  '`setFieldTouched(name, isTouched?)` marks one field explicitly. `touchAllFields()` marks every leaf field so validation messages can become visible in one step.',
                  '`resetForm(values?)` replaces the current values with either the original `initialValues` or a new snapshot and clears `errors`, `submitError`, `touched`, and submit state.',
                  '`setSubmitting(isSubmitting)` exists for non-React or custom submit orchestration. When you use `FormProvider`, the provider manages that flag around `onSubmit` for you.',
                ],
                id: 'form-state-handler-api',
                paragraphs: [
                  'This is the generic root controller. It owns the full form lifecycle and remains usable outside React.',
                  'The important distinction in this API is between field validation state and form-level submit state. Field rules flow through `errors` and `isValid`; backend-wide failures flow through `submitError`. That split keeps rendering, submit logic, and debugging much easier to reason about.',
                ],
                title: 'FormStateHandler',
              },
              {
                bullets: [
                  '`toZodValidator(schema)` takes one schema-like object with `safeParse(values)` and `error.issues`.',
                  'Returns a `ValidatorFn<TValues>` that maps schema issues into the standard field-error object shape.',
                  'Use it when a feature already owns a Zod schema and you want the form API to stay on the normal validator contract.',
                ],
                id: 'to-zod-validator-api',
                paragraphs: [
                  'The adapter keeps schema integration narrow. The rest of the form API continues to work with plain validator functions and typed field-error maps.',
                ],
                title: 'toZodValidator',
              },
              {
                bullets: [
                  '`useFieldMeta(name)` takes one field name or dot-path.',
                  'Returns `{ error, touched }` for that field only.',
                  'Use it when a component only needs validation metadata and should not subscribe to the full form snapshot.',
                ],
                id: 'use-field-meta-api',
                paragraphs: [
                  'This hook is the smallest read surface in the React layer. It keeps metadata subscriptions narrow and easy to reason about.',
                ],
                title: 'useFieldMeta',
              },
              {
                bullets: [
                  '`useFormController()` takes no parameters.',
                  'Returns the current `FormStateHandler` from the nearest `FormProvider`.',
                  'Throws outside provider scope so missing form ownership fails loudly.',
                ],
                id: 'use-form-controller-api',
                paragraphs: [
                  'Use this hook when a component needs direct access to the controller itself rather than one of the higher-level field hooks.',
                ],
                title: 'useFormController',
              },
              {
                bullets: [
                  '`useFormMeta()` takes no parameters.',
                  'Returns aggregate form metadata including `{ errors, submitError, touched, isSubmitting, isValid }`.',
                  'Use it for error summaries, submit banners, or other UI that depends on more than one field at once.',
                ],
                id: 'use-form-meta-api',
                paragraphs: [
                  'This hook is the broad read surface in the React layer. It is intentionally suited to form-level UI rather than per-field rendering.',
                ],
                title: 'useFormMeta',
              },
              {
                bullets: [
                  '`useUncontrolledField(name, options?)` takes one field name or dot-path plus optional field configuration.',
                  '`options?` varies by element type and covers cases such as checkboxes, radios, selects, default values, and value extraction.',
                  'Returns the registration props and `meta` needed to bind native inputs without making every keystroke controlled React state.',
                ],
                id: 'use-uncontrolled-field-api',
                paragraphs: [
                  'This is the default field hook for native inputs. It keeps the DOM in charge of the live value while the form controller owns validation, touched state, and submit state.',
                ],
                title: 'useUncontrolledField',
              },
            ],
            eyebrow: 'Guides',
            id: 'api-reference',
            intro:
              'The package API is split by responsibility: generic form state at the root, React bindings under the subpath.',
            summary: 'Everything public, without hidden layers.',
            title: 'API Reference',
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
            intro:
              'Start with a complete local form before introducing feature-level orchestration.',
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
            intro:
              'When form state is part of a larger feature, keep ownership in the feature handler.',
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
            intro:
              'Combine local validator rules with backend error mapping in one feature-owned submit flow.',
            summary: 'Feature submit lifecycle with client and server validation.',
            title: 'Feature form with validation',
          },
        ],
        title: 'Examples',
      },
    ],
    title: 'Form',
  },
  {
    accent: 'forest',
    description:
      'Activate interactive components in a static HTML environment using the Islands Architecture.',
    githubPath: 'packages/partial-hydration',
    id: 'partial-hydration',
    npm: '@veams/partial-hydration',
    sections: [
      {
        id: 'getting-started',
        pages: [
          {
            blocks: [
              {
                featureCards: [
                  {
                    description:
                      'Interactive islands are embedded in a static HTML frame and activated by specific triggers like viewport intersection.',
                    title: 'Islands Architecture',
                    visual: 'partial-hydration-architecture',
                  },
                ],
                id: 'islands-architecture',
                paragraphs: [
                  'Partial Hydration allows you to build high-performance web applications by combining the speed of static HTML with the interactivity of modern UI frameworks. Instead of hydrating the entire page, you only activate specific components based on user interaction or environment triggers.',
                ],
                title: 'Islands of Interactivity',
              },
            ],
            eyebrow: 'Getting Started',
            heroBullets: [
              'Zero-bundle impact for static regions.',
              'No custom compiler or bundler lock-in required.',
              'Flexible hydration triggers: viewport, ready, or immediate.',
            ],
            heroImage: islandArchitectureImg,
            heroParagraphs: [
              'VEAMS Partial Hydration provides the core infrastructure for activating components in a static HTML environment. It enables the Islands Architecture by serializing component props into the DOM during server-rendering and selectively hydrating them on the client. Unlike many modern meta-frameworks, it achieves this purely at runtime, meaning you do not need a custom compiler and are never locked into a specific bundler.',
            ],
            id: 'overview',
            intro:
              'Leverage the Islands Architecture to activate interactive UI components exactly when and where they are needed.',
            summary: 'Selective hydration for peak performance.',
            title: 'Overview',
          },
          {
            blocks: [
              {
                callout: 'The data-internal-ref and data-internal-id attributes are a fallback solution we support to re-connect the data script with the component if the DOM is structurally manipulated before hydration. In standard setups where the script tag stays directly adjacent to the wrapper, these attributes are actually not necessary.',
                codeExamples: [
                  {
                    code: partialHydrationDomExample,
                    label: 'Generated DOM structure',
                    language: 'html',
                  },
                ],
                id: 'hydration-flow',
                paragraphs: [
                  'The hydration process relies on two key HTML elements generated on the server: a hidden script tag containing the serialized props, and a wrapper div with a `data-component` attribute identifying the component.',
                  'When the client-side loader encounters this structure and the activation trigger fires, it uses `data-component` to resolve the matching entry in `createHydration({ components })`, parses the JSON props, and hands control over to the defined render function.',
                ],
                title: 'DOM Architecture',
              },
              {
                bullets: [
                  'Props Serialization: Metadata stays with the HTML.',
                  'Lazy Activation: Download and run JS only when triggered.',
                  'Stable Mapping: `data-component` must match the registered client component key.',
                  'Stable Identity: useIsomorphicId ensures DOM consistency.',
                ],
                id: 'hydration-principles',
                paragraphs: [
                  'By following these principles, you ensure that your application remains fast, accessible, and easy to maintain as it grows in complexity.',
                ],
                title: 'Core Principles',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'concepts',
            intro:
              'Understand how selective component activation keeps your page fast while providing a rich user experience.',
            summary: 'Hydrate what matters, when it matters.',
            title: 'Concepts',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: `import { createHydration } from '@veams/partial-hydration';`,
                    label: 'Framework-agnostic core',
                    language: 'ts',
                  },
                  {
                    code: `import { withHydration, useIsomorphicId } from '@veams/partial-hydration/react';`,
                    label: 'Optional React bindings',
                    language: 'ts',
                  },
                ],
                bullets: [
                  'The root package (`@veams/partial-hydration`) is framework-agnostic and owns the core engine.',
                  'React bindings live in a separate subpath (`@veams/partial-hydration/react`).',
                  'The `render` function gives you full control over how any framework is initialized.',
                ],
                id: 'framework-support',
                paragraphs: [
                  'Partial Hydration is not tied to React. The core engine handles DOM scanning, event listeners, and data extraction independently. You can use it with Vue, Svelte, or even Vanilla JS by providing the appropriate `render` function.',
                  'For React users, we provide dedicated bindings under the `/react` subpath to handle SSR metadata injection and stable ID generation.',
                ],
                title: 'Framework Support',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'framework-support',
            intro:
              'Use the framework-agnostic root for the client-side engine, then add React bindings only for SSR component preparation.',
            summary: 'Framework-neutral core, optional React layer.',
            title: 'Framework Support',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: partialHydrationInstall,
                    label: 'Install',
                    language: 'bash',
                  },
                ],
                id: 'install',
                paragraphs: [
                  'Install the hydration package. It is framework-agnostic at its core, but provides optional React bindings for easier integration.',
                ],
                title: 'Install the package',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'installation',
            intro: 'Add the package to your project and start defining your hydration strategies.',
            summary: 'Small impact, huge performance wins.',
            title: 'Installation',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: partialHydrationQuickStart,
                    label: 'Client-side initialization',
                    language: 'ts',
                  },
                ],
                id: 'client-init',
                paragraphs: [
                  'To start the hydration process on the client, you create a hydration instance with a map of your components and call `init()`. The loader scans the DOM for `[data-component]`, matches each value against your component map, and activates the matching entries based on their trigger configuration.',
                ],
                title: 'Initialize on the client',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'quick-start',
            intro:
              'The quickest path to an interactive page is defining your component map and calling the hydration initializer.',
            summary: 'From static HTML to interactive islands in seconds.',
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
                featureCards: [
                  {
                    description:
                      'Map `data-component` values to activation triggers so each island hydrates only when it should.',
                    title: 'Trigger Mapping',
                    visual: 'partial-hydration-triggers',
                  },
                ],
                id: 'strategies',
                paragraphs: [
                  'Choosing the right hydration strategy is crucial for balancing performance and interactivity. We recommend a "lazy-first" approach: only hydrate components when they are actually needed by the user.',
                ],
                title: 'Choosing a Trigger',
              },
              {
                codeExamples: [
                  {
                    code: partialHydrationCreateOptionsExample,
                    label: 'Hydration Configuration',
                    language: 'ts',
                  },
                ],
                bullets: [
                  '**init**: Use for critical UI that must be interactive immediately (e.g., global navigation).',
                  '**dom-ready**: Use for components that are visible above the fold but less critical than the main layout.',
                  '**in-viewport**: The most efficient strategy. Activate components only when the user scrolls them into view.',
                  '**fonts-ready**: Use for text-heavy interactive elements that rely on specific typography layout.',
                ],
                id: 'trigger-guide',
                paragraphs: [
                  'The `createHydration` options map `data-component` values to their activation rules. Each component in the map requires a `render` function, which provides full control over how the framework (like React or Vue) is initialized on the DOM element.',
                  'If you use `withHydration()`, the wrapper `data-component` value is taken from `Component.displayName`, so that `displayName` must stay stable and match the client registration key.',
                  'For viewport-based hydration, you can provide an optional `config.rootMargin` to trigger activation slightly before the element enters the visible area, ensuring a seamless experience for the user.',
                ],
                title: 'Trigger Reference & Options',
              },
            ],
            eyebrow: 'Guides',
            id: 'create-hydration',
            intro:
              'Orchestrate components and choose the most efficient activation trigger for each.',
            summary: 'Orchestrate components with createHydration.',
            title: 'createHydration & Strategies',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: partialHydrationLazyExample,
                    label: 'Lazy loading example',
                    language: 'ts',
                  },
                ],
                bullets: [
                  'Use dynamic imports to load components only when needed.',
                  'Return a Promise from the `render` function to await the module.',
                  'Combine with `in-viewport` for maximum performance.',
                ],
                id: 'lazy-loading-guide',
                paragraphs: [
                  'To truly benefit from partial hydration, you should lazy load your component code. By passing a dynamic import (e.g., `() => import(...)`) as your Component definition and awaiting it in the `render` function, the browser only downloads the JavaScript when the component is actually activated.',
                ],
                title: 'Dynamic Imports',
              },
            ],
            eyebrow: 'Guides',
            id: 'lazy-loading',
            intro: 'Load component code only when the activation trigger fires.',
            summary: 'Lazy loading in the component itself.',
            title: 'Lazy Loading',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: partialHydrationHocConfigExample,
                    label: 'withHydration options',
                    language: 'tsx',
                  },
                ],
                bullets: [
                  'Pass `modifiers` to add CSS classes to the wrapper div.',
                  'Pass `attributes` to add custom HTML attributes like `data-testid`.',
                  'Set a stable `displayName` on the wrapped component so `withHydration()` can write the correct `data-component` value.',
                ],
                id: 'hoc-options',
                paragraphs: [
                  'The `withHydration` HOC accepts an optional configuration object to customize the wrapper `div` it generates. It uses the original component `displayName` for `data-component`, then applies your additional classes and attributes without requiring another wrapper element.',
                ],
                title: 'Wrapper Configuration',
              },
            ],
            eyebrow: 'Guides',
            id: 'with-hydration',
            intro: 'Customize the HTML wrapper generated by the withHydration HOC.',
            summary: 'withHydration options.',
            title: 'withHydration Options',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: partialHydrationProviderExample,
                    label: 'HydrationProvider usage',
                    language: 'tsx',
                  },
                ],
                bullets: [
                  'Manages the `componentId` for the hydration unit.',
                  'Provides a counter for `useIsomorphicId`.',
                  'Automatically applied by `withHydration`.',
                ],
                id: 'provider-guide',
                paragraphs: [
                  'The `HydrationProvider` is a React context provider that supplies metadata to the hydrated component tree. While it is automatically included when using `withHydration`, you can also use it manually if you are building custom hydration wrappers or orchestrating complex isomorphic setups.',
                ],
                title: 'Context Provider',
              },
            ],
            eyebrow: 'Guides',
            id: 'hydration-provider',
            intro: 'Understand how the HydrationProvider supplies metadata to your components.',
            summary: 'Hydration provider.',
            title: 'Hydration Provider',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: partialHydrationApiExample,
                    label: 'Public entry points',
                    language: 'ts',
                  },
                ],
                id: 'entry-points',
                paragraphs: [
                  'The package surface is focused on three main exports: the client-side hydration engine, the SSR metadata binder, and the isomorphic ID helper.',
                ],
                title: 'Entry points',
              },
              {
                bullets: [
                  '`createHydration(options)` takes one `HydrationOptions` object.',
                  '`options.components` maps each `data-component` value to `{ Component, on, render, config? }`.',
                  'Returns a controller with `init(context)` and `clearAllObservers()`. `init(context)` accepts `document` or a specific `HTMLElement`.',
                ],
                id: 'create-hydration-api',
                paragraphs: [
                  'Use `createHydration` to define your client-side activation logic. It is framework-agnostic, meaning you define exactly how each component is rendered in the `render` callback.',
                ],
                title: 'createHydration',
              },
              {
                bullets: [
                  '`HydrationProvider({ componentId, children })` takes one hydration unit id and a subtree.',
                  '`componentId` seeds the stable id namespace used by `useIsomorphicId()` inside that subtree.',
                  'Use it directly when you need a custom wrapper shape instead of the default `withHydration()` markup helper.',
                ],
                id: 'hydration-provider-api',
                paragraphs: [
                  'This provider is the metadata bridge between server markup and client hydration. Most React setups get it automatically through `withHydration()`.',
                ],
                title: 'HydrationProvider',
              },
              {
                bullets: [
                  '`useIsomorphicId()` takes no parameters.',
                  'Returns a stable string id derived from the current hydration unit and an internal counter.',
                  'Use it for `id`, `htmlFor`, and aria relationships that must match between server HTML and the hydrated client tree.',
                ],
                id: 'use-isomorphic-id-api',
                paragraphs: [
                  'This hook keeps accessibility ids deterministic across the server-rendered and hydrated passes.',
                ],
                title: 'useIsomorphicId',
              },
              {
                bullets: [
                  '`withHydration(Component, config?)` takes the React component to wrap and an optional wrapper config.',
                  '`config?.modifiers` adds wrapper classes. `config?.attributes` adds extra HTML attributes to the generated wrapper element.',
                  'Returns a wrapped React component that serializes props and emits the matching `data-component={Component.displayName}` markup during SSR.',
                ],
                id: 'with-hydration-api',
                paragraphs: [
                  'Use `withHydration` during SSR to ensure that the client-side loader has all the data it needs to activate the component without a full page re-render. The client-side `components` key must match the wrapped component `displayName` because that is what ends up in `data-component`.',
                ],
                title: 'withHydration',
              },
              {
                bullets: [
                  '`withHydrationProvider(props, Component)` takes provider props plus the component to wrap.',
                  '`props.componentId` defines the hydration unit id that should be exposed to the subtree.',
                  'Returns a component already wrapped in `HydrationProvider`, which is useful for custom SSR pipelines and advanced composition.',
                ],
                id: 'with-hydration-provider-api',
                paragraphs: [
                  'This helper is the low-level provider HOC. It is most useful when the hydration metadata already exists and you only need to reapply it around a component boundary.',
                ],
                title: 'withHydrationProvider',
              },
            ],
            eyebrow: 'Guides',
            id: 'api-reference',
            intro:
              'The package provides a minimal but powerful API for implementing the Islands Architecture in your project.',
            summary: 'Core factory and bindings reference.',
            title: 'API Reference',
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
                    code: partialHydrationCompleteExample,
                    label: 'Complete React Setup',
                    language: 'ts',
                  },
                ],
                id: 'complete-setup',
                paragraphs: [
                  'This example demonstrates a complete React setup. It mixes non-lazy components for critical UI (like Navigation) with lazy components that only load when they enter the viewport.',
                ],
                title: 'Mix Lazy and Non-Lazy Components',
              },
            ],
            eyebrow: 'Examples',
            id: 'example-complete-setup',
            intro:
              'See how to orchestrate a full page with both immediate and deferred hydration strategies.',
            summary: 'Complete setup mixing lazy and non-lazy components.',
            title: 'Complete Setup',
          },
        ],
        title: 'Examples',
      },
    ],
    title: 'Partial Hydration',
  },
  {
    accent: 'pink',
    description: 'A curated collection of high-performance CSS animations for modern web interfaces.',
    githubPath: 'packages/css-animations',
    id: 'css-animations',
    npm: '@veams/css-animations',
    sections: [
      {
        id: 'getting-started',
        pages: [
          {
            blocks: [
              {
                featureCards: [
                  {
                    description: 'A collection of layout and page transition animations designed for modern interfaces.',
                    title: 'In/Out Animations',
                    visual: 'css-animations-architecture',
                  },
                ],
                id: 'overview-intro',
                paragraphs: [
                  '@veams/css-animations provides a curated set of high-performance CSS animations designed for the VEAMS ecosystem. It is available as SCSS mixins, pre-compiled CSS, and TypeScript constants for type-safe usage.',
                ],
                title: 'High-Performance Animations',
              },
            ],
            eyebrow: 'Getting Started',
            heroBullets: [
              'SCSS mixins for maximum flexibility.',
              'Pre-compiled CSS for quick integration.',
              'Type-safe TypeScript constants for class names.',
            ],
            heroParagraphs: [
              'VEAMS CSS Animations is more than just a stylesheet. It is a structured library of performance-optimized animations that follow the VEAMS methodology, ensuring smooth transitions and feedback effects with minimal impact on frame rates.',
            ],
            id: 'overview',
            intro: 'Curated CSS animations for modern web interfaces.',
            summary: 'Smooth transitions and feedback effects.',
            title: 'Overview',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: 'npm install @veams/css-animations',
                    label: 'Install',
                    language: 'bash',
                  },
                ],
                id: 'installation',
                paragraphs: [
                  'Install the package via npm to start using the animations in your project. The package includes SCSS sources, compiled CSS, and TypeScript types.',
                ],
                title: 'Installation',
              },
            ],
            eyebrow: 'Getting Started',
            id: 'install',
            intro: 'Add the animations package to your project.',
            summary: 'Get started with CSS animations.',
            title: 'Installation',
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
                    code: cssAnimationsScssUsage,
                    label: 'SCSS usage',
                    language: 'scss',
                  },
                ],
                id: 'scss-usage',
                paragraphs: [
                  'For Sass users, the package provides a highly modular set of mixins. You can import the full bundle or just the specific variables, mixins, and animations you need to keep your CSS footprint small.',
                  'When using feedback animations, remember to include `@include fb-setup;` on the target element to initialize the required pseudo-element styling.',
                ],
                title: 'SCSS Mixins',
              },
              {
                codeExamples: [
                  {
                    code: cssAnimationsCssUsage,
                    label: 'CSS usage',
                    language: 'css',
                  },
                ],
                id: 'css-usage',
                paragraphs: [
                  'If you prefer plain CSS, the package ships with pre-compiled versions of every animation. These files include both the `@keyframes` definitions and a corresponding utility class (e.g., `.fb-border-simple`).',
                ],
                title: 'Pre-compiled CSS',
              },
            ],
            eyebrow: 'Guides',
            id: 'usage',
            intro: 'Learn how to integrate animations via SCSS mixins or plain CSS imports.',
            summary: 'Mixins and CSS imports.',
            title: 'Usage Guide',
          },
          {
            blocks: [
              {
                codeExamples: [
                  {
                    code: cssAnimationsTsUsage,
                    label: 'TypeScript usage',
                    language: 'ts',
                  },
                ],
                id: 'ts-usage',
                paragraphs: [
                  'To avoid typos and enable IDE autocompletion, the package exports an `ANIMATIONS` constant. This is particularly useful in component-based frameworks where you might want to toggle animation classes dynamically.',
                ],
                title: 'TypeScript Constants',
              },
            ],
            eyebrow: 'Guides',
            id: 'typescript-usage',
            intro: 'Use type-safe constants to toggle animation classes in your components.',
            summary: 'Constants for type-safe class names.',
            title: 'TypeScript Usage',
          },
          {
            blocks: [
              {
                paragraphs: [
                  'This package does not expose runtime functions. The public API is a small set of constants, types, and stylesheet entry points.',
                ],
                id: 'entry-points',
                title: 'Entry points',
              },
              {
                bullets: [
                  '`ANIMATIONS` is the runtime constant export from the root package.',
                  'It groups animation class names under `IN_OUT` and `FEEDBACK`, with nested categories such as `CAROUSEL`, `MOVE`, and `SCALE`.',
                  'Use it when components should reference animation class names without hard-coded strings.',
                ],
                id: 'animations-constant',
                paragraphs: [
                  'This is the main JavaScript-facing API surface. It gives you a typed object tree for class names instead of requiring string literals throughout the app.',
                ],
                title: 'ANIMATIONS',
              },
              {
                bullets: [
                  '`AnimationName` is the exported union type of all values inside `ANIMATIONS`.',
                  'Use it when props, helpers, or configuration objects should only accept valid animation class names.',
                  'It stays in sync with the constant tree because the type is derived from `ANIMATIONS`.',
                ],
                id: 'animation-name-type',
                paragraphs: [
                  'This is the type-safe counterpart to the `ANIMATIONS` constant and the main TypeScript reference surface of the package.',
                ],
                title: 'AnimationName',
              },
              {
                bullets: [
                  'Import `@veams/css-animations/animations/*` when you want one specific animation stylesheet instead of the whole bundle.',
                  'The package exports Sass subpaths for source-level composition and CSS subpaths for built styles.',
                  'Use these subpaths when bundle size or stylesheet ownership matters more than one-shot convenience.',
                ],
                id: 'animations-subpath',
                paragraphs: [
                  'The wildcard animation subpath is the granular import surface of the package. It exists so teams can compose only the animations they actually ship.',
                ],
                title: 'animations/*',
              },
              {
                bullets: [
                  'Import `@veams/css-animations/index.css` when you want the compiled bundle directly.',
                  'This is the quickest path for non-Sass setups or prototypes that just need the shipped CSS classes and keyframes.',
                  'Use it when you do not need Sass composition or per-animation imports.',
                ],
                id: 'index-css-entry',
                paragraphs: [
                  'The compiled CSS entry is the plain-CSS distribution surface of the package.',
                ],
                title: 'index.css',
              },
              {
                bullets: [
                  'Import `@veams/css-animations/mixins` when Sass files should consume the package mixins directly.',
                  'This is the entry point for shared animation mixins such as the feedback setup helpers.',
                  'Use it when a project wants to compose package behavior into its own Sass architecture instead of only consuming compiled CSS.',
                ],
                id: 'mixins-entry',
                paragraphs: [
                  'The mixins entry is the composition-oriented Sass surface of the package.',
                ],
                title: 'mixins',
              },
              {
                codeExamples: [
                  {
                    code: cssAnimationsVarsUsage,
                    label: 'CSS Variables',
                    language: 'css',
                  },
                ],
                bullets: [
                  'Import `@veams/css-animations/variables` when Sass files need the package variable definitions.',
                  'The runtime CSS also respects the exposed custom properties, so values can be overridden in `:root` or a local scope.',
                  'Use this entry when a team wants theming or timing overrides without forking the animation source.',
                ],
                id: 'variables-entry',
                paragraphs: [
                  'The variables entry is the customization surface of the package. It is how you change timing, easing, or colors while staying on the supported public API.',
                ],
                title: 'variables',
              },
            ],
            eyebrow: 'Guides',
            id: 'api-reference',
            intro:
              'Use the root export for constants and types, then pick the stylesheet entry point that matches your build pipeline.',
            summary: 'Constants, types, and style entry points.',
            title: 'API Reference',
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
                id: 'showcase',
                liveExample: 'css-animations-showcase',
                paragraphs: [
                  'Interact with all available animations in this showcase. Hit the button next to each animation name to see it in action on the preview element.',
                ],
                title: 'Interactive Showcase',
              },
            ],
            eyebrow: 'Examples',
            id: 'showcase',
            intro: 'Preview all available animations in real-time.',
            summary: 'Live animation showcase.',
            title: 'Animation Showcase',
          },
        ],
        title: 'Examples',
      },
    ],
    title: 'CSS Animations',
  },
];

export const defaultPackage =
  docsPackages.find((entry) => entry.id === 'ecosystem') ?? docsPackages[0];
export const defaultPage = defaultPackage.sections[0].pages[0];
export const defaultPath = '/';

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
