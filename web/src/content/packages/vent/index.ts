import type { DocsPackage } from '../../types';
import { gettingStartedSection } from './getting-started';
import { apiSection } from './api';
import { examplesSection } from './examples';

export const ventPackage: DocsPackage = {
  accent: 'ochre',
  description:
    'Typed publish/subscribe events with a narrow React provider layer for UI-scoped subscriptions.',
  githubPath: 'packages/vent',
  id: 'vent',
  npm: '@veams/vent',
  sections: [gettingStartedSection, apiSection, examplesSection],
  title: 'Vent',
};
