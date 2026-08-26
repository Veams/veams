import type { PackagePage } from '../../../types';
import { methodologyComponentsExample } from './components.snippets';

export const componentsPage: PackagePage = {
  blocks: [
    {
      bullets: [
        'Components are closely related to content.',
        'Component content varies by context.',
        'Components are generic and reusable across the project.',
        'Components can contain other components.',
      ],
      id: 'role',
      paragraphs: [
        'Components are reusable building blocks that are tied to content. They can appear multiple times on a page and can contain other components.',
        'Why use components: Reusability. You can drop a component into different pages and it should render consistently.',
      ],
      title: 'Components (Reusable)',
    },
    {
      codeExamples: [
        {
          code: methodologyComponentsExample,
          label: 'Component markup',
          language: 'html',
        },
      ],
      id: 'markup',
      paragraphs: ['Naming: Prefix component classes with `c-`.'],
      title: 'Name the reusable thing once',
    },
  ],
  eyebrow: 'Guides',
  id: 'components',
  intro: 'Components should read like reusable building blocks, not like page positions.',
  summary: 'Build reusable UI.',
  title: 'Components',
};
