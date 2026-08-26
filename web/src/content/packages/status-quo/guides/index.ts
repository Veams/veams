import type { DocsNavSection } from '../../../types';
import { handlerPatternsPage } from './handler-patterns';
import { localVsSingletonPage } from './local-vs-singleton';
import { scopedProviderPage } from './scoped-provider';
import { compositionPage } from './composition';
import { connectionLifecyclePage } from './connection-lifecycle';
import { bindingsPage } from './bindings';
import { selectorsPage } from './selectors';
import { comparatorsAndDefaultsPage } from './comparators-and-defaults';
import { devtoolsPage } from './devtools';
import { apiReferencePage } from './api-reference';

export const guidesSection: DocsNavSection = {
  id: 'guides',
  pages: [
    handlerPatternsPage,
    localVsSingletonPage,
    scopedProviderPage,
    compositionPage,
    connectionLifecyclePage,
    bindingsPage,
    selectorsPage,
    comparatorsAndDefaultsPage,
    devtoolsPage,
    apiReferencePage,
  ],
  title: 'Guides',
};
