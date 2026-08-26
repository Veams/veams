import type { DocsPackage } from '../../types';
import { gettingStartedSection } from './getting-started';
import { guidesSection } from './guides';
import { examplesSection } from './examples';

export const partialHydrationPackage: DocsPackage = {
  accent: 'forest',
  description:
    'Activate interactive components in a static HTML environment using the Islands Architecture.',
  githubPath: 'packages/partial-hydration',
  id: 'partial-hydration',
  npm: '@veams/partial-hydration',
  sections: [gettingStartedSection, guidesSection, examplesSection],
  title: 'Partial Hydration',
};
