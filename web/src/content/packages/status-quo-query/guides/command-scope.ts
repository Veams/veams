import type { PackagePage } from '../../../types';
import {
  statusQuoQueryGlobalExample,
  statusQuoQuerySpecificExample,
} from './command-scope.snippets';

export const commandScopePage: PackagePage = {
  blocks: [
    {
      bullets: [
        'Use the **Handle** when you are acting on one specific data source (e.g., refetching a single profile).',
        'Use the **Manager** for cross-cutting concerns (e.g., invalidating all user-related data).',
        'The Handle is for UI observation and local action; the Manager is for orchestration and manual state control.',
      ],
      codeExamples: [
        {
          code: statusQuoQuerySpecificExample,
          label: 'Specific Action (Handle)',
          language: 'ts',
        },
        {
          code: statusQuoQueryGlobalExample,
          label: 'Global Action (Manager)',
          language: 'ts',
        },
      ],
      id: 'scope-levels',
      paragraphs: [
        'Use the handle for one query or mutation.',
        'Use the manager for work that crosses query boundaries.',
      ],
      title: 'Specific vs. Global Control',
    },
  ],
  eyebrow: 'Guides',
  id: 'command-scope',
  intro: 'Use the smaller owner first, then move to the manager when scope gets broader.',
  summary: 'Handle for local actions. Manager for broad actions.',
  title: 'Global vs. Specific Control',
};
