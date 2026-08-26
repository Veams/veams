import type { PackagePage } from '../../../types';
import { methodologyContextExample, methodologyContextStylingExample } from './contexts.snippets';

export const contextsPage: PackagePage = {
  blocks: [
    {
      bullets: [
        'Contexts use `--` after the instrument name.',
        'Contexts share base styles but have independent overrides.',
        'Contexts make it easy to understand what variant is rendered.',
      ],
      id: 'role',
      paragraphs: [
        'Contexts are variations of instruments that share a base set of styles and add context-specific styles. Use contexts instead of duplicating components with slightly different styling.',
        'We want to make sure that nothing affects a component from the outside and the component itself owns its representation. That is why we use context classes like `.c-brand--footer`.',
      ],
      title: 'Contexts',
    },
    {
      codeExamples: [
        {
          code: methodologyContextExample,
          label: 'Context markup',
          language: 'html',
        },
        {
          code: methodologyContextStylingExample,
          label: 'Context styling',
          language: 'css',
        },
      ],
      id: 'example',
      paragraphs: [
        'The component itself stays in charge of the contextual difference. A new context class is added when a component should look different in certain areas.',
      ],
      title: 'Component owns its representation',
    },
  ],
  eyebrow: 'Guides',
  id: 'contexts',
  intro: 'When a component needs to look different, let the component own the difference.',
  summary: 'Style by contexts.',
  title: 'Contexts',
};
