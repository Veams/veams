import type { DocsNavSection } from '../../../types';
import { regionsPage } from './regions';
import { componentsPage } from './components';
import { contextsPage } from './contexts';
import { modifiersPage } from './modifiers';
import { utilitiesPage } from './utilities';
import { bestPracticesPage } from './best-practices';

export const guidesSection: DocsNavSection = {
  id: 'guides',
  pages: [
    regionsPage,
    componentsPage,
    contextsPage,
    modifiersPage,
    utilitiesPage,
    bestPracticesPage,
  ],
  title: 'Guides',
};
