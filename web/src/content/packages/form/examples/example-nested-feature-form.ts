import type { PackagePage } from '../../../types';
import { formNestedFeatureWorkingExample } from './example-nested-feature-form.snippets';

export const exampleNestedFeatureFormPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: formNestedFeatureWorkingExample,
          label: 'Working nested feature form',
          language: 'tsx',
        },
      ],
      bullets: [
        'The feature handler owns the form instance.',
        'Nested values use dot-path field names.',
        'The provider connects the existing handler without repeating initial values.',
      ],
      id: 'nested-feature-form',
      liveExample: 'form-nested-feature-form',
      paragraphs: [
        'Keep ownership in the feature handler when the form is only one part of the feature.',
      ],
      title: 'Nested feature form',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-nested-feature-form',
  intro: 'Keep ownership in the feature handler when the form is part of a larger feature.',
  summary: 'Nested values with dot-path fields in a feature-owned form.',
  title: 'Nested feature form',
};
