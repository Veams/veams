import type { DocsNavSection } from '../../../types';
import { exampleSimpleFormPage } from './example-simple-form';
import { exampleControlledInputPage } from './example-controlled-input';
import { exampleNestedFeatureFormPage } from './example-nested-feature-form';
import { exampleAsyncInitPage } from './example-async-init';
import { exampleFeatureFormValidationPage } from './example-feature-form-validation';
import { exampleValidationModePage } from './example-validation-mode';

export const examplesSection: DocsNavSection = {
  id: 'examples',
  pages: [
    exampleSimpleFormPage,
    exampleControlledInputPage,
    exampleNestedFeatureFormPage,
    exampleAsyncInitPage,
    exampleFeatureFormValidationPage,
    exampleValidationModePage,
  ],
  title: 'Examples',
};
