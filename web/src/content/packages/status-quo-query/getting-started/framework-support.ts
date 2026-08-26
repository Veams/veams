import type { PackagePage } from '../../../types';
import { statusQuoQueryReactSubscriptionExample } from '../shared-snippets';
import { statusQuoQueryFrameworkImports } from './framework-support.snippets';

export const frameworkSupportPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoQueryFrameworkImports,
          label: 'Framework-neutral service layer',
          language: 'ts',
        },
        {
          code: statusQuoQueryReactSubscriptionExample,
          label: 'Optional React subscription layer',
          language: 'tsx',
        },
      ],
      bullets: [
        'Built on `@tanstack/query-core`, not on framework hooks.',
        'The root package stays framework-neutral and exposes subscribable handles plus manager commands.',
        'Optional React bindings live in `@veams/status-quo-query/react` and expose `useQueryHandle(...)` and `useMutationHandle(...)`.',
        'The query and mutation API stays the same whether you consume it from services, handlers, or React components.',
      ],
      id: 'framework-support',
      paragraphs: [
        'The core package is not tied to React.',
        'Use the root entry point in services and handlers, then add the React subpath only where components need direct snapshot subscription.',
      ],
      title: 'Framework Support',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'framework-support',
  intro: 'Use the handles as framework-neutral service objects.',
  summary: 'Framework-neutral query and mutation handles.',
  title: 'Framework Support',
};
