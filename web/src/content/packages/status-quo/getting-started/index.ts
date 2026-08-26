import type { DocsNavSection } from '../../../types';
import { overviewPage } from './overview';
import { conceptsPage } from './concepts';
import { frameworkSupportPage } from './framework-support';
import { installationPage } from './installation';
import { quickStartPage } from './quick-start';

export const gettingStartedSection: DocsNavSection = {
  id: 'getting-started',
  pages: [overviewPage, conceptsPage, frameworkSupportPage, installationPage, quickStartPage],
  title: 'Getting Started',
};
