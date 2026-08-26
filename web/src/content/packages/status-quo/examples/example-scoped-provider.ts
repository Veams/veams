import type { PackagePage } from '../../../types';
import {
  statusQuoProviderComponentExample,
  statusQuoProviderHandlerExample,
} from '../shared-snippets';

export const exampleScopedProviderPage: PackagePage = {
  blocks: [
    {
      bullets: [
        'Use provider scope when one local handler should be shared inside a subtree.',
        'The parent still owns lifecycle; the provider only shares access.',
        'Descendants can subscribe narrowly or grab actions without subscribing.',
      ],
      codeExamples: [
        {
          code: statusQuoProviderHandlerExample,
          label: 'Wizard scope handler',
          language: 'ts',
        },
        {
          code: statusQuoProviderComponentExample,
          label: 'Wizard scope components',
          language: 'tsx',
        },
      ],
      id: 'provider-example',
      paragraphs: [
        'This example is the middle ground between prop threading and a singleton. One parent owns the wizard flow locally, then `StateProvider` shares that same instance with progress and command components deeper in the tree.',
        'The split source makes the boundary explicit: the handler file owns transitions, while the React file shows the provider boundary plus the descendant hooks that consume it.',
      ],
      liveExample: 'status-quo-provider-wizard',
      title: 'Scoped provider for shared local state',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-scoped-provider',
  intro: 'Share one locally owned handler across a subtree without promoting to singleton scope.',
  summary: 'Provider-scoped shared local state.',
  title: 'Scoped provider for shared local state',
};
