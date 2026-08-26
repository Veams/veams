import type { PackagePage } from '../../../types';

export const conceptsPage: PackagePage = {
  blocks: [
    {
      featureCards: [
        {
          description:
            'A query handler owns query and mutation access. A state handler can subscribe to that query handler, derive UI state, and expose the resulting snapshot to the view.',
          title: 'QueryHandler => StateHandler => Snapshot',
          visual: 'query-architecture',
        },
      ],
      id: 'command-boundary',
      paragraphs: [
        'Keep query concerns in the query handler, keep UI orchestration in the state handler, and keep the view focused on snapshots.',
      ],
      title: 'QueryHandlers, StateHandlers, and Snapshots',
    },
    {
      featureCards: [
        {
          description:
            'The Query Manager acts as a single command center for all queries and mutations, making coordination readable and predictable.',
          title: 'Centralized Management',
          visual: 'query-facade',
        },
      ],
      id: 'query-management',
      paragraphs: [
        'The Query Manager keeps cross-query work in one place: invalidation, manual updates, and cache-wide actions.',
      ],
      title: 'The Query Manager',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'concepts',
  intro:
    'Treat TanStack Query as the engine, then move through query handlers, state handlers, and snapshots.',
  summary: 'QueryHandlers => StateHandlers => Snapshot.',
  title: 'Concepts',
};
