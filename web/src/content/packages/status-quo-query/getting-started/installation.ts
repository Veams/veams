import type { PackagePage } from '../../../types';
import { statusQuoQueryInstall } from './installation.snippets';

export const installationPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoQueryInstall,
          label: 'Install',
          language: 'bash',
        },
      ],
      id: 'install',
      paragraphs: ['Install this package and `@tanstack/query-core`.'],
      title: 'Install the package',
    },
    {
      bullets: [
        'Bring your own `QueryClient`.',
        'Use `setupQueryManager(queryClient)` when you want the combined query manager.',
        'Use `setupQuery` or `setupMutation` directly when you want a narrower entry point.',
        'Install `react` only when you also import `@veams/status-quo-query/react`.',
      ],
      id: 'entry-points',
      paragraphs: ['Choose the entry point that matches how much surface you want to expose.'],
      title: 'Choose an entry point',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'installation',
  intro: 'Bring a `QueryClient`, then choose the manager or the narrower factories.',
  summary: 'Bring a `QueryClient`.',
  title: 'Installation',
};
