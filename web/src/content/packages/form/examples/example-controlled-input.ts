import type { PackagePage } from '../../../types';
import { formControllerExample } from '../shared-snippets';

export const exampleControlledInputPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: formControllerExample,
          label: 'Working controlled input',
          language: 'tsx',
        },
      ],
      bullets: [
        'Use `Controller` for a widget that already expects `value`, `onChange`, and `onBlur`.',
        'Keep the controlled bridge narrow and local to that component.',
        'Field metadata still flows through `fieldState` for errors and touched UX.',
      ],
      id: 'controlled-input-example',
      liveExample: 'form-controlled-input',
      paragraphs: [
        'Use this bridge for widgets that cannot register as native uncontrolled inputs.',
      ],
      title: 'Controlled input',
    },
  ],
  eyebrow: 'Examples',
  id: 'example-controlled-input',
  intro: 'Use `Controller` only when a component truly needs controlled props.',
  summary: 'Controlled widget bridged into the form layer.',
  title: 'Controlled input',
};
