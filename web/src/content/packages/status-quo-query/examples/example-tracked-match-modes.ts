import type { PackagePage } from '../../../types';
import {
  statusQuoQueryTrackedIntersectionExample,
  statusQuoQueryTrackedUnionExample,
} from './example-tracked-match-modes.snippets';

export const exampleTrackedMatchModesPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoQueryTrackedIntersectionExample,
          label: 'Intersection matching',
          language: 'ts',
        },
        {
          code: statusQuoQueryTrackedUnionExample,
          label: 'Union matching',
          language: 'ts',
        },
      ],
      id: 'tracked-match-mode-examples',
      paragraphs: ['`intersection` stays narrow. `union` expands invalidation.'],
      title: 'Tracked match mode examples',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-tracked-match-modes',
  intro: 'Choose match mode based on how broad the mutation impact is.',
  summary: 'Compare `intersection` and `union`.',
  title: 'Tracked match mode examples',
};
