import type { PackagePage } from '../../../types';
import { formSimpleWorkingExample } from './example-simple-form.snippets';

export const exampleSimpleFormPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: formSimpleWorkingExample,
          label: 'Working simple form',
          language: 'tsx',
        },
      ],
      bullets: [
        'Provider owns local form lifecycle.',
        'Validator stays close to the form values.',
        'Native fields register through `useUncontrolledField()`.',
      ],
      id: 'simple-form',
      liveExample: 'form-simple-form',
      paragraphs: ['Start with one complete local form.'],
      title: 'Simple form',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-simple-form',
  intro: 'Start with a complete local form before adding feature-level orchestration.',
  summary: 'Local form with validator and native fields.',
  title: 'Simple form',
};
