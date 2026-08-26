import type { PackagePage } from '../../../types';
import { formValidationModesExample } from '../shared-snippets';

export const exampleValidationModePage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: formValidationModesExample,
          label: 'Working validation mode form',
          language: 'tsx',
        },
      ],
      bullets: [
        'The form default stays on `validationMode="blur"` and `revalidationMode="change"`.',
        'One field overrides to `change`, another waits until `submit`.',
        'The preview shows each timing option in one place.',
      ],
      id: 'validation-mode-example',
      liveExample: 'form-validation-mode',
      paragraphs: ['This example shows blur, change, and submit timing in one form.'],
      title: 'Validation mode',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-validation-mode',
  intro: 'Use field-level validation timing overrides when inputs need different UX.',
  summary: 'Blur, change, and submit validation timing in one form.',
  title: 'Validation mode',
};
