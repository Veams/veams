import type { PackagePage } from '../../../types';
import {
  statusQuoFrameworkCoreImports,
  statusQuoFrameworkReactImports,
} from './framework-support.snippets';

export const frameworkSupportPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoFrameworkCoreImports,
          label: 'Framework-agnostic core',
          language: 'ts',
        },
        {
          code: statusQuoFrameworkReactImports,
          label: 'Optional React bindings',
          language: 'ts',
        },
      ],
      bullets: [
        'The root package (`@veams/status-quo`) owns the state model and does not need React.',
        'React bindings live in a separate subpath (`@veams/status-quo/react`).',
        'The guides use React examples for readability, but the handler patterns work the same outside React.',
      ],
      id: 'framework-support',
      paragraphs: [
        'Status Quo is not tied to React. Keep handlers, actions, and lifecycle in the root package. Add React only for the view wiring, and only if your app uses React.',
        'The guides use React for readability, not because React is required. The handler boundary and the engine choice (observables or signals) stay independent of the UI layer.',
      ],
      title: 'Framework Support',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'framework-support',
  intro:
    'Use the root package as the state layer for any framework, then add React bindings only where the UI needs them.',
  summary: 'Framework-neutral core, optional React layer.',
  title: 'Framework Support',
};
