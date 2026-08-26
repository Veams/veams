import type { PackagePage } from '../../../types';
import { formFrameworkCoreImports, formFrameworkReactImports } from './framework-support.snippets';

export const frameworkSupportPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: formFrameworkCoreImports,
          label: 'Framework-agnostic core',
          language: 'ts',
        },
        {
          code: formFrameworkReactImports,
          label: 'Optional React bindings',
          language: 'ts',
        },
      ],
      bullets: [
        'The root package (`@veams/form`) owns the form model and does not need React.',
        'React bindings are optional and live in `@veams/form/react`.',
        'The guides use React examples for clarity, but the core patterns work in any setup.',
      ],
      id: 'framework-support',
      paragraphs: [
        'VEAMS Form is not tied to React.',
        'Keep form logic in `FormStateHandler`, then add React bindings only at the view boundary.',
      ],
      title: 'Framework Support',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'framework-support',
  intro: 'Model form state in the root package, then add React bindings only where needed.',
  summary: 'Framework-neutral form model with optional React bindings.',
  title: 'Framework Support',
};
