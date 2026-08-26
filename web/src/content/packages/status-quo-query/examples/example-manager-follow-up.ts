import type { PackagePage } from '../../../types';
import { statusQuoQueryInvalidateExample } from '../shared-snippets';

export const exampleManagerFollowUpPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoQueryInvalidateExample,
          label: 'Follow-up management coordination',
          language: 'ts',
        },
      ],
      id: 'manager-follow-up',
      paragraphs: ['Use the manager for follow-up work after a mutation.'],
      title: 'Manager follow-up example',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-manager-follow-up',
  intro: 'Use manager commands when a mutation needs broader follow-up.',
  summary: 'Manager follow-up after a mutation.',
  title: 'Manager follow-up example',
};
