export const statusQuoQuickStartHandler = `import { NativeStateHandler } from '@veams/status-quo';

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

export const statusQuoQuickStartComponent = `import { useStateFactory } from '@veams/status-quo/react';

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

export const statusQuoSingletonHandlerExample = `import {
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

export const statusQuoSingletonComponentExample = `import { useStateSingleton } from '@veams/status-quo/react';

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

export const statusQuoProviderHandlerExample = `import { NativeStateHandler } from '@veams/status-quo';

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

export const statusQuoProviderComponentExample = `import {
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

export const statusQuoSelectorExample = `const [identity] = useStateSubscription(
  handler,
  (state) => ({
    name: state.profile.name,
    role: state.profile.role,
  }),
  (current, next) => current.name === next.name && current.role === next.role
);`;

export const statusQuoBindSubscribableExample = `import { SignalStateHandler } from '@veams/status-quo/signals';

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
  constructor(private readonly source: CounterHandler) {
    super({
      initialState: {
        bucket: 0,
      },
    });
  }

  protected override onConnect(): void {
    this.bindSubscribable(
      this.source,
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

export const statusQuoNamedBindSubscribableExample = `import {
  NativeStateHandler,
} from '@veams/status-quo';

type ListItem = {
  id: string;
  label: string;
  detail: string;
};

type ListState = {
  items: Array<Pick<ListItem, 'id' | 'label'>>;
  selectedId: string | null;
  selectedItem: ListItem | null;
};

type ListActions = {
  selectItem: (params: { id: string }) => void;
};

declare function getList(): {
  subscribe: (
    listener: (value: { items: Array<Pick<ListItem, 'id' | 'label'>> }) => void
  ) => () => void;
  getSnapshot: () => { items: Array<Pick<ListItem, 'id' | 'label'>> };
};

declare function getListItem(id: string): {
  subscribe: (listener: (value: ListItem | null) => void) => () => void;
  getSnapshot: () => ListItem | null;
};

class ListHandler extends NativeStateHandler<ListState, ListActions> {
  constructor() {
    super({
      initialState: {
        items: [],
        selectedId: null,
        selectedItem: null,
      },
    });
  }

  protected override onConnect(): void {
    // Unnamed binding: stable for the active connection lifetime.
    this.bindSubscribable(
      getList(),
      (snapshot) => {
        this.setState({ items: snapshot.items }, 'sync-list');
      },
      (current, next) => current.items === next.items
    );
  }

  getActions(): ListActions {
    return {
      selectItem: (params) => {
        this.setState({ selectedId: params.id }, 'select-item');

        // Named binding: selecting a new item replaces the previous item subscription.
        this.bindSubscribable('item', getListItem(params.id), (selectedItem) => {
          this.setState({ selectedItem }, 'sync-selected-item');
        });

        // Handlers can inspect active named bindings when needed.
        this.namedSubscriptions.has('item');
      },
    };
  }
}`;

export const statusQuoGlobalSetup = `import { setupStatusQuo } from '@veams/status-quo';

setupStatusQuo({
  devTools: {
    enabled: true,
  },
  distinct: {
    enabled: true,
    comparator: (previous, next) => JSON.stringify(previous) === JSON.stringify(next), // as simple overwrite example
  },
});`;
