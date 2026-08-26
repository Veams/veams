import type { DocsNavSection } from '../../../types';
import { usagePage } from './usage';
import { typescriptUsagePage } from './typescript-usage';
import { apiReferencePage } from './api-reference';

export const guidesSection: DocsNavSection = {
  id: 'guides',
  pages: [usagePage, typescriptUsagePage, apiReferencePage],
  title: 'Guides',
};
