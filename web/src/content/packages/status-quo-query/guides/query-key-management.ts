import type { PackagePage } from '../../../types';
import { statusQuoQueryKeyShapeExample } from './query-key-management.snippets';

export const queryKeyManagementPage: PackagePage = {
  blocks: [
    {
      bullets: [
        '`deps` describes the domain identity that tracked invalidation should match.',
        '`view` describes presentation variants like pagination, sorting, filters, or search.',
        'Both belong to the TanStack query key, but only `deps` participates in tracked invalidation.',
        'Use `TrackedQueryKey<TDeps>` when you want to type the full tracked key shape explicitly.',
      ],
      id: 'query-key-concept',
      paragraphs: [
        'Tracked query keys separate domain identity from UI variation.',
        'That split keeps invalidation meaningful without collapsing every list view into one cache entry.',
      ],
      title: 'Separate domain identity from view state',
    },
    {
      codeExamples: [
        {
          code: statusQuoQueryKeyShapeExample,
          label: 'Key structure with deps and view',
          language: 'ts',
        },
      ],
      id: 'query-key-structure',
      paragraphs: [
        'The final key segment is an object containing `deps` and optionally `view`.',
        'List queries often use both. Detail queries often need only `deps`.',
        '`TrackedQueryKey<TDeps>` is the public type to document or annotate that structure.',
      ],
      title: 'Shape the key deliberately',
    },
    {
      bullets: [
        'Put values in `deps` when a mutation should be able to target them as domain dependencies.',
        'Put values in `view` when they only describe how the same domain data is presented.',
        'If a value changes list membership or invalidation scope by domain rule, move it into `deps` intentionally.',
        'Keep the structure stable across one feature area so queries and mutations speak the same dependency language.',
      ],
      id: 'query-key-rules',
      paragraphs: [
        'Treat `deps` as the invalidation contract and `view` as the cache-identity variant layer.',
      ],
      title: 'Decision rules',
    },
    {
      bullets: [
        'Two keys with the same `deps` but different `view` are different cache entries.',
        'Tracked mutations ignore `view` on purpose, because UI variants usually should refresh together.',
        'When you need one exact variant only, use `query.invalidate()` or manager-level exact invalidation for that full key.',
      ],
      id: 'query-key-effects',
      paragraphs: [
        'The split gives you broad domain invalidation by default while preserving precise cache identity.',
      ],
      title: 'How the split behaves at runtime',
    },
  ],
  eyebrow: 'Guides',
  id: 'query-key-management',
  intro:
    'Use `deps` for tracked domain identity and `view` for presentation variants inside the query key.',
  summary: 'How to structure tracked query keys.',
  title: 'Query Key Management',
};
