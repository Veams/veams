import type { PackagePage } from '../../../types';
import {
  statusQuoSingletonComponentExample,
  statusQuoSingletonHandlerExample,
} from '../shared-snippets';

export const localVsSingletonPage: PackagePage = {
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
        'By default a singleton stays alive, which fits app-level shared state. If it should behave more like a mounted resource, opt into teardown with `destroyOnNoConsumers: true`.',
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
};
