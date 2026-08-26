import type { PackagePage } from '../../../types';
import { partialHydrationCreateOptionsExample } from './create-hydration.snippets';

export const createHydrationPage: PackagePage = {
  blocks: [
    {
      featureCards: [
        {
          description:
            'Map `data-component` values to activation triggers so each island hydrates only when it should.',
          title: 'Trigger Mapping',
          visual: 'partial-hydration-triggers',
        },
      ],
      id: 'strategies',
      paragraphs: [
        'The right trigger balances performance and interactivity. We recommend lazy-first: hydrate a component only when the user actually needs it.',
      ],
      title: 'Choosing a Trigger',
    },
    {
      codeExamples: [
        {
          code: partialHydrationCreateOptionsExample,
          label: 'Hydration Configuration',
          language: 'ts',
        },
      ],
      bullets: [
        '**init**: Use for critical UI that must be interactive immediately (e.g., global navigation).',
        '**dom-ready**: Use for components that are visible above the fold but less critical than the main layout.',
        '**in-viewport**: The most efficient strategy. Activate components only when the user scrolls them into view.',
        '**fonts-ready**: Use for text-heavy interactive elements that rely on specific typography layout.',
      ],
      id: 'trigger-guide',
      paragraphs: [
        'The `createHydration` options map `data-component` values to their activation rules. Each component in the map requires a `render` function, which provides full control over how the framework (like React or Vue) is initialized on the DOM element.',
        'If you use `withHydration()`, the wrapper `data-component` value is taken from `Component.displayName`, so that `displayName` must stay stable and match the client registration key.',
        'For viewport-based hydration, an optional `config.rootMargin` triggers activation slightly before the element becomes visible, so the component is ready when the user reaches it.',
      ],
      title: 'Trigger Reference & Options',
    },
  ],
  eyebrow: 'Guides',
  id: 'create-hydration',
  intro: 'Orchestrate components and choose the most efficient activation trigger for each.',
  summary: 'Orchestrate components with createHydration.',
  title: 'createHydration & Strategies',
};
