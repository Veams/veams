import type { PackagePage } from '../../../types';
import { statusQuoQueryReactSubscriptionExample } from '../shared-snippets';
import { statusQuoQueryStatusQuoBridgeExample } from './react-and-status-quo.snippets';

export const reactAndStatusQuoPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoQueryReactSubscriptionExample,
          label: 'Subscribe directly inside React',
          language: 'tsx',
        },
        {
          code: statusQuoQueryStatusQuoBridgeExample,
          label: 'Bridge the same query into a Status Quo handler',
          language: 'ts',
        },
      ],
      id: 'react-and-handler-choices',
      paragraphs: [
        'Use the React hook when a component should subscribe directly to a query handle and render from its latest snapshot.',
        'Use a `status-quo` handler when query state is only one part of a broader view model and the handler should stay the UI boundary.',
      ],
      title: 'Choose the integration boundary deliberately',
    },
    {
      bullets: [
        '`useQueryHandle(queryHandle)` subscribes a component to the passive `QueryHandleSnapshot` of one query handle.',
        '`bindSubscribable(query, ...)` is the better seam when the query should feed a `status-quo` handler or another subscribable composition layer.',
        'Keep commands on the handle in both cases: call `refetch()` or `invalidate()` on the query handle, not on the snapshot.',
        'Map the snapshot at the outer layer that actually owns presentation concerns: component or handler.',
      ],
      id: 'react-and-handler-rules',
      paragraphs: ['The handle stays the same. Only the consuming boundary changes.'],
      title: 'Hook for components, handler for broader UI state',
    },
  ],
  eyebrow: 'Guides',
  id: 'react-and-status-quo',
  intro:
    'Use the React subpath for direct component reads, or bridge the same query handle into a `status-quo` handler when the view model is broader.',
  summary: 'Choose the right integration boundary.',
  title: 'React and Status Quo Integration',
};
