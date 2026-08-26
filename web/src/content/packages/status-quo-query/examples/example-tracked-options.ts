import type { PackagePage } from '../../../types';
import {
  statusQuoQueryTrackedCustomResolverExample,
  statusQuoQueryTrackedLifecycleExample,
} from './example-tracked-options.snippets';

export const exampleTrackedOptionsPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoQueryTrackedLifecycleExample,
          label: 'Lifecycle timing',
          language: 'ts',
        },
        {
          code: statusQuoQueryTrackedCustomResolverExample,
          label: 'Custom dependency resolver',
          language: 'ts',
        },
      ],
      id: 'tracked-option-examples',
      paragraphs: ['Use these patterns when timing or dependency resolution needs to change.'],
      title: 'Tracked option examples',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-tracked-options',
  intro: 'Adjust timing or dependency resolution when the default flow is not enough.',
  summary: 'Examples for tracked options.',
  title: 'Tracked option examples',
};
