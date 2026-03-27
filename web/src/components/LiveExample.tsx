import {
  NativeStateHandler,
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
import { FormStateHandler } from '@veams/form';
import {
  Controller,
  FormProvider,
  useFormController,
  useFormMeta,
  useUncontrolledField,
} from '@veams/form/react';
import createVent from '@veams/vent';
import { VentProvider, useVent, useVentSubscribe } from '@veams/vent/react';
import { useState, useRef, type ReactNode } from 'react';

import { CodeBlock } from './CodeBlock';
import '../content/css-animations-showcase.scss';

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

type ShowcaseCategory = {
  animations: Array<{
    label: string;
    value: AnimationName;
  }>;
  id: string;
  label: string;
};

function toAnimationOptions(
  ...groups: Array<Record<string, string> | undefined>
): ShowcaseCategory['animations'] {
  return groups.flatMap((group) =>
    Object.entries(group ?? {}).flatMap(([key, value]) =>
      typeof value === 'string'
        ? [
            {
              label: key.toLowerCase().replace(/_/g, '-'),
              value: value as AnimationName,
            },
          ]
        : [],
    ),
  );
}

function toShowcaseModifierClass(name: AnimationName): string {
  return `is-css-animation-${name}`;
}

function resolveAnimationMixinName(name: AnimationName): string {
  switch (name) {
    case 'fall-rotate':
      return 'rotate-fall';
    case 'fade':
      return 'fade-it';
    case 'newspaper-rotate-in':
      return 'newspaper-in';
    case 'newspaper-rotate-out':
      return 'newspaper-out';
    default:
      return name;
  }
}

const showcaseCategories: ShowcaseCategory[] = [
  {
    animations: toAnimationOptions(ANIMATIONS.FEEDBACK),
    id: 'feedback',
    label: 'Feedback Effects',
  },
  {
    animations: toAnimationOptions(ANIMATIONS.IN_OUT.CAROUSEL),
    id: 'carousel',
    label: 'In/Out: Carousel',
  },
  {
    animations: toAnimationOptions(ANIMATIONS.IN_OUT.CUBE),
    id: 'cube',
    label: 'In/Out: Cube',
  },
  {
    animations: toAnimationOptions(ANIMATIONS.IN_OUT.FLIP),
    id: 'flip',
    label: 'In/Out: Flip',
  },
  {
    animations: toAnimationOptions(ANIMATIONS.IN_OUT.MOVE),
    id: 'move',
    label: 'In/Out: Move',
  },
  {
    animations: toAnimationOptions(ANIMATIONS.IN_OUT.ROOM),
    id: 'room',
    label: 'In/Out: Room',
  },
  {
    animations: toAnimationOptions(ANIMATIONS.IN_OUT.SLIDES),
    id: 'slides',
    label: 'In/Out: Slides',
  },
  {
    animations: toAnimationOptions(ANIMATIONS.IN_OUT.FOLD),
    id: 'fold',
    label: 'In/Out: Fold',
  },
  {
    animations: toAnimationOptions(ANIMATIONS.IN_OUT.UNFOLD),
    id: 'unfold',
    label: 'In/Out: Unfold',
  },
  {
    animations: toAnimationOptions(ANIMATIONS.IN_OUT.SCALE),
    id: 'scale',
    label: 'In/Out: Scale',
  },
  {
    animations: toAnimationOptions(ANIMATIONS.IN_OUT.ROTATE_AND_SCALE),
    id: 'rotate-and-scale',
    label: 'In/Out: Rotate & Scale',
  },
  {
    animations: toAnimationOptions(ANIMATIONS.IN_OUT.PUSH_PULL),
    id: 'push-pull',
    label: 'In/Out: Push & Pull',
  },
  {
    animations: toAnimationOptions(
      ANIMATIONS.IN_OUT.FALL,
      ANIMATIONS.IN_OUT.NEWSPAPER,
      ANIMATIONS.IN_OUT.SIDES,
    ),
    id: 'other',
    label: 'In/Out: Other',
  },
];

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
  const [selectedCategoryId, setSelectedCategoryId] = useState(showcaseCategories[0]?.id ?? '');
  const [activeAnimation, setActiveAnimation] = useState<AnimationName | null>(null);
  const [isAnimating, setIsAnimated] = useState(false);

  const triggerAnimation = (name: AnimationName) => {
    const nextCategory = showcaseCategories.find((category) =>
      category.animations.some((animation) => animation.value === name),
    );

    if (nextCategory) {
      setSelectedCategoryId(nextCategory.id);
    }
    setActiveAnimation(name);
    setIsAnimated(false);
    // Force reflow to restart animation
    setTimeout(() => setIsAnimated(true), 10);
  };

  const selectedCategory =
    showcaseCategories.find((category) => category.id === selectedCategoryId) ?? showcaseCategories[0];
  const selectedEffectValue =
    activeAnimation && selectedCategory?.animations.some((animation) => animation.value === activeAnimation)
      ? activeAnimation
      : '';

  const selectedImportExample = activeAnimation
    ? {
        code: `${activeAnimation.startsWith('fb-') ? '@use "pkg:@veams/css-animations/scss/animations/feedback-effects/fb-setup.scss" as *;\n' : ''}@use "pkg:@veams/css-animations/scss/animations/${resolveAnimationImportPath(activeAnimation)}.scss" as *;

// Optional when keyframes should live in a shared stylesheet:
// @include ${resolveAnimationMixinName(activeAnimation)}-keyframes();

.my-element {
  ${activeAnimation.startsWith('fb-') ? '@include fb-setup;\n  ' : ''}@include ${resolveAnimationMixinName(activeAnimation)};
}`,
        description:
          activeAnimation.startsWith('fb-')
            ? 'Feedback effects still need `@include fb-setup;` on the animated element. The example uses Sass `pkg:` URLs, so your toolchain must enable the Sass Node package importer.'
            : 'The example uses Sass `pkg:` URLs. Enable the Sass Node package importer when keyframes or animation modules are loaded this way.',
        label: 'SCSS usage',
        language: 'scss' as const,
      }
    : null;

  return (
    <ExampleChrome eyebrow="Interactive Guide" title="All available animations">
      <div className="example-animation-showcase">
        <div className="example-animation-grid">
          <div className="example-animation-mobile-controls">
            <div className="example-animation-mobile-field">
              <label htmlFor="animation-category">Category</label>
              <select
                id="animation-category"
                onChange={(event) => {
                  const nextCategoryId = event.target.value;
                  setSelectedCategoryId(nextCategoryId);

                  const nextCategory = showcaseCategories.find(
                    (category) => category.id === nextCategoryId,
                  );

                  if (!nextCategory?.animations.some((animation) => animation.value === activeAnimation)) {
                    setActiveAnimation(null);
                    setIsAnimated(false);
                  }
                }}
                value={selectedCategory?.id ?? ''}
              >
                {showcaseCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="example-animation-mobile-field">
              <label htmlFor="animation-effect">Effect</label>
              <select
                id="animation-effect"
                onChange={(event) => {
                  const nextAnimation = event.target.value;
                  if (nextAnimation) {
                    triggerAnimation(nextAnimation as AnimationName);
                  }
                }}
                value={selectedEffectValue}
              >
                <option value="">Select an effect</option>
                {selectedCategory?.animations.map((animation) => (
                  <option key={animation.value} value={animation.value}>
                    {animation.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {showcaseCategories.map((category) => (
            <div className="example-animation-section" key={category.id}>
              <h5>{category.label}</h5>
              <div className="example-animation-buttons">
                {category.animations.map((animation) => (
                  <ChipButton
                    active={activeAnimation === animation.value}
                    key={animation.value}
                    onClick={() => triggerAnimation(animation.value)}
                  >
                    {animation.label}
                  </ChipButton>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="example-animation-preview-stack">
          <div className="example-animation-preview">
              <div
                className={`example-animation-target${
                isAnimating && activeAnimation ? ` ${toShowcaseModifierClass(activeAnimation)} is-animated` : ''
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

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

type SimpleLoginValues = {
  email: string;
  password: string;
};

type ProfileEditorValues = {
  profile: {
    email: string;
    name: string;
  };
  settings: {
    newsletter: boolean;
  };
};

type RegisterValues = {
  account: {
    email: string;
    password: string;
  };
};

type ControlledRoleValue = '' | 'admin' | 'editor' | 'viewer';

type ValidationModeValues = {
  blurName: string;
  changeEmail: string;
  submitRole: ControlledRoleValue;
};

const controlledRoleOptions: Array<{
  description: string;
  label: string;
  value: Exclude<ControlledRoleValue, ''>;
}> = [
  {
    description: 'Full access to workflows and settings.',
    label: 'Admin',
    value: 'admin',
  },
  {
    description: 'Can refine content and publish updates.',
    label: 'Editor',
    value: 'editor',
  },
  {
    description: 'Read-only preview access for stakeholders.',
    label: 'Viewer',
    value: 'viewer',
  },
];

function ExampleTextField({
  description,
  label,
  name,
  type = 'text',
}: {
  description: string;
  label: string;
  name: string;
  type?: 'email' | 'password' | 'text';
}) {
  const { meta, registerProps } = useUncontrolledField(name, { type });

  return (
    <label className="example-form-field">
      <span>{label}</span>
      <input {...registerProps} />
      <small>{description}</small>
      {meta.showError ? <p className="example-form-error">{meta.error}</p> : null}
    </label>
  );
}

function ExampleCheckboxField({
  description,
  label,
  name,
}: {
  description: string;
  label: string;
  name: string;
}) {
  const { registerProps } = useUncontrolledField(name, { type: 'checkbox' });

  return (
    <label className="example-form-checkbox">
      <input {...registerProps} />
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
    </label>
  );
}

function ControlledRolePicker({
  onBlur,
  onChange,
  value,
}: {
  onBlur: () => void;
  onChange: (value: ControlledRoleValue) => void;
  value: ControlledRoleValue;
}) {
  return (
    <div className="example-form-stack">
      <div className="example-chip-row" onBlurCapture={onBlur}>
        {controlledRoleOptions.map((option) => (
          <ChipButton
            active={value === option.value}
            key={option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </ChipButton>
        ))}
        <ChipButton active={value === ''} onClick={() => onChange('')}>
          Clear
        </ChipButton>
      </div>
      <p className="example-counter-label">
        {controlledRoleOptions.find((option) => option.value === value)?.description ??
          'No role selected yet.'}
      </p>
    </div>
  );
}

function SimpleLoginExampleActions() {
  const controller = useFormController<SimpleLoginValues>();
  const form = useFormMeta<SimpleLoginValues>();

  return (
    <div className="example-counter-actions">
      <button
        onClick={() => {
          controller.setFieldValue('email', 'team@veams.dev');
          controller.setFieldValue('password', 'docs-ship-fast');
        }}
        type="button"
      >
        Load demo values
      </button>
      <button
        onClick={() => {
          if (!controller.validateForm()) {
            controller.touchAllFields();
          }
        }}
        type="button"
      >
        Validate now
      </button>
      <button onClick={() => controller.resetForm()} type="button">
        Reset
      </button>
      <RenderMeta detail="Submitting" value={form.isSubmitting ? 'yes' : 'no'} />
    </div>
  );
}

function SimpleLoginExampleSummary({ lastSubmittedEmail }: { lastSubmittedEmail: string | null }) {
  const controller = useFormController<SimpleLoginValues>();
  const form = useFormMeta<SimpleLoginValues>();
  const [values] = useStateSubscription(controller, (state) => state.values);

  return (
    <ExampleCard title="State snapshot">
      <StatGrid
        items={[
          { label: 'Touched', value: String(Object.keys(form.touched).length) },
          { label: 'Errors', value: String(Object.keys(form.errors).length) },
          { label: 'Valid', value: form.isValid ? 'yes' : 'no' },
        ]}
      />
      <p className="example-counter-label">
        Blur either field empty to trigger the default `validationMode="blur"` behavior. Once a
        field is touched, changes revalidate immediately.
      </p>
      <pre className="example-form-json">{JSON.stringify(values, null, 2)}</pre>
      <RenderMeta detail="Last submit" value={lastSubmittedEmail ?? 'none yet'} />
    </ExampleCard>
  );
}

function SimpleFormExample() {
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState<string | null>(null);

  return (
    <ExampleChrome eyebrow="Working Example" title="Local form with blur-first validation">
      <FormProvider<SimpleLoginValues>
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={async (values) => {
          await wait(320);
          setLastSubmittedEmail(values.email);
        }}
        validator={(values) => ({
          ...(values.email ? {} : { email: 'Email is required' }),
          ...(values.password.length >= 12 ? {} : { password: 'Use at least 12 characters' }),
        })}
      >
        <div className="example-counter-layout example-two-column-layout">
          <ExampleCard title="Login form">
            <p className="example-counter-label">
              Native inputs stay uncontrolled. The form controller owns values, touched state, and
              validation.
            </p>
            <div className="example-form-stack">
              <ExampleTextField
                description="Try blurring this field empty first."
                label="Email"
                name="email"
                type="email"
              />
              <ExampleTextField
                description="Needs at least twelve characters."
                label="Password"
                name="password"
                type="password"
              />
            </div>
            <SimpleLoginExampleActions />
            <div className="example-counter-actions">
              <button className="example-form-primary" type="submit">
                Sign in
              </button>
            </div>
          </ExampleCard>
          <SimpleLoginExampleSummary lastSubmittedEmail={lastSubmittedEmail} />
        </div>
      </FormProvider>
    </ExampleChrome>
  );
}

type ProfileFeatureState = {
  lastSavedName: string;
  saveCount: number;
  status: 'idle' | 'saved';
};

type ProfileFeatureActions = {
  getFormHandler: () => FormStateHandler<ProfileEditorValues>;
  loadExampleProfile: () => void;
  saveProfile: (values: ProfileEditorValues) => Promise<void>;
};

class ProfileFeatureExampleHandler extends NativeStateHandler<
  ProfileFeatureState,
  ProfileFeatureActions
> {
  private readonly formHandler = new FormStateHandler<ProfileEditorValues>({
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
      ...(values.profile.name ? {} : { 'profile.name': 'Name is required' }),
      ...(values.profile.email.includes('@')
        ? {}
        : { 'profile.email': 'Enter a valid email address' }),
    }),
  });

  constructor() {
    super({
      initialState: {
        lastSavedName: 'Nobody yet',
        saveCount: 0,
        status: 'idle',
      },
    });
  }

  getActions(): ProfileFeatureActions {
    return {
      getFormHandler: () => this.formHandler,
      loadExampleProfile: () => {
        this.formHandler.setFieldValue('profile.name', 'Mina Foster');
        this.formHandler.setFieldValue('profile.email', 'mina@veams.dev');
        this.formHandler.setFieldValue('settings.newsletter', true);
      },
      saveProfile: async (values) => {
        await wait(260);
        this.setState({
          lastSavedName: values.profile.name,
          saveCount: this.getState().saveCount + 1,
          status: 'saved',
        });
      },
    };
  }
}

function NestedProfileExampleSummary({
  lastSavedName,
  loadExampleProfile,
  saveCount,
}: {
  lastSavedName: string;
  loadExampleProfile: () => void;
  saveCount: number;
}) {
  const controller = useFormController<ProfileEditorValues>();
  const form = useFormMeta<ProfileEditorValues>();
  const [values] = useStateSubscription(controller, (state) => state.values);

  return (
    <ExampleCard title="Feature-owned preview">
      <StatGrid
        items={[
          { label: 'Saves', value: String(saveCount) },
          { label: 'Touched', value: String(Object.keys(form.touched).length) },
          { label: 'Errors', value: String(Object.keys(form.errors).length) },
        ]}
      />
      <p className="example-counter-label">
        The feature handler owns the `FormStateHandler`. The provider only bridges that instance
        into React.
      </p>
      <pre className="example-form-json">{JSON.stringify(values, null, 2)}</pre>
      <RenderMeta detail="Last saved profile" value={lastSavedName} />
      <div className="example-counter-actions">
        <button onClick={loadExampleProfile} type="button">
          Load demo profile
        </button>
        <button onClick={() => controller.resetForm()} type="button">
          Reset values
        </button>
      </div>
    </ExampleCard>
  );
}

function NestedFeatureFormExample() {
  const [featureState, actions] = useStateFactory(() => new ProfileFeatureExampleHandler(), []);

  return (
    <ExampleChrome eyebrow="Working Example" title="Feature-owned nested profile form">
      <FormProvider<ProfileEditorValues>
        formHandlerInstance={actions.getFormHandler()}
        onSubmit={actions.saveProfile}
      >
        <div className="example-counter-layout example-two-column-layout">
          <ExampleCard title="Profile editor">
            <p className="example-counter-label">
              This example uses dot-path field names and keeps ownership in a feature handler.
            </p>
            <div className="example-form-stack">
              <ExampleTextField
                description="Stored at `profile.name`."
                label="Name"
                name="profile.name"
              />
              <ExampleTextField
                description="Stored at `profile.email`."
                label="Email"
                name="profile.email"
                type="email"
              />
              <ExampleCheckboxField
                description="Stored at `settings.newsletter`."
                label="Subscribe to release notes"
                name="settings.newsletter"
              />
            </div>
            <div className="example-counter-actions">
              <button className="example-form-primary" type="submit">
                Save profile
              </button>
            </div>
          </ExampleCard>
          <NestedProfileExampleSummary
            lastSavedName={featureState.lastSavedName}
            loadExampleProfile={actions.loadExampleProfile}
            saveCount={featureState.saveCount}
          />
        </div>
      </FormProvider>
    </ExampleChrome>
  );
}

type RegisterFeatureState = {
  attempts: number;
  lastResult: string;
};

type RegisterFeatureActions = {
  getFormHandler: () => FormStateHandler<RegisterValues>;
  submit: (values: RegisterValues) => Promise<void>;
};

class RegisterFeatureExampleHandler extends NativeStateHandler<
  RegisterFeatureState,
  RegisterFeatureActions
> {
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
    super({
      initialState: {
        attempts: 0,
        lastResult: 'Waiting for submission.',
      },
    });
  }

  getActions(): RegisterFeatureActions {
    return {
      getFormHandler: () => this.formHandler,
      submit: async (values) => {
        this.setState({
          attempts: this.getState().attempts + 1,
          lastResult: 'Submitting request...',
        });

        await wait(420);

        this.formHandler.setFieldError('account.email', undefined);
        this.formHandler.setFieldError('account.password', undefined);
        this.formHandler.setSubmitError(undefined);

        if (values.account.email.endsWith('@taken.dev')) {
          this.formHandler.setFieldError('account.email', 'This email is already taken.');
          this.setState({
            lastResult: 'Backend rejected the email address.',
          });
          return;
        }

        if (values.account.password.toLowerCase().includes('password')) {
          this.formHandler.setFieldError(
            'account.password',
            'Choose something stronger than "password".'
          );
          this.setState({
            lastResult: 'Backend rejected the password.',
          });
          return;
        }

        if (values.account.email === 'ops@down.dev') {
          this.formHandler.setSubmitError('Auth service temporarily unavailable.');
          this.setState({
            lastResult: 'Backend returned a form-level failure.',
          });
          return;
        }

        this.setState({
          lastResult: `Created account for ${values.account.email}.`,
        });
      },
    };
  }
}

function RegisterValidationScenarios() {
  const controller = useFormController<RegisterValues>();
  const form = useFormMeta<RegisterValues>();

  return (
    <>
      {form.submitError ? <p className="example-form-banner">{form.submitError}</p> : null}
      <div className="example-chip-row">
        <ChipButton
          onClick={() => {
            controller.setFieldValue('account.email', 'alex@taken.dev');
            controller.setFieldValue('account.password', 'steady-docs-123');
          }}
        >
          Try taken email
        </ChipButton>
        <ChipButton
          onClick={() => {
            controller.setFieldValue('account.email', 'alex@veams.dev');
            controller.setFieldValue('account.password', 'password-password');
          }}
        >
          Try weak password
        </ChipButton>
        <ChipButton
          onClick={() => {
            controller.setFieldValue('account.email', 'ops@down.dev');
            controller.setFieldValue('account.password', 'steady-docs-123');
          }}
        >
          Try service outage
        </ChipButton>
      </div>
    </>
  );
}

function RegisterFeatureSummary({
  attempts,
  lastResult,
}: {
  attempts: number;
  lastResult: string;
}) {
  const controller = useFormController<RegisterValues>();
  const form = useFormMeta<RegisterValues>();
  const [values] = useStateSubscription(controller, (state) => state.values);

  return (
    <ExampleCard title="Submit lifecycle">
      <StatGrid
        items={[
          { label: 'Attempts', value: String(attempts) },
          { label: 'Errors', value: String(Object.keys(form.errors).length) },
          { label: 'Submitting', value: form.isSubmitting ? 'yes' : 'no' },
        ]}
      />
      <p className="example-counter-label">
        Try the preset scenarios to see client validation, backend field errors, and form-level
        submit errors share one API.
      </p>
      <pre className="example-form-json">{JSON.stringify(values, null, 2)}</pre>
      <p className="example-form-banner is-muted">{lastResult}</p>
    </ExampleCard>
  );
}

function FeatureValidationExample() {
  const [featureState, actions] = useStateFactory(() => new RegisterFeatureExampleHandler(), []);

  return (
    <ExampleChrome eyebrow="Working Example" title="Client validation plus backend error mapping">
      <FormProvider<RegisterValues>
        formHandlerInstance={actions.getFormHandler()}
        onSubmit={actions.submit}
      >
        <div className="example-counter-layout example-two-column-layout">
          <ExampleCard title="Register account">
            <p className="example-counter-label">
              Client rules run locally. Simulated backend responses map back through
              `setFieldError()` and `setSubmitError()`.
            </p>
            <div className="example-form-stack">
              <ExampleTextField
                description="Use `@taken.dev` to trigger a backend field error."
                label="Email"
                name="account.email"
                type="email"
              />
              <ExampleTextField
                description="Use the word `password` to trigger a backend password rule."
                label="Password"
                name="account.password"
                type="password"
              />
            </div>
            <RegisterValidationScenarios />
            <div className="example-counter-actions">
              <button className="example-form-primary" type="submit">
                Create account
              </button>
            </div>
          </ExampleCard>
          <RegisterFeatureSummary
            attempts={featureState.attempts}
            lastResult={featureState.lastResult}
          />
        </div>
      </FormProvider>
    </ExampleChrome>
  );
}

function ControlledRoleSummary({ lastSubmittedRole }: { lastSubmittedRole: string | null }) {
  const controller = useFormController<{ role: ControlledRoleValue }>();
  const form = useFormMeta<{ role: ControlledRoleValue }>();
  const [values] = useStateSubscription(controller, (state) => state.values);

  return (
    <ExampleCard title="Controlled field state">
      <StatGrid
        items={[
          { label: 'Touched', value: form.touched.role ? 'yes' : 'no' },
          { label: 'Invalid', value: form.errors.role ? 'yes' : 'no' },
          { label: 'Role', value: values.role || 'empty' },
        ]}
      />
      <p className="example-counter-label">
        This field is controlled on purpose. The widget owns `value`, while `Controller` maps
        `onChange`, `onBlur`, and field metadata back into the form layer.
      </p>
      {form.errors.role ? <p className="example-form-error">{form.errors.role}</p> : null}
      <pre className="example-form-json">{JSON.stringify(values, null, 2)}</pre>
      <RenderMeta detail="Last submit" value={lastSubmittedRole ?? 'none yet'} />
    </ExampleCard>
  );
}

function ControlledInputExample() {
  const [lastSubmittedRole, setLastSubmittedRole] = useState<string | null>(null);

  return (
    <ExampleChrome eyebrow="Working Example" title="Controlled widget through Controller">
      <FormProvider<{ role: ControlledRoleValue }>
        initialValues={{ role: '' }}
        onSubmit={async (values) => {
          await wait(220);
          setLastSubmittedRole(values.role || 'empty');
        }}
        validator={(values) => ({
          ...(values.role ? {} : { role: 'Choose one role before saving.' }),
        })}
      >
        <div className="example-counter-layout example-two-column-layout">
          <ExampleCard title="Role picker">
            <p className="example-counter-label">
              This picker behaves like a third-party controlled widget. `Controller` is the bridge,
              not the default for native fields.
            </p>
            <Controller
              name="role"
              render={({ field, fieldState }) => (
                <div className="example-form-stack">
                  <ControlledRolePicker
                    onBlur={field.onBlur}
                    onChange={(value) => field.onChange(value)}
                    value={(field.value as ControlledRoleValue) ?? ''}
                  />
                  {fieldState.touched && fieldState.error ? (
                    <p className="example-form-error">{fieldState.error}</p>
                  ) : null}
                </div>
              )}
            />
            <div className="example-counter-actions">
              <button className="example-form-primary" type="submit">
                Save role
              </button>
            </div>
          </ExampleCard>
          <ControlledRoleSummary lastSubmittedRole={lastSubmittedRole} />
        </div>
      </FormProvider>
    </ExampleChrome>
  );
}

function ValidationModeSummary() {
  const controller = useFormController<ValidationModeValues>();
  const form = useFormMeta<ValidationModeValues>();
  const [values] = useStateSubscription(controller, (state) => state.values);

  return (
    <ExampleCard title="What to try">
      <div className="example-form-stack">
        <p className="example-counter-label">
          `blurName` inherits the form default, so it stays quiet until blur.
        </p>
        <p className="example-counter-label">
          `changeEmail` uses `validationMode="change"`, so the error can appear on the first edit.
        </p>
        <p className="example-counter-label">
          `submitRole` uses `validationMode="submit"`, so it waits for submit before showing an
          error.
        </p>
      </div>
      <StatGrid
        items={[
          { label: 'Touched', value: String(Object.keys(form.touched).length) },
          { label: 'Errors', value: String(Object.keys(form.errors).length) },
          { label: 'Valid', value: form.isValid ? 'yes' : 'no' },
        ]}
      />
      <pre className="example-form-json">{JSON.stringify(values, null, 2)}</pre>
    </ExampleCard>
  );
}

function ValidationModeExample() {
  return (
    <ExampleChrome eyebrow="Working Example" title="Field-level validationMode overrides">
      <FormProvider<ValidationModeValues>
        initialValues={{
          blurName: '',
          changeEmail: '',
          submitRole: '',
        }}
        onSubmit={async () => {
          await wait(180);
        }}
        revalidationMode="change"
        validationMode="blur"
        validator={(values) => ({
          ...(values.blurName ? {} : { blurName: 'Name validates on blur.' }),
          ...(/\S+@\S+\.\S+/.test(values.changeEmail)
            ? {}
            : { changeEmail: 'Email validates on first change.' }),
          ...(values.submitRole ? {} : { submitRole: 'Role validates on submit.' }),
        })}
      >
        <div className="example-counter-layout example-two-column-layout">
          <ExampleCard title="Same form, different timing">
            <div className="example-form-stack">
              <ExampleTextField
                description="Uses the form default: validationMode='blur'."
                label="Name"
                name="blurName"
              />
              <ExampleTextField
                description="Overrides to validationMode='change'."
                label="Email"
                name="changeEmail"
                type="email"
              />
              <Controller
                name="submitRole"
                validationMode="submit"
                render={({ field, fieldState }) => (
                  <div className="example-form-stack">
                    <label className="example-form-field">
                      <span>Role</span>
                      <ControlledRolePicker
                        onBlur={field.onBlur}
                        onChange={(value) => field.onChange(value)}
                        value={(field.value as ControlledRoleValue) ?? ''}
                      />
                      <small>Overrides to validationMode='submit'.</small>
                    </label>
                    {fieldState.touched && fieldState.error ? (
                      <p className="example-form-error">{fieldState.error}</p>
                    ) : null}
                  </div>
                )}
              />
            </div>
            <div className="example-counter-actions">
              <button className="example-form-primary" type="submit">
                Run submit validation
              </button>
            </div>
          </ExampleCard>
          <ValidationModeSummary />
        </div>
      </FormProvider>
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
    case 'form-simple-form':
      preview = <SimpleFormExample />;
      break;
    case 'form-nested-feature-form':
      preview = <NestedFeatureFormExample />;
      break;
    case 'form-controlled-input':
      preview = <ControlledInputExample />;
      break;
    case 'form-feature-validation':
      preview = <FeatureValidationExample />;
      break;
    case 'form-validation-mode':
      preview = <ValidationModeExample />;
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
