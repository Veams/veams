import type { DocsPackage } from '../../types';
import { gettingStartedSection } from './getting-started';
import { guidesSection } from './guides';
import { examplesSection } from './examples';

export const cssAnimationsPackage: DocsPackage = {
  accent: 'pink',
  description: 'A curated set of fast CSS animations for modern web interfaces.',
  githubPath: 'packages/css-animations',
  id: 'css-animations',
  npm: '@veams/css-animations',
  sections: [gettingStartedSection, guidesSection, examplesSection],
  title: 'CSS Animations',
};
