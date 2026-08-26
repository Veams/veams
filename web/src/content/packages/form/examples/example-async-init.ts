import type { PackagePage } from '../../../types';
import { formAsyncInitWorkingExample } from './example-async-init.snippets';

export const exampleAsyncInitPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: formAsyncInitWorkingExample,
          label: 'Working async init form',
          language: 'tsx',
        },
      ],
      bullets: [
        '`onInit` loads the real values once, when the first field connects. Until then the form shows `initialValues`.',
        "`initStatus` drives the loading state: fields are disabled while `'initializing'`, and submits are ignored.",
        'Server updates only prefill the form while `isDirty` is `false`. User edits are never overwritten.',
        'Saving calls `initialize()` with the saved values, so they become the new clean baseline.',
      ],
      id: 'async-init-form',
      liveExample: 'form-async-init',
      paragraphs: [
        'One feature-owned form that loads its values from an API, protects user edits, and updates its baseline on save.',
      ],
      title: 'Async init & dirty prefill',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-async-init',
  intro:
    'Load the first values from an API, protect user edits from server updates, and set a new baseline on save.',
  summary: 'Async initial values with dirty-protected server prefills.',
  title: 'Async init & dirty prefill',
};
