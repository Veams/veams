import type { PackagePage } from '../../../types';
import { statusQuoGlobalSetup } from '../shared-snippets';
import {
  statusQuoInstallNative,
  statusQuoInstallObservable,
  statusQuoInstallSignal,
} from './installation.snippets';

export const installationPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: statusQuoInstallNative,
          label: 'Native (Zero-dependency)',
          language: 'bash',
        },
        {
          code: statusQuoInstallObservable,
          label: 'Observable (RxJS)',
          language: 'bash',
        },
        {
          code: statusQuoInstallSignal,
          label: 'Signal (Preact Signals)',
          language: 'bash',
        },
      ],
      id: 'install',
      paragraphs: [
        'Install the package based on your preferred reactive engine. The native handler has no dependencies. The observable and signal versions need their peer packages.',
      ],
      title: 'Install the package',
    },
    {
      codeExamples: [
        {
          code: statusQuoGlobalSetup,
          label: 'Optional global setup',
          language: 'ts',
        },
      ],
      id: 'global-setup',
      paragraphs: [
        'Global setup is optional. Use it when you want shared runtime defaults across handlers, for example distinct-update behavior or turning Redux DevTools on once for the whole app.',
      ],
      title: 'Configure runtime defaults',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'installation',
  intro:
    'Install the zero-dependency package and start with the native handler, then opt into other reactive backends only when you need them.',
  summary: 'Install fast. Start clean.',
  title: 'Installation',
};
