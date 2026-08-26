import type { DocsNavSection } from '../../../types';
import { featureOwnedPage } from './feature-owned';
import { asyncInitAndDirtyStatePage } from './async-init-and-dirty-state';
import { validatorsPage } from './validators';
import { controlledFieldsPage } from './controlled-fields';
import { advancedNestedFieldsPage } from './advanced-nested-fields';
import { apiReferencePage } from './api-reference';

export const guidesSection: DocsNavSection = {
  id: 'guides',
  pages: [
    featureOwnedPage,
    asyncInitAndDirtyStatePage,
    validatorsPage,
    controlledFieldsPage,
    advancedNestedFieldsPage,
    apiReferencePage,
  ],
  title: 'Guides',
};
