import type { PackagePage } from '../../../types';
import { partialHydrationProviderExample } from './hydration-provider.snippets';

export const hydrationProviderPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: partialHydrationProviderExample,
          label: 'HydrationProvider usage',
          language: 'tsx',
        },
      ],
      bullets: [
        'Manages the `componentId` for the hydration unit.',
        'Provides a counter for `useIsomorphicId`.',
        'Automatically applied by `withHydration`.',
      ],
      id: 'provider-guide',
      paragraphs: [
        'The `HydrationProvider` is a React context provider that supplies metadata to the hydrated component tree. `withHydration` includes it automatically. Use it manually only when you build custom hydration wrappers or advanced isomorphic setups.',
      ],
      title: 'Context Provider',
    },
  ],
  eyebrow: 'Guides',
  id: 'hydration-provider',
  intro: 'Understand how the HydrationProvider supplies metadata to your components.',
  summary: 'Hydration provider.',
  title: 'Hydration Provider',
};
