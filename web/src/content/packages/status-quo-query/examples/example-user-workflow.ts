import type { PackagePage } from '../../../types';
import { statusQuoQueryQuickStart } from '../shared-snippets';

export const exampleUserWorkflowPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoQueryQuickStart,
          label: 'User query and mutation flow',
          language: 'ts',
        },
      ],
      id: 'user-flow',
      paragraphs: ['One query manager, one query, one mutation.'],
      title: 'User workflow example',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-user-workflow',
  intro: 'Start with one complete query and mutation flow.',
  summary: 'One working flow around one manager.',
  title: 'User workflow example',
};
