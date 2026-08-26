import type { PackagePage } from '../../../types';
import { methodologyUtilitiesExample } from './utilities.snippets';

export const utilitiesPage: PackagePage = {
  blocks: [
    {
      bullets: [
        'Utilities are helpers that format or position content.',
        'Utilities are not components and should avoid content semantics.',
      ],
      id: 'role',
      paragraphs: [
        'Utilities are structural helpers that are not tied to content (for example, grid systems).',
        'Why use utilities: Clear separation between content components and layout helpers.',
      ],
      title: 'Utilities (Helpers)',
    },
    {
      codeExamples: [
        {
          code: methodologyUtilitiesExample,
          label: 'Utility usage',
          language: 'html',
        },
      ],
      id: 'usage',
      paragraphs: [
        'Naming: Use the `u-` prefix for utilities (example: `u-grid-row`) and `is-` / `has-` for state and variant helpers (example: `is-active`, `has-shadow`).',
      ],
      title: 'Support, do not hijack',
    },
  ],
  eyebrow: 'Guides',
  id: 'utilities',
  intro: 'Utilities are helpful until they start acting like components.',
  summary: 'Keep the helpers tiny.',
  title: 'Utilities',
};
