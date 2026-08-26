import type { PackagePage } from '../../../types';
import { partialHydrationLazyExample } from './lazy-loading.snippets';

export const lazyLoadingPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: partialHydrationLazyExample,
          label: 'Lazy loading example',
          language: 'ts',
        },
      ],
      bullets: [
        'Use dynamic imports to load components only when needed.',
        'Return a Promise from the `render` function to await the module.',
        'Combine with `in-viewport` for maximum performance.',
      ],
      id: 'lazy-loading-guide',
      paragraphs: [
        'To get the full benefit of partial hydration, lazy load your component code. Pass a dynamic import (e.g., `() => import(...)`) as your component definition and await it in the `render` function. The browser then only downloads the JavaScript when the component is actually activated.',
      ],
      title: 'Dynamic Imports',
    },
  ],
  eyebrow: 'Guides',
  id: 'lazy-loading',
  intro: 'Load component code only when the activation trigger fires.',
  summary: 'Lazy loading in the component itself.',
  title: 'Lazy Loading',
};
