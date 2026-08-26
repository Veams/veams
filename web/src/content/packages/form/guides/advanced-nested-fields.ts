import type { PackagePage } from '../../../types';
import { formNestedReactExample, formNestedStateExample } from './advanced-nested-fields.snippets';

export const advancedNestedFieldsPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: formNestedStateExample,
          label: 'Nested state with dot-paths',
          language: 'ts',
        },
        {
          code: formNestedReactExample,
          label: 'Nested fields in React',
          language: 'tsx',
        },
      ],
      bullets: [
        'Use dot-path field names such as `profile.email` and `settings.newsletter`.',
        'Return dot-path keys from validators so field metadata resolves correctly.',
        'Nested support targets object trees. Array index paths are not supported unless you add your own mapping.',
      ],
      id: 'nested-fields',
      paragraphs: [
        'Nested forms use dot-path field names.',
        'The same path format works across values, errors, touched state, and field hooks.',
      ],
      title: 'Nested object fields with dot-paths',
    },
  ],
  eyebrow: 'Guides',
  id: 'advanced-nested-fields',
  intro: 'Use dot-path field names for nested object forms.',
  summary: 'Nested values, same API surface.',
  title: 'Advanced Nested Fields',
};
