import type { DocsPackage } from '../../types';
import { gettingStartedSection } from './getting-started';
import { guidesSection } from './guides';
import { examplesSection } from './examples';

export const statusQuoQueryPackage: DocsPackage = {
  accent: 'ocean',
  description:
    'Query and mutation handles over TanStack Query core, plus a query manager for client-level operations.',
  githubPath: 'packages/status-quo-query',
  id: 'status-quo-query',
  npm: '@veams/status-quo-query',
  sections: [gettingStartedSection, guidesSection, examplesSection],
  title: 'Status Quo Query',
};
