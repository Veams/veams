import type { PackagePage } from '../../../types';
import { statusQuoQuickStartComponent, statusQuoQuickStartHandler } from '../shared-snippets';

export const quickStartPage: PackagePage = {
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
};
