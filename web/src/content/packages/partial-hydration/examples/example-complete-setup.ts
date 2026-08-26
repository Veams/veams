import type { PackagePage } from '../../../types';
import { partialHydrationCompleteExample } from './example-complete-setup.snippets';

export const exampleCompleteSetupPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: partialHydrationCompleteExample,
          label: 'Complete React Setup',
          language: 'ts',
        },
      ],
      id: 'complete-setup',
      paragraphs: [
        'This example shows a complete React setup. It mixes non-lazy components for critical UI (like navigation) with lazy components that only load when they enter the viewport.',
      ],
      title: 'Mix Lazy and Non-Lazy Components',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-complete-setup',
  intro: 'See how one page combines immediate and deferred hydration.',
  summary: 'Complete setup mixing lazy and non-lazy components.',
  title: 'Complete Setup',
};
