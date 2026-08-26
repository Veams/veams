import type { PackagePage } from '../../../types';
import { partialHydrationInstall } from './installation.snippets';

export const installationPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: partialHydrationInstall,
          label: 'Install',
          language: 'bash',
        },
      ],
      id: 'install',
      paragraphs: [
        'Install the hydration package. The core works with any framework. Optional React bindings make integration easier.',
      ],
      title: 'Install the package',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'installation',
  intro: 'Add the package to your project and start defining your hydration strategies.',
  summary: 'Small impact, huge performance wins.',
  title: 'Installation',
};
