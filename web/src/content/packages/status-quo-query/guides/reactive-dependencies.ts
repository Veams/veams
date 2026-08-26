import type { PackagePage } from '../../../types';
import { statusQuoQueryReactiveDependenciesExample } from '../shared-snippets';

export const reactiveDependenciesPage: PackagePage = {
  blocks: [
    {
      bullets: [
        'Use `dependsOn` when one query should derive its own key from other query handles.',
        'The derivation callback can change only `queryKey` and `enabled`.',
        'The downstream handle stays the same `QueryHandle`; the reactivity is internal.',
      ],
      id: 'reactive-dependencies-shape',
      paragraphs: [
        'Use this when a query needs upstream data before it can run.',
        'The query watches source services, derives its own key, and enables itself when ready.',
      ],
      title: 'Let the downstream query derive itself',
    },
    {
      codeExamples: [
        {
          code: statusQuoQueryReactiveDependenciesExample,
          label: 'Tracked reactive dependency flow',
          language: 'ts',
        },
      ],
      id: 'reactive-dependencies-example',
      paragraphs: [
        'Here `companyProfile` depends on `userQuery` and `configQuery`, then switches to the final key and runs.',
      ],
      title: 'Build the dependency graph in the query options',
    },
    {
      bullets: [
        'Keep the base key valid even before the sources resolve. For tracked queries that means the placeholder key must still end in `{ deps, view? }`.',
        'Treat `dependsOn` as query-level orchestration, not as a place to mutate retry policies, selectors, or lifecycle callbacks.',
        'Watchers start on first `subscribe(...)` or `refetch()` and stop again after the last unsubscribe.',
        'A downstream `refetch()` refetches its source services first, then refetches itself.',
        'Exact invalidation follows the current derived key, not the original placeholder key.',
      ],
      id: 'reactive-dependencies-guidelines',
      paragraphs: [
        'Keep the base key honest, put gating in `enabled`, and keep the derived state narrow.',
      ],
      title: 'Operational rules',
    },
  ],
  eyebrow: 'Guides',
  id: 'reactive-dependencies',
  intro:
    'Use `dependsOn` when one query should wait for other queries and then derive its own key.',
  summary: 'Derive one query from other queries.',
  title: 'Reactive Query Dependencies',
};
