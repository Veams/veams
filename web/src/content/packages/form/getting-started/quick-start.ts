import type { PackagePage } from '../../../types';
import { formQuickStartCore, formQuickStartReact } from './quick-start.snippets';

export const quickStartPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: formQuickStartCore,
          label: 'Generic form state',
          language: 'ts',
        },
      ],
      id: 'generic-handler',
      paragraphs: ['You can use the built-in handler directly.'],
      title: 'Create the form controller',
    },
    {
      codeExamples: [
        {
          code: formQuickStartReact,
          label: 'React binding',
          language: 'tsx',
        },
      ],
      bullets: [
        '`FormProvider` creates and owns one controller when you do not pass `formHandlerInstance`.',
        '`useUncontrolledField()` wires native inputs without turning every field into controlled React state.',
        'The hook result already includes `meta` for validation UI.',
        'By default, a field validates on its first blur. After that, it revalidates on every change.',
      ],
      id: 'react-layer',
      paragraphs: [
        'The default React path is `FormProvider` plus uncontrolled field registration.',
        'That keeps re-renders low. Fields validate on blur first and revalidate on change.',
      ],
      title: 'Bind it into React',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'quick-start',
  intro: 'Start with one `FormStateHandler`, then bind it into React where needed.',
  summary: 'One form handler, one provider, one clean flow.',
  title: 'Quick Start',
};
