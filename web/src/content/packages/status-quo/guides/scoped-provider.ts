import type { PackagePage } from '../../../types';
import {
  statusQuoProviderComponentExample,
  statusQuoProviderHandlerExample,
} from '../shared-snippets';

export const scopedProviderPage: PackagePage = {
  blocks: [
    {
      callout: 'A provider scope is shared local state, not app-global state in disguise.',
      id: 'provider-scope-example',
      liveExample: 'status-quo-provider-wizard',
      paragraphs: [
        'This is the pattern for sharing one local handler instance across a subtree without promoting it to a singleton.',
        'The parent owns creation once with `useStateHandler()`, `StateProvider` shares the instance, and each child decides whether it needs snapshots, actions, or the raw handler.',
      ],
      title: 'Share one local instance across the subtree',
    },
    {
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
      id: 'provider-scope-source',
      paragraphs: [
        'The source stays split on purpose: one file owns transitions, one file owns React wiring.',
      ],
      title: 'Source split',
    },
    {
      bullets: [
        'Use a provider scope when a parent owns lifecycle but several descendants need the same handler.',
        'Split render-heavy state readers from action-only bricks when they do not need to rerender together.',
        'Reach for a singleton only when the handler should outlive that local subtree.',
      ],
      id: 'provider-scope-tradeoffs',
      paragraphs: [
        'The handler still ends with the local scope. Only access is shared.',
        'This is the middle ground between a local shortcut and a singleton. Ownership stays local, but you no longer pass the handler through props or force state reads and actions into one component just to share the instance.',
      ],
      title: 'Keep ownership local, share access on purpose',
    },
  ],
  eyebrow: 'Guides',
  id: 'scoped-provider',
  intro:
    'Use a provider scope when one local handler should be shared inside a subtree, while state readers and action-only components stay split.',
  summary: 'One handler. One scope. Cleaner bricks.',
  title: 'Scoped Provider',
};
