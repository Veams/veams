import type { PackagePage } from '../../../types';
import { formControllerExample } from '../shared-snippets';

export const controlledFieldsPage: PackagePage = {
  blocks: [
    {
      bullets: [
        'Keep native inputs uncontrolled by default through `useUncontrolledField()`.',
        'Typing writes to the DOM directly, so React does not re-render on every keypress.',
        'Browser behavior like autofill and text selection keeps working as expected.',
        'Use `Controller` only for components that really need controlled props.',
      ],
      id: 'uncontrolled-principle',
      paragraphs: [
        'Native fields stay uncontrolled by default.',
        'The controller still owns values, errors, touched state, and submit state.',
      ],
      title: 'Prefer uncontrolled fields by default',
    },
    {
      codeExamples: [
        {
          code: formControllerExample,
          label: 'Controller bridge',
          language: 'tsx',
        },
      ],
      bullets: [
        'Use `Controller` for third-party selects, date pickers, or custom widgets that expect `value` and `onChange`.',
        'The render prop gives you `field` and `fieldState`, matching the native field hooks.',
        'Keep native inputs on `useUncontrolledField()` unless a component really needs controlled props.',
      ],
      id: 'controller',
      paragraphs: ['Use `Controller` only when a widget really needs controlled props.'],
      title: 'Bridge controlled components on purpose',
    },
  ],
  eyebrow: 'Guides',
  id: 'controlled-fields',
  intro: 'Controlled components should be the exception, not the default.',
  summary: 'Stay uncontrolled by default.',
  title: 'Controlled Fields',
};
