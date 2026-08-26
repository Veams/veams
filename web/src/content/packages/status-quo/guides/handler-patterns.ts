import type { PackagePage } from '../../../types';
import {
  statusQuoNativeHandlerCompositionExample,
  statusQuoObservableHandlerExample,
  statusQuoSignalHandlerExample,
} from './handler-patterns.snippets';

export const handlerPatternsPage: PackagePage = {
  blocks: [
    {
      callout: 'Same hooks. Same snapshots. The only choice is how the handler works inside.',
      codeExamples: [
        {
          code: statusQuoNativeHandlerCompositionExample,
          description:
            'The native engine uses `bindSubscribable()` to derive state by hand. You pass a selector to map upstream state and a comparison function to skip duplicate updates. This is the zero-dependency default.',
          label: 'Native (Manual Sync)',
          language: 'ts',
        },
        {
          code: statusQuoObservableHandlerExample,
          description:
            'The observable engine uses RxJS operators like `pipe()` and `map()` to transform state into a stream. Ideal when your transitions already behave like an event stream.',
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
        'The engine is a handler decision, not a view decision. The native version is the cleanest start because it needs no peer dependencies. The observable version is strong for complex async work through RxJS. The signal version gives very light reactive derivation via Preact Signals. All three share the same `bindSubscribable()` contract, so the composition and React wiring stay the same.',
      ],
      title: 'Pick the engine that matches the state',
    },
    {
      featureCards: [
        {
          description:
            'When your handler has to coordinate several async events, debounce input, or manage time-based transitions, RxJS streams are the stronger tool.',
          title: 'Stream-heavy logic',
          visual: 'swap-engine',
        },
        {
          description:
            'When your state tree has many derived values that depend on each other, signals track them automatically and update only what changed.',
          title: 'Deeply reactive derivations',
          visual: 'view-state',
        },
      ],
      id: 'when-to-scale',
      paragraphs: [
        'Native handlers cover most features, because `bindSubscribable()` already handles manual state derivation and syncing. Move to another engine only when the manual logic gets repetitive or the transitions get truly complex.',
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
        'A simple rule of thumb: let the handler do the complex work so the component can stay simple. That is the whole point.',
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
};
