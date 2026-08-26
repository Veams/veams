import type { DocsPackage } from '../../types';
import { gettingStartedSection } from './getting-started';
import { guidesSection } from './guides';
import { examplesSection } from './examples';

export const statusQuoPackage: DocsPackage = {
  accent: 'ember',
  description: 'State handlers for any framework, with React hooks and a clear lifecycle.',
  githubPath: 'packages/status-quo',
  id: 'status-quo',
  npm: '@veams/status-quo',
  sections: [gettingStartedSection, guidesSection, examplesSection],
  title: 'Status Quo',
};
