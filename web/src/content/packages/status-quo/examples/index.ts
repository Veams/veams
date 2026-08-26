import type { DocsNavSection } from '../../../types';
import { exampleLocalStatePage } from './example-local-state';
import { exampleSingletonCounterPage } from './example-singleton-counter';
import { exampleBaseHookCompositionPage } from './example-base-hook-composition';
import { exampleScopedProviderPage } from './example-scoped-provider';
import { exampleSelectorOptimizationPage } from './example-selector-optimization';
import { exampleBindSubscribablePage } from './example-bind-subscribable';

export const examplesSection: DocsNavSection = {
  id: 'examples',
  pages: [
    exampleLocalStatePage,
    exampleSingletonCounterPage,
    exampleBaseHookCompositionPage,
    exampleScopedProviderPage,
    exampleSelectorOptimizationPage,
    exampleBindSubscribablePage,
  ],
  title: 'Examples',
};
