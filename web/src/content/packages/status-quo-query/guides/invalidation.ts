import type { PackagePage } from '../../../types';
import { statusQuoQueryInvalidateExample } from '../shared-snippets';

export const invalidationPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoQueryInvalidateExample,
          label: 'Invalidate and patch state',
          language: 'ts',
        },
      ],
      id: 'invalidate-example',
      paragraphs: [
        'Exact invalidation belongs on the query handle.',
        'Broader invalidation and manual cache updates belong on the manager.',
      ],
      title: 'Coordinate invalidation and state updates',
    },
    {
      bullets: [
        '`query.invalidate()` targets the current query key.',
        '`createMutation(...)` can invalidate matching tracked queries automatically.',
        '`manager.invalidateQueries()` supports broader filters.',
        '`manager.setQueryData()` is the imperative path when you already know the correct next state value.',
      ],
      id: 'invalidate-guidelines',
      paragraphs: [
        'Start narrow. Use the manager only when the behavior crosses query boundaries.',
      ],
      title: 'Keep invalidation deliberate',
    },
  ],
  eyebrow: 'Guides',
  id: 'invalidation',
  intro: 'This API keeps invalidation scope visible.',
  summary: 'Exact on the handle. Broad on the manager.',
  title: 'Invalidation',
};
