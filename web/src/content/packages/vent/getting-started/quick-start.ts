import type { PackagePage } from '../../../types';
import { ventQuickStart, ventReactQuickStart } from './quick-start.snippets';

export const quickStartPage: PackagePage = {
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
};
