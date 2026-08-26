import type { DocsNavSection } from '../../../types';
import { overviewPage } from './overview';
import { quickStartPage } from './quick-start';

export const gettingStartedSection: DocsNavSection = {
  id: 'getting-started',
  pages: [overviewPage, quickStartPage],
  title: 'Getting Started',
};
