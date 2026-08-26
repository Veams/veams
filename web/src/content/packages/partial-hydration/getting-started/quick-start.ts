import type { PackagePage } from '../../../types';
import { partialHydrationQuickStart } from './quick-start.snippets';

export const quickStartPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: partialHydrationQuickStart,
          label: 'Client-side initialization',
          language: 'ts',
        },
      ],
      id: 'client-init',
      paragraphs: [
        'To start the hydration process on the client, you create a hydration instance with a map of your components and call `init()`. The loader scans the DOM for `[data-component]`, matches each value against your component map, and activates the matching entries based on their trigger configuration.',
      ],
      title: 'Initialize on the client',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'quick-start',
  intro:
    'The quickest path to an interactive page is defining your component map and calling the hydration initializer.',
  summary: 'From static HTML to interactive islands in seconds.',
  title: 'Quick Start',
};
