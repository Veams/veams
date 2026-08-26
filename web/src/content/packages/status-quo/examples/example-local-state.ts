import type { PackagePage } from '../../../types';
import { statusQuoQuickStartComponent, statusQuoQuickStartHandler } from '../shared-snippets';

export const exampleLocalStatePage: PackagePage = {
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
};
