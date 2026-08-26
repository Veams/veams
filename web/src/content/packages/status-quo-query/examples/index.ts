import type { DocsNavSection } from '../../../types';
import { exampleUserWorkflowPage } from './example-user-workflow';
import { exampleManagerFollowUpPage } from './example-manager-follow-up';
import { exampleTrackedPairPage } from './example-tracked-pair';
import { exampleReactiveDependenciesPage } from './example-reactive-dependencies';
import { exampleTrackedMatchModesPage } from './example-tracked-match-modes';
import { exampleTrackedOptionsPage } from './example-tracked-options';

export const examplesSection: DocsNavSection = {
  id: 'examples',
  pages: [
    exampleUserWorkflowPage,
    exampleManagerFollowUpPage,
    exampleTrackedPairPage,
    exampleReactiveDependenciesPage,
    exampleTrackedMatchModesPage,
    exampleTrackedOptionsPage,
  ],
  title: 'Examples',
};
