import type { DocsNavSection } from '../../../types';
import { overviewPage } from './overview';
import { installPage } from './install';

export const gettingStartedSection: DocsNavSection = {
  id: 'getting-started',
  pages: [overviewPage, installPage],
  title: 'Getting Started',
};
