import type { PackagePage } from '../../../types';
import { ventInstall } from './installation.snippets';

export const installationPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: ventInstall,
          label: 'Install',
          language: 'bash',
        },
      ],
      id: 'install',
      paragraphs: [
        'Install the package once. The React entrypoint is exposed as a subpath, so there is no separate React package to add.',
      ],
      title: 'Install the package',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'installation',
  intro: 'Add the package, then pick the entrypoint that matches your runtime boundary.',
  summary: 'One package, multiple narrow surfaces.',
  title: 'Installation',
};
