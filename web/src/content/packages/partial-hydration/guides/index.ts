import type { DocsNavSection } from '../../../types';
import { createHydrationPage } from './create-hydration';
import { lazyLoadingPage } from './lazy-loading';
import { withHydrationPage } from './with-hydration';
import { hydrationProviderPage } from './hydration-provider';
import { apiReferencePage } from './api-reference';

export const guidesSection: DocsNavSection = {
  id: 'guides',
  pages: [
    createHydrationPage,
    lazyLoadingPage,
    withHydrationPage,
    hydrationProviderPage,
    apiReferencePage,
  ],
  title: 'Guides',
};
