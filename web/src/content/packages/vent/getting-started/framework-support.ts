import type { PackagePage } from '../../../types';
import { ventReactImports } from './framework-support.snippets';

export const frameworkSupportPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: `import createVent from '@veams/vent';`,
          label: 'Framework-neutral root',
          language: 'ts',
        },
        {
          code: ventReactImports,
          label: 'Optional React entry',
          language: 'ts',
        },
      ],
      bullets: [
        'The root package owns the bus and does not need React.',
        'React bindings live under `@veams/vent/react`.',
      ],
      id: 'framework-support',
      paragraphs: [
        'Vent keeps integration layers at the edge. React does not own the event model; it only helps subscribe and provide one shared instance in a component subtree.',
      ],
      title: 'Keep integration surfaces separate',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'framework-support',
  intro:
    'Use the root API everywhere, then add the React subpath only where the component tree needs provider-based subscriptions.',
  summary: 'Generic root, optional React layer.',
  title: 'Framework Support',
};
