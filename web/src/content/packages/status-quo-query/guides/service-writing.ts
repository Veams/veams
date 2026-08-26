import type { PackagePage } from '../../../types';
import { statusQuoQueryServiceGuideExample } from './service-writing.snippets';

export const serviceWritingPage: PackagePage = {
  blocks: [
    {
      callout: 'Do not memoize `QueryHandle` instances in a package-level registry.',
      bullets: [
        'Expose fresh query handles from query-handler methods that return commands or subscriptions.',
        'Use `getQueryState(...)` for full state reads and `getQueryData(...)` when the caller only needs cached data.',
        'Keep one query handler focused on one feature area and let its methods define the query API for that feature.',
      ],
      id: 'service-writing-purpose',
      paragraphs: [
        'TanStack already deduplicates cached queries by `queryKey`.',
        'A `QueryHandle` is a handle over that cached state, closer to a TanStack `QueryObserver` than to the cache entry itself.',
      ],
      title: 'Shape the query handler API',
    },
    {
      codeExamples: [
        {
          code: statusQuoQueryServiceGuideExample,
          label: 'Use fresh handles and direct cache reads',
          language: 'ts',
        },
      ],
      id: 'service-writing-example',
      paragraphs: [
        'In this example, `getQueryManager()` is your application-level accessor for the shared `QueryManager`.',
      ],
      title: 'Group query methods by feature',
    },
    {
      bullets: [
        'Use `...Query()` suffixes for methods that return live query handles.',
        'Use `...State()` or `...Data()` suffixes for synchronous manager-backed reads.',
        'Parameterized methods work naturally when each call derives the final query key from its inputs.',
        'Keep the handler small and feature-specific instead of building one global registry of query handles.',
      ],
      id: 'service-writing-guidelines',
      paragraphs: [
        'This keeps query behavior explicit at the method level: live handle, full state, or data-only read.',
      ],
      title: 'Operational rules',
    },
  ],
  eyebrow: 'Guides',
  id: 'service-writing',
  intro:
    'Build one query handler per feature area and let its methods expose fresh handles, full state reads, and data-only reads.',
  summary: 'One query handler. Query, state, and data methods.',
  title: 'How to Write a QueryHandler',
};
