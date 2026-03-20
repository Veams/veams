import {
  makeStateSingleton,
  SignalStateHandler,
  type StateSubscriptionHandler,
} from '@veams/status-quo';
import {
  StateProvider,
  useProvidedStateActions,
  useProvidedStateSubscription,
  useStateActions,
  useStateFactory,
  useStateHandler,
  useStateSingleton,
  useStateSubscription,
} from '@veams/status-quo/react';
import { useRef, type ReactNode } from 'react';

import { CodeBlock } from './CodeBlock';

import type { CodeExample, LiveExampleId } from '../content/site';

type LiveExampleProps = {
  id: LiveExampleId;
  sourceExamples?: CodeExample[];
};

function ExampleChrome({
  children,
  eyebrow,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="live-example">
      <div className="live-example-header">
        <p className="eyebrow">{eyebrow}</p>
        <h4>{title}</h4>
      </div>
      {children}
    </div>
  );
}

function ExampleCard({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="example-counter-card">
      <p className="example-counter-title">{title}</p>
      {children}
    </section>
  );
}

function RenderMeta({ detail, value }: { detail: string; value: string }) {
  return (
    <p className="example-counter-meta">
      <span>{detail}</span>
      <strong>{value}</strong>
    </p>
  );
}

function StatGrid({
  items,
}: {
  items: Array<{
    label: string;
    value: string;
  }>;
}) {
  return (
    <div className="example-stat-grid">
      {items.map((item) => (
        <div className="example-stat" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

function ChipButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`example-chip-button${active ? ' is-active' : ''}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

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

class DraftNoteHandler extends SignalStateHandler<DraftState, DraftActions> {
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
}

function LocalDraftExample() {
  const [state, actions] = useStateFactory(() => new DraftNoteHandler(), []);

  return (
    <ExampleChrome eyebrow="Working Example" title="Local draft state owned by one component">
      <div className="example-counter-layout example-two-column-layout">
        <ExampleCard title="Editor">
          <label className="example-field">
            <span>Title</span>
            <input
              onChange={(event) => actions.setTitle(event.target.value)}
              type="text"
              value={state.title}
            />
          </label>
          <label className="example-field">
            <span>Summary</span>
            <textarea
              onChange={(event) => actions.setSummary(event.target.value)}
              rows={4}
              value={state.summary}
            />
          </label>
          <div className="example-counter-actions">
            <button onClick={actions.toggleTone} type="button">
              Tone: {state.tone}
            </button>
            <button onClick={actions.reset} type="button">
              Reset
            </button>
          </div>
        </ExampleCard>

        <ExampleCard title="Preview">
          <div className="example-chip-row">
            <span className="example-chip">{state.tone}</span>
            <span className="example-chip">{state.summary.length} chars</span>
          </div>
          <p className="example-note-heading">{state.title}</p>
          <p className="example-note-copy">{state.summary}</p>
        </ExampleCard>
      </div>
    </ExampleChrome>
  );
}

type WorkspaceState = {
  density: 'comfortable' | 'compact';
  layout: 'board' | 'list';
};

type WorkspaceActions = {
  reset: () => void;
  toggleDensity: () => void;
  toggleLayout: () => void;
};

class WorkspacePreferencesHandler extends SignalStateHandler<WorkspaceState, WorkspaceActions> {
  constructor() {
    super({
      initialState: {
        density: 'comfortable',
        layout: 'board',
      },
    });
  }

  getActions(): WorkspaceActions {
    return {
      reset: () =>
        this.setState({ density: 'comfortable', layout: 'board' }, 'reset'),
      toggleDensity: () =>
        this.setState(
          {
            density: this.getState().density === 'comfortable' ? 'compact' : 'comfortable',
          },
          'toggle-density'
        ),
      toggleLayout: () =>
        this.setState(
          { layout: this.getState().layout === 'board' ? 'list' : 'board' },
          'toggle-layout'
        ),
    };
  }
}

const workspacePreferencesSingleton = makeStateSingleton(
  () => new WorkspacePreferencesHandler()
);

function WorkspaceToolbarCard() {
  const [state, actions] = useStateSingleton(workspacePreferencesSingleton);

  return (
    <ExampleCard title="Toolbar consumer">
      <div className="example-chip-row">
        <span className="example-chip">Layout: {state.layout}</span>
        <span className="example-chip">Density: {state.density}</span>
      </div>
      <div className="example-counter-actions">
        <button onClick={actions.toggleLayout} type="button">
          Toggle layout
        </button>
        <button onClick={actions.toggleDensity} type="button">
          Toggle density
        </button>
      </div>
    </ExampleCard>
  );
}

function WorkspaceSummaryCard() {
  const [state, actions] = useStateSingleton(workspacePreferencesSingleton);

  return (
    <ExampleCard title="Summary consumer">
      <StatGrid
        items={[
          { label: 'Cards', value: state.layout === 'board' ? '12 lanes' : '12 rows' },
          { label: 'Spacing', value: state.density === 'comfortable' ? '24 px' : '12 px' },
        ]}
      />
      <RenderMeta detail="Shared snapshot" value={`${state.layout} / ${state.density}`} />
      <div className="example-counter-actions">
        <button onClick={actions.reset} type="button">
          Reset singleton
        </button>
      </div>
    </ExampleCard>
  );
}

function SingletonWorkspaceExample() {
  return (
    <ExampleChrome eyebrow="Working Example" title="Two consumers bound to one singleton">
      <div className="example-counter-layout example-counter-layout-shared">
        <WorkspaceToolbarCard />
        <WorkspaceSummaryCard />
      </div>
    </ExampleChrome>
  );
}

type QueueState = {
  batchSize: 1 | 3;
  processed: number;
  queued: number;
};

type QueueActions = {
  enqueue: () => void;
  reset: () => void;
  runBatch: () => void;
  setBatchSize: (batchSize: 1 | 3) => void;
};

class BatchQueueHandler extends SignalStateHandler<QueueState, QueueActions> {
  constructor() {
    super({
      initialState: {
        batchSize: 1,
        processed: 0,
        queued: 5,
      },
    });
  }

  getActions(): QueueActions {
    return {
      enqueue: () => this.setState({ queued: this.getState().queued + 1 }, 'enqueue'),
      reset: () => this.setState({ batchSize: 1, processed: 0, queued: 5 }, 'reset'),
      runBatch: () => {
        const { batchSize, processed, queued } = this.getState();
        const moved = Math.min(batchSize, queued);

        this.setState(
          {
            processed: processed + moved,
            queued: queued - moved,
          },
          'run-batch'
        );
      },
      setBatchSize: (batchSize) => this.setState({ batchSize }, 'set-batch-size'),
    };
  }
}

const createBatchQueueHandler = () => new BatchQueueHandler();
type QueueHandler = StateSubscriptionHandler<QueueState, QueueActions>;

function QueueSummaryCard({ handler }: { handler: QueueHandler }) {
  const [summary] = useStateSubscription(handler, (state) => ({
    batchSize: state.batchSize,
    processed: state.processed,
    queued: state.queued,
  }));

  return (
    <ExampleCard title="Summary subscriber">
      <StatGrid
        items={[
          { label: 'Queued', value: String(summary.queued) },
          { label: 'Processed', value: String(summary.processed) },
          { label: 'Batch', value: String(summary.batchSize) },
        ]}
      />
      <p className="example-note-copy">
        This component only knows the slice it renders.
      </p>
    </ExampleCard>
  );
}

function QueueControlsCard({ handler }: { handler: QueueHandler }) {
  const actions = useStateActions(handler);
  const [batchSize] = useStateSubscription(handler, (state) => state.batchSize);

  return (
    <ExampleCard title="Action composition">
      <div className="example-chip-row">
        <ChipButton active={batchSize === 1} onClick={() => actions.setBatchSize(1)}>
          Batch 1
        </ChipButton>
        <ChipButton active={batchSize === 3} onClick={() => actions.setBatchSize(3)}>
          Batch 3
        </ChipButton>
      </div>
      <div className="example-counter-actions">
        <button onClick={actions.enqueue} type="button">
          Enqueue
        </button>
        <button onClick={actions.runBatch} type="button">
          Run batch
        </button>
        <button onClick={actions.reset} type="button">
          Reset
        </button>
      </div>
      <p className="example-note-copy">
        Actions come from `useStateActions()`. Batch selection comes from a separate subscription.
      </p>
    </ExampleCard>
  );
}

function CompositionQueueExample() {
  const handler = useStateHandler(createBatchQueueHandler, []);

  return (
    <ExampleChrome eyebrow="Working Example" title="Base hooks composed on purpose">
      <div className="example-counter-layout example-counter-layout-shared">
        <QueueSummaryCard handler={handler} />
        <QueueControlsCard handler={handler} />
      </div>
    </ExampleChrome>
  );
}

type WizardState = {
  completed: number;
  step: number;
  totalSteps: number;
};

type WizardActions = {
  completeStep: () => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
};

class WizardFlowHandler extends SignalStateHandler<WizardState, WizardActions> {
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

const createWizardFlowHandler = () => new WizardFlowHandler();

function WizardProgressCard() {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const [state] = useProvidedStateSubscription<WizardState, WizardActions>();

  return (
    <ExampleCard title="Progress reader">
      <StatGrid
        items={[
          { label: 'Step', value: `${state.step} / ${state.totalSteps}` },
          { label: 'Completed', value: String(state.completed) },
        ]}
      />
      <RenderMeta detail="Render count" value={String(renderCountRef.current)} />
    </ExampleCard>
  );
}

function WizardActionsCard() {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const actions = useProvidedStateActions<WizardState, WizardActions>();

  return (
    <ExampleCard title="Action-only reader">
      <p className="example-note-copy">
        This card does not subscribe to state. It only reads provider-scoped actions.
      </p>
      <RenderMeta detail="Render count" value={String(renderCountRef.current)} />
      <div className="example-counter-actions">
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
      </div>
    </ExampleCard>
  );
}

function ProviderWizardExample() {
  const handler = useStateHandler(createWizardFlowHandler, []);

  return (
    <ExampleChrome eyebrow="Working Example" title="One local handler shared through provider scope">
      <StateProvider instance={handler}>
        <div className="example-counter-layout example-counter-layout-shared">
          <WizardProgressCard />
          <WizardActionsCard />
        </div>
      </StateProvider>
    </ExampleChrome>
  );
}

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

class ProfileHandler extends SignalStateHandler<ProfileState, ProfileActions> {
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

const createProfileHandler = () => new ProfileHandler();
type ProfileHandlerInstance = StateSubscriptionHandler<ProfileState, ProfileActions>;

function SelectorIdentityCard({ handler }: { handler: ProfileHandlerInstance }) {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const [identity] = useStateSubscription(
    handler,
    (state) => ({
      name: state.profile.name,
      role: state.profile.role,
    }),
    (current, next) => current.name === next.name && current.role === next.role
  );

  return (
    <ExampleCard title="Selector + equality">
      <p className="example-note-heading">
        {identity.name} <span className="example-inline-muted">({identity.role})</span>
      </p>
      <p className="example-note-copy">
        This card returns a new object from the selector, but the equality function keeps it quiet
        while only `theme` or `saves` change.
      </p>
      <RenderMeta detail="Render count" value={String(renderCountRef.current)} />
    </ExampleCard>
  );
}

function SelectorDiagnosticsCard({ handler }: { handler: ProfileHandlerInstance }) {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const [state] = useStateSubscription(handler);

  return (
    <ExampleCard title="Full snapshot subscriber">
      <StatGrid
        items={[
          { label: 'Theme', value: state.ui.theme },
          { label: 'Saves', value: String(state.ui.saves) },
        ]}
      />
      <p className="example-note-copy">
        This card listens to the whole snapshot, so every state change rerenders it.
      </p>
      <RenderMeta detail="Render count" value={String(renderCountRef.current)} />
    </ExampleCard>
  );
}

function SelectorControlsCard({ handler }: { handler: ProfileHandlerInstance }) {
  const actions = useStateActions(handler);

  return (
    <ExampleCard title="Actions">
      <div className="example-counter-actions">
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
      </div>
    </ExampleCard>
  );
}

function SelectorProfileExample() {
  const handler = useStateHandler(createProfileHandler, []);

  return (
    <ExampleChrome eyebrow="Working Example" title="Selector optimization you can see">
      <div className="example-counter-layout example-counter-layout-shared">
        <SelectorIdentityCard handler={handler} />
        <SelectorDiagnosticsCard handler={handler} />
      </div>
      <SelectorControlsCard handler={handler} />
    </ExampleChrome>
  );
}

export function LiveExample({ id, sourceExamples }: LiveExampleProps) {
  let preview: ReactNode = null;

  switch (id) {
    case 'status-quo-local-draft':
      preview = <LocalDraftExample />;
      break;
    case 'status-quo-singleton-workspace':
      preview = <SingletonWorkspaceExample />;
      break;
    case 'status-quo-composition-queue':
      preview = <CompositionQueueExample />;
      break;
    case 'status-quo-provider-wizard':
      preview = <ProviderWizardExample />;
      break;
    case 'status-quo-selector-profile':
      preview = <SelectorProfileExample />;
      break;
  }

  return (
    <div className="live-example-stack">
      {preview}
      {sourceExamples?.length ? (
        <div className="live-example-source">
          <p className="live-example-source-label">Source</p>
          <div className="code-grid">
            {sourceExamples.map((example, index) => (
              <CodeBlock
                example={{ ...example, label: sourceExamples.length === 1 ? 'Source' : example.label }}
                key={`${id}-source-${index + 1}`}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
