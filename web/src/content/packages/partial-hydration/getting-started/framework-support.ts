import type { PackagePage } from '../../../types';

export const frameworkSupportPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: `import { createHydration } from '@veams/partial-hydration';`,
          label: 'Framework-agnostic core',
          language: 'ts',
        },
        {
          code: `import { withHydration, useIsomorphicId } from '@veams/partial-hydration/react';`,
          label: 'Optional React bindings',
          language: 'ts',
        },
      ],
      bullets: [
        'The root package (`@veams/partial-hydration`) owns the core engine and does not need React.',
        'React bindings live in a separate subpath (`@veams/partial-hydration/react`).',
        'The `render` function gives you full control over how any framework is initialized.',
      ],
      id: 'framework-support',
      paragraphs: [
        'Partial Hydration is not tied to React. The core engine handles DOM scanning, event listeners, and data extraction independently. You can use it with Vue, Svelte, or even Vanilla JS by providing the appropriate `render` function.',
        'For React users, we provide dedicated bindings under the `/react` subpath to handle SSR metadata injection and stable ID generation.',
      ],
      title: 'Framework Support',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'framework-support',
  intro:
    'Use the framework-neutral root for the client-side engine, then add React bindings only for SSR component preparation.',
  summary: 'Framework-neutral core, optional React layer.',
  title: 'Framework Support',
};
