import type { PackagePage } from '../../../types';

export const overviewPage: PackagePage = {
  blocks: [
    {
      featureCards: [
        {
          description:
            'A collection of layout and page transition animations designed for modern interfaces.',
          title: 'In/Out Animations',
          visual: 'css-animations-architecture',
        },
      ],
      id: 'overview-intro',
      paragraphs: [
        '@veams/css-animations is a curated set of fast CSS animations for the VEAMS ecosystem. It ships as SCSS mixins, pre-compiled CSS, and TypeScript constants for type-safe usage.',
      ],
      title: 'High-Performance Animations',
    },
  ],
  eyebrow: 'Getting Started',
  heroBullets: [
    'SCSS mixins for maximum flexibility.',
    'Pre-compiled CSS for quick integration.',
    'Type-safe TypeScript constants for class names.',
  ],
  heroParagraphs: [
    'VEAMS CSS Animations is more than a stylesheet. It is a structured library of fast animations that follow the VEAMS methodology. Transitions and feedback effects stay smooth without hurting frame rates.',
  ],
  id: 'overview',
  intro: 'Curated CSS animations for modern web interfaces.',
  summary: 'Smooth transitions and feedback effects.',
  title: 'Overview',
};
