import type { DocsPackage } from '../../types';
import { gettingStartedSection } from './getting-started';
import { guidesSection } from './guides';
import { examplesSection } from './examples';

export const formPackage: DocsPackage = {
  accent: 'violet',
  description:
    'Generic form state over Status Quo, with optional React bindings for native and controlled fields.',
  githubPath: 'packages/form',
  id: 'form',
  npm: '@veams/form',
  sections: [gettingStartedSection, guidesSection, examplesSection],
  title: 'Form',
};
