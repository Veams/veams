import type { PackagePage } from '../../../types';
import { statusQuoQueryPhilosophyCards } from './overview.snippets';

export const overviewPage: PackagePage = {
  blocks: [
    {
      bullets: [
        'Query and mutation handles shaped to fit the Status Quo model.',
        'Passive snapshots that are easy to sync into state handlers.',
        'A query manager for broader coordination when the flow crosses query boundaries.',
        'Tracked invalidation that removes most manual cache-key bookkeeping after mutations.',
      ],
      id: 'shape',
      paragraphs: [
        'Status Quo Query wraps TanStack Query in smaller query and mutation handles that fit the Status Quo model.',
      ],
      title: 'Bring query state into the same flow',
    },
    {
      bullets: [
        'Declare domain dependencies once in `deps`.',
        'Keep pagination, sorting, and filters readable in `view`.',
        'Let tracked mutations invalidate matching queries automatically.',
      ],
      id: 'tracked-invalidation-benefits',
      paragraphs: [
        'Tracked invalidation replaces repeated cache-key lists with named dependencies.',
        'Queries register under `deps`, and tracked mutations invalidate those same dependencies.',
      ],
      title: 'Tracked invalidation reduces cache bookkeeping',
    },
    {
      featureCards: statusQuoQueryPhilosophyCards,
      id: 'principles',
      paragraphs: [
        'Keep snapshots passive, commands explicit, and broad coordination on the manager.',
      ],
      title: 'Principles in practice',
    },
  ],
  eyebrow: 'Getting Started',
  heroBullets: [
    'Query and mutation handles that fit the Status Quo model.',
    'Passive snapshots that sync cleanly into state handlers.',
    'Explicit management when the flow goes broader.',
    'Tracked invalidation that maps domain dependencies instead of manual cache keys.',
  ],
  heroParagraphs: [
    'Status Quo Query gives TanStack Query a smaller service-layer surface: passive snapshots, explicit commands, and tracked invalidation by named dependencies.',
  ],
  id: 'overview',
  intro: 'Start with the query handle, mutation handle, and query manager.',
  summary: 'TanStack Query with a smaller surface.',
  title: 'Overview',
};
