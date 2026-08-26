import type { PackagePage } from '../../../types';
import { cssAnimationsTsUsage } from './typescript-usage.snippets';

export const typescriptUsagePage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: cssAnimationsTsUsage,
          label: 'TypeScript usage',
          language: 'ts',
        },
      ],
      id: 'ts-usage',
      paragraphs: [
        'To avoid typos and get IDE autocompletion, the package exports an `ANIMATIONS` constant. This is especially useful in component frameworks where you toggle animation classes dynamically.',
      ],
      title: 'TypeScript Constants',
    },
  ],
  eyebrow: 'Guides',
  id: 'typescript-usage',
  intro: 'Use type-safe constants to toggle animation classes in your components.',
  summary: 'Constants for type-safe class names.',
  title: 'TypeScript Usage',
};
