import type { PackagePage } from '../../../types';
import { ventExampleSetup, ventExampleSubscribers } from './example-release-bus.snippets';

export const exampleReleaseBusPage: PackagePage = {
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
};
