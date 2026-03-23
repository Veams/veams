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
import { ANIMATIONS, type AnimationName } from '@veams/css-animations';
import createVent from '@veams/vent';
import { VentProvider, useVent, useVentSubscribe } from '@veams/vent/react';
import { useState, useRef, type ReactNode } from 'react';

import { CodeBlock } from './CodeBlock';

import type { CodeExample, LiveExampleId } from '../content/site';

type LiveExampleProps = {
  id: LiveExampleId;
  sourceExamples?: CodeExample[];
};

type ReleaseChannel = 'docs' | 'ops' | 'ui';

type VentExampleTopic = 'release:queued' | 'release:clear';

type VentMessage = {
  channel: ReleaseChannel;
  text: string;
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

type SharedCounterState = {
  count: number;
};

type SharedCounterActions = {
  decrement: () => void;
  increment: () => void;
  incrementByFive: () => void;
  reset: () => void;
};

class SharedCounterHandler extends SignalStateHandler<SharedCounterState, SharedCounterActions> {
  constructor() {
    super({
      initialState: {
        count: 0,
      },
    });
  }

  getActions(): SharedCounterActions {
    return {
      decrement: () => this.setState({ count: this.getState().count - 1 }, 'decrement'),
      increment: () => this.setState({ count: this.getState().count + 1 }, 'increment'),
      incrementByFive: () => this.setState({ count: this.getState().count + 5 }, 'increment-by-five'),
      reset: () => this.setState({ count: 0 }, 'reset'),
    };
  }
}

const sharedCounterSingleton = makeStateSingleton(
  () => new SharedCounterHandler()
);

function CounterControlsCard() {
  const [state, actions] = useStateSingleton(sharedCounterSingleton);

  return (
    <ExampleCard title="Controls consumer">
      <div className="example-chip-row">
        <span className="example-chip">Count: {state.count}</span>
        <span className="example-chip">{state.count % 2 === 0 ? 'even' : 'odd'}</span>
      </div>
      <div className="example-counter-actions">
        <button onClick={actions.decrement} type="button">
          -1
        </button>
        <button onClick={actions.increment} type="button">
          +1
        </button>
        <button onClick={actions.incrementByFive} type="button">
          +5
        </button>
      </div>
    </ExampleCard>
  );
}

function CounterSummaryCard() {
  const [state, actions] = useStateSingleton(sharedCounterSingleton);

  return (
    <ExampleCard title="Summary consumer">
      <StatGrid
        items={[
          { label: 'Shared count', value: String(state.count) },
          { label: 'Absolute', value: String(Math.abs(state.count)) },
        ]}
      />
      <RenderMeta detail="Shared snapshot" value={state.count === 0 ? 'idle' : 'changed'} />
      <div className="example-counter-actions">
        <button onClick={actions.reset} type="button">
          Reset singleton
        </button>
      </div>
    </ExampleCard>
  );
}

function SingletonCounterExample() {
  return (
    <ExampleChrome eyebrow="Working Example" title="Counter shared by two consumers">
      <div className="example-counter-layout example-counter-layout-shared">
        <CounterControlsCard />
        <CounterSummaryCard />
      </div>
    </ExampleChrome>
  );
}

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

class ChecklistHandler extends SignalStateHandler<ChecklistState, ChecklistActions> {
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

const createChecklistHandler = () => new ChecklistHandler();
type ChecklistHandlerInstance = StateSubscriptionHandler<ChecklistState, ChecklistActions>;

function ChecklistSummaryCard({ handler }: { handler: ChecklistHandlerInstance }) {
  const [completed] = useStateSubscription(handler, (state) => state.completed);
  const [total] = useStateSubscription(handler, (state) => state.total);
  const open = total - completed;
  const progress = `${Math.round((completed / Math.max(total, 1)) * 100)}%`;

  return (
    <ExampleCard title="Summary subscriber">
      <StatGrid
        items={[
          { label: 'Done', value: String(completed) },
          { label: 'Open', value: String(open) },
          { label: 'Progress', value: progress },
        ]}
      />
      <p className="example-note-copy">
        This component only knows the slice it renders.
      </p>
    </ExampleCard>
  );
}

function ChecklistControlsCard({ handler }: { handler: ChecklistHandlerInstance }) {
  const actions = useStateActions(handler);
  const [canComplete] = useStateSubscription(handler, (state) => state.completed < state.total);
  const [canReopen] = useStateSubscription(handler, (state) => state.completed > 0);

  return (
    <ExampleCard title="Action composition">
      <div className="example-counter-actions">
        <button disabled={!canComplete} onClick={actions.complete} type="button">
          Complete one
        </button>
        <button disabled={!canReopen} onClick={actions.reopen} type="button">
          Reopen one
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

function CompositionChecklistExample() {
  const handler = useStateHandler(createChecklistHandler, []);

  return (
    <ExampleChrome eyebrow="Working Example" title="Simple checklist with base hooks">
      <div className="example-counter-layout example-counter-layout-shared">
        <ChecklistSummaryCard handler={handler} />
        <ChecklistControlsCard handler={handler} />
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
      <div className="example-counter-layout example-two-column-layout">
        <SelectorIdentityCard handler={handler} />
        <SelectorDiagnosticsCard handler={handler} />
      </div>
      <SelectorControlsCard handler={handler} />
    </ExampleChrome>
  );
}

const ventChannelLabels: Record<ReleaseChannel, string> = {
  docs: 'Docs',
  ops: 'Ops',
  ui: 'UI',
};

function VentComposerCard() {
  const vent = useVent<VentExampleTopic, VentMessage>();
  const [channel, setChannel] = useState<ReleaseChannel>('docs');
  const [message, setMessage] = useState('Ship the Vent docs page before the form package.');

  const publish = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    vent.publish('release:queued', {
      channel,
      text: trimmedMessage,
    });
  };

  return (
    <ExampleCard title="Publisher">
      <div className="example-chip-row">
        {(Object.keys(ventChannelLabels) as ReleaseChannel[]).map((entry) => (
          <ChipButton
            active={channel === entry}
            key={entry}
            onClick={() => setChannel(entry)}
          >
            {ventChannelLabels[entry]}
          </ChipButton>
        ))}
      </div>
      <label className="example-field">
        <span>Message</span>
        <textarea
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          value={message}
        />
      </label>
      <div className="example-counter-actions">
        <button onClick={publish} type="button">
          Publish event
        </button>
        <button
          onClick={() => {
            vent.publish('release:clear', {
              channel,
              text: '',
            });
          }}
          type="button"
        >
          Clear subscribers
        </button>
      </div>
      <p className="example-note-copy">
        This card only publishes events. It never touches subscriber state directly.
      </p>
    </ExampleCard>
  );
}

function VentActivityCard() {
  const [entries, setEntries] = useState<VentMessage[]>([]);

  useVentSubscribe<VentExampleTopic, VentMessage>('release:queued', (payload) => {
    setEntries((currentEntries) => [payload, ...currentEntries].slice(0, 4));
  });

  useVentSubscribe<VentExampleTopic, VentMessage>('release:clear', () => {
    setEntries([]);
  });

  return (
    <ExampleCard title="Activity feed">
      {entries.length > 0 ? (
        <div className="content-stack">
          {entries.map((entry, index) => (
            <div className="example-stat" key={`${entry.channel}-${entry.text}-${index + 1}`}>
              <span>{ventChannelLabels[entry.channel]}</span>
              <strong>{entry.text}</strong>
            </div>
          ))}
        </div>
      ) : (
        <p className="example-note-copy">
          Publish an event to see independent subscribers react.
        </p>
      )}
    </ExampleCard>
  );
}

function VentMetricsCard() {
  const [metrics, setMetrics] = useState<Record<ReleaseChannel, number>>({
    docs: 0,
    ops: 0,
    ui: 0,
  });

  useVentSubscribe<VentExampleTopic, VentMessage>('release:queued', (payload) => {
    setMetrics((currentMetrics) => ({
      ...currentMetrics,
      [payload.channel]: currentMetrics[payload.channel] + 1,
    }));
  });

  useVentSubscribe<VentExampleTopic, VentMessage>('release:clear', () => {
    setMetrics({
      docs: 0,
      ops: 0,
      ui: 0,
    });
  });

  const total = metrics.docs + metrics.ops + metrics.ui;
  const busiestChannel = (Object.entries(metrics) as Array<[ReleaseChannel, number]>).sort(
    (current, next) => next[1] - current[1]
  )[0];

  return (
    <ExampleCard title="Independent subscriber">
      <StatGrid
        items={[
          { label: 'Total', value: String(total) },
          { label: 'Docs', value: String(metrics.docs) },
          { label: 'Ops', value: String(metrics.ops) },
          { label: 'UI', value: String(metrics.ui) },
        ]}
      />
      <RenderMeta
        detail="Busiest channel"
        value={busiestChannel[1] > 0 ? ventChannelLabels[busiestChannel[0]] : 'none'}
      />
      <p className="example-note-copy">
        Metrics update from the same events without coupling to the feed.
      </p>
    </ExampleCard>
  );
}

function VentReleaseBusExample() {
  const [vent] = useState(() => createVent<VentExampleTopic, VentMessage>());

  return (
    <ExampleChrome eyebrow="Working Example" title="One publisher, multiple decoupled subscribers">
      <VentProvider instance={vent}>
        <div className="example-counter-layout example-two-column-layout">
          <VentComposerCard />
          <VentActivityCard />
        </div>
        <VentMetricsCard />
      </VentProvider>
    </ExampleChrome>
  );
}

function CssAnimationsShowcase() {
  const [activeAnimation, setActiveAnimation] = useState<AnimationName | null>(null);
  const [isAnimating, setIsAnimated] = useState(false);

  const triggerAnimation = (name: AnimationName) => {
    setActiveAnimation(name);
    setIsAnimated(false);
    // Force reflow to restart animation
    setTimeout(() => setIsAnimated(true), 10);
  };

  const renderButtons = (category: Record<string, unknown> | undefined) => {
    if (!category) return null;
    return Object.entries(category).map(([key, value]) => {
      if (typeof value === 'string') {
        return (
          <ChipButton
            active={activeAnimation === value}
            key={key}
            onClick={() => triggerAnimation(value as AnimationName)}
          >
            {key.toLowerCase().replace(/_/g, '-')}
          </ChipButton>
        );
      }
      return null;
    });
  };

  const selectedImportExample = activeAnimation
    ? {
        code: `@import "@veams/css-animations/animations/${resolveAnimationImportPath(activeAnimation)}";`,
        description:
          activeAnimation.startsWith('fb-')
            ? 'Feedback effects also need `@include fb-setup;` on the animated element.'
            : 'Import only this animation when you want the smallest possible SCSS footprint.',
        label: 'SCSS import',
        language: 'scss' as const,
      }
    : null;

  return (
    <ExampleChrome eyebrow="Interactive Guide" title="All available animations">
      <div className="example-animation-showcase">
        <div className="example-animation-grid">
          <div className="example-animation-section">
            <h5>Feedback Effects</h5>
            <div className="example-animation-buttons">
              {renderButtons(ANIMATIONS.FEEDBACK)}
            </div>
          </div>

          <div className="example-animation-section">
            <h5>In/Out: Carousel</h5>
            <div className="example-animation-buttons">
              {renderButtons(ANIMATIONS.IN_OUT.CAROUSEL)}
            </div>
          </div>

          <div className="example-animation-section">
            <h5>In/Out: Cube</h5>
            <div className="example-animation-buttons">
              {renderButtons(ANIMATIONS.IN_OUT.CUBE)}
            </div>
          </div>

          <div className="example-animation-section">
            <h5>In/Out: Flip</h5>
            <div className="example-animation-buttons">
              {renderButtons(ANIMATIONS.IN_OUT.FLIP)}
            </div>
          </div>

          <div className="example-animation-section">
            <h5>In/Out: Move</h5>
            <div className="example-animation-buttons">
              {renderButtons(ANIMATIONS.IN_OUT.MOVE)}
            </div>
          </div>

          <div className="example-animation-section">
            <h5>In/Out: Room</h5>
            <div className="example-animation-buttons">
              {renderButtons(ANIMATIONS.IN_OUT.ROOM)}
            </div>
          </div>

          <div className="example-animation-section">
            <h5>In/Out: Slides</h5>
            <div className="example-animation-buttons">
              {renderButtons(ANIMATIONS.IN_OUT.SLIDES)}
            </div>
          </div>

          <div className="example-animation-section">
            <h5>In/Out: Fold</h5>
            <div className="example-animation-buttons">
              {renderButtons(ANIMATIONS.IN_OUT.FOLD)}
            </div>
          </div>

          <div className="example-animation-section">
            <h5>In/Out: Unfold</h5>
            <div className="example-animation-buttons">
              {renderButtons(ANIMATIONS.IN_OUT.UNFOLD)}
            </div>
          </div>

          <div className="example-animation-section">
            <h5>In/Out: Scale</h5>
            <div className="example-animation-buttons">
              {renderButtons(ANIMATIONS.IN_OUT.SCALE)}
            </div>
          </div>

          <div className="example-animation-section">
            <h5>In/Out: Rotate & Scale</h5>
            <div className="example-animation-buttons">
              {renderButtons(ANIMATIONS.IN_OUT.ROTATE_AND_SCALE)}
            </div>
          </div>

          <div className="example-animation-section">
            <h5>In/Out: Push & Pull</h5>
            <div className="example-animation-buttons">
              {renderButtons(ANIMATIONS.IN_OUT.PUSH_PULL)}
            </div>
          </div>

          <div className="example-animation-section">
            <h5>In/Out: Other</h5>
            <div className="example-animation-buttons">
              {renderButtons(ANIMATIONS.IN_OUT.FALL)}
              {renderButtons(ANIMATIONS.IN_OUT.NEWSPAPER)}
              {renderButtons(ANIMATIONS.IN_OUT.SIDES)}
            </div>
          </div>
        </div>

        <div className="example-animation-preview-stack">
          <div className="example-animation-preview">
            <div
              className={`example-animation-target${
                isAnimating ? ` showcase-${activeAnimation} is-animated` : ''
              }`}
              onAnimationEnd={() => setIsAnimated(false)}
            >
              {activeAnimation || 'Select an animation'}
            </div>
          </div>
          {selectedImportExample ? (
            <CodeBlock example={selectedImportExample} />
          ) : (
            <p className="example-animation-import-hint">
              Select an animation to reveal the exact import path.
            </p>
          )}
        </div>
      </div>
    </ExampleChrome>
  );
}

function resolveAnimationImportPath(name: AnimationName): string {
  if (name.startsWith('fb-')) {
    return `feedback-effects/${name}`;
  }

  if (name.startsWith('carousel-')) {
    return 'in-out-effects/io-carousel';
  }

  if (name.startsWith('cube-')) {
    return 'in-out-effects/io-cube';
  }

  if (name.startsWith('fall-')) {
    return 'in-out-effects/io-fall';
  }

  if (name.startsWith('flip-')) {
    return 'in-out-effects/io-flip';
  }

  if (name === 'fade' || name.startsWith('move-')) {
    return 'in-out-effects/io-move';
  }

  if (name.startsWith('newspaper-')) {
    return 'in-out-effects/io-newspaper';
  }

  if (name.startsWith('push-') || name.startsWith('pull-')) {
    return 'in-out-effects/io-push-and-pull';
  }

  if (name.startsWith('room-')) {
    return 'in-out-effects/io-room-walls';
  }

  if (name.startsWith('sides-')) {
    return 'in-out-effects/io-sides';
  }

  if (name.startsWith('slide-')) {
    return 'in-out-effects/io-slides';
  }

  if (name.startsWith('fold-') || name.startsWith('unfold-')) {
    return 'in-out-effects/io-fold-and-unfold';
  }

  if (name.startsWith('side-rotate-')) {
    return 'in-out-effects/io-rotate-and-scale';
  }

  if (name.startsWith('scale-')) {
    return 'in-out-effects/io-scale';
  }

  return 'in-out-effects/io-move';
}

export function LiveExample({ id, sourceExamples }: LiveExampleProps) {
  let preview: ReactNode = null;

  switch (id) {
    case 'status-quo-local-draft':
      preview = <LocalDraftExample />;
      break;
    case 'status-quo-singleton-workspace':
      preview = <SingletonCounterExample />;
      break;
    case 'status-quo-composition-checklist':
      preview = <CompositionChecklistExample />;
      break;
    case 'status-quo-provider-wizard':
      preview = <ProviderWizardExample />;
      break;
    case 'status-quo-selector-profile':
      preview = <SelectorProfileExample />;
      break;
    case 'vent-release-bus':
      preview = <VentReleaseBusExample />;
      break;
    case 'css-animations-showcase':
      preview = <CssAnimationsShowcase />;
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
