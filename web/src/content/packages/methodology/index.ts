import type { DocsPackage } from '../../types';
import { gettingStartedSection } from './getting-started';
import { guidesSection } from './guides';
import { examplesSection } from './examples';

export const methodologyPackage: DocsPackage = {
  accent: 'graphite',
  description: 'Structure and scale without the noise.',
  id: 'methodology',
  sections: [gettingStartedSection, guidesSection, examplesSection],
  title: 'Methodology',
};
