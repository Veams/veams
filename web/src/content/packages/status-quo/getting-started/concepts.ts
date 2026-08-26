import type { PackagePage } from '../../../types';
import { statusQuoPhilosophyCards } from './concepts.snippets';

export const conceptsPage: PackagePage = {
  blocks: [
    {
      featureCards: [
        {
          description:
            'State transitions are owned by the handler, while the view layer only subscribes to read-only snapshots.',
          title: 'Handler-Driven Flow',
          visual: 'status-quo-architecture',
        },
      ],
      id: 'core-flow',
      paragraphs: [
        'Status Quo separates the state model from the UI layer. The boundary is clear: handlers own transitions and lifecycle, components subscribe to snapshots and call actions.',
      ],
      title: 'Core Architecture',
    },
    {
      bullets: [
        'Immutability: Each state change creates a new snapshot.',
        'Explicit Transitions: All state changes go through the handler.',
        'Unidirectional Data Flow: Views read state and call actions.',
      ],
      id: 'core-contract',
      paragraphs: [
        'The core contract keeps your application state predictable and testable, no matter how large it grows.',
      ],
      title: 'The Core Contract',
    },
    {
      featureCards: statusQuoPhilosophyCards,
      id: 'why-it-scales',
      paragraphs: [
        'Status Quo is designed for long-term growth by providing **a replaceable engine**, **a stable component contract**, and **state logic that stays outside the view layer**.',
      ],
      title: 'Why it scales',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'concepts',
  intro: 'Understand the architectural boundary between handlers, engines, and the view layer.',
  summary: 'The mental model behind the package.',
  title: 'Concepts',
};
