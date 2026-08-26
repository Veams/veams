import type { PackagePage } from '../../../types';

export const installPage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: 'npm install @veams/css-animations',
          label: 'Install',
          language: 'bash',
        },
      ],
      id: 'installation',
      paragraphs: [
        'Install the package via npm to start using the animations in your project. The package includes SCSS sources, compiled CSS, and TypeScript types.',
      ],
      title: 'Installation',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'install',
  intro: 'Add the animations package to your project.',
  summary: 'Get started with CSS animations.',
  title: 'Installation',
};
