import type { DocsNavSection } from '../../../types';
import { serviceWritingPage } from './service-writing';
import { commandScopePage } from './command-scope';
import { reactAndStatusQuoPage } from './react-and-status-quo';
import { queryKeyManagementPage } from './query-key-management';
import { invalidationPage } from './invalidation';
import { reactiveDependenciesPage } from './reactive-dependencies';
import { escapeHatchesPage } from './escape-hatches';
import { apiPage } from './api';
import { faqPage } from './faq';

export const guidesSection: DocsNavSection = {
  id: 'guides',
  pages: [
    serviceWritingPage,
    commandScopePage,
    reactAndStatusQuoPage,
    queryKeyManagementPage,
    invalidationPage,
    reactiveDependenciesPage,
    escapeHatchesPage,
    apiPage,
    faqPage,
  ],
  title: 'Guides',
};
