import type { PackagePage } from '../../../types';
import { formFeatureValidationWorkingExample } from './example-feature-form-validation.snippets';

export const exampleFeatureFormValidationPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: formFeatureValidationWorkingExample,
          label: 'Working feature form with validation',
          language: 'tsx',
        },
      ],
      bullets: [
        'Client rules live in the form validator.',
        'Server errors come back through `setFieldError()`.',
        'One feature action owns the whole submit flow.',
      ],
      id: 'feature-form-validation',
      liveExample: 'form-feature-validation',
      paragraphs: ['This pattern combines local validation with backend error mapping.'],
      title: 'Feature form with validation',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-feature-form-validation',
  intro: 'Combine local validation with backend error mapping in one submit flow.',
  summary: 'Feature submit lifecycle with client and server validation.',
  title: 'Feature form with validation',
};
