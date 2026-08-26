import type { PackagePage } from '../../../types';
import { statusQuoQueryQuickStart } from '../shared-snippets';

export const quickStartPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoQueryQuickStart,
          label: 'Setup manager, tracked query, and tracked mutation',
          language: 'ts',
        },
      ],
      id: 'first-flow',
      paragraphs: [
        'Start with one tracked query and one tracked mutation.',
        'That is the default flow for most feature work.',
      ],
      title: 'Create the first end-to-end flow',
    },
    {
      bullets: [
        'Use `manager.createQueryAndMutation(...)` when query and mutation share the same dependency names.',
        'Put invalidation-relevant values into `deps` and view-only variants into `view`.',
        'Call commands on the handle, not on the snapshot.',
      ],
      id: 'workflow',
      paragraphs: ['Read state from snapshots. Run commands on the handle.'],
      title: 'Keep commands on the handle',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'quick-start',
  intro: 'Start with the query manager, then split to lower-level factories only when needed.',
  summary: 'One manager. One query. One mutation.',
  title: 'Quick Start',
};
