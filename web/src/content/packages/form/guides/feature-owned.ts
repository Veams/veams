import type { PackagePage } from '../../../types';
import { formFeatureOwnedExample } from './feature-owned.snippets';

export const featureOwnedPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: formFeatureOwnedExample,
          label: 'Feature-owned form handler',
          language: 'tsx',
        },
      ],
      bullets: [
        'Keep the form handler inside a feature handler when the form is only one part of the screen state.',
        'Expose `getFormHandler()` as the connection point between feature state and the React form provider.',
        'Keep validators and submit logic next to the other feature actions instead of spreading them across components.',
      ],
      id: 'feature-owned',
      paragraphs: [
        'Let the feature handler own the form when the form is only one part of the screen state.',
      ],
      title: 'Let the feature own the form',
    },
  ],
  eyebrow: 'Guides',
  id: 'feature-owned',
  intro: 'Keep the controller in the feature handler when the form is part of a larger workflow.',
  summary: 'The feature owns the workflow.',
  title: 'Feature-Owned Forms',
};
