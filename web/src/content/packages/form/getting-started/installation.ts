import type { PackagePage } from '../../../types';
import { formInstall } from './installation.snippets';

export const installationPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: formInstall,
          label: 'Install',
          language: 'bash',
        },
      ],
      id: 'install',
      paragraphs: [
        'Install the form package. Add React when you need the provider and field hooks.',
      ],
      title: 'Install the package',
    },
    {
      bullets: [
        'Use the root package for `FormStateHandler` and types.',
        'Use `@veams/form/react` for `FormProvider`, `useUncontrolledField`, and `Controller`.',
        'When a flow needs more than plain field state, keep it in a Status Quo handler and let that handler own the form.',
      ],
      id: 'entry-points',
      paragraphs: ['The main decision is which layer owns the form controller.'],
      title: 'Choose the owning layer',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'installation',
  intro: 'Install the core first, then add the React subpath when the UI needs it.',
  summary: 'Small install surface.',
  title: 'Installation',
};
