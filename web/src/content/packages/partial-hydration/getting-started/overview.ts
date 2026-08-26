import type { PackagePage } from '../../../types';
import islandArchitectureImg from '../../../../assets/island-architecture.jpg';

export const overviewPage: PackagePage = {
  blocks: [
    {
      featureCards: [
        {
          description:
            'Interactive islands are embedded in a static HTML frame and activated by specific triggers like viewport intersection.',
          title: 'Islands Architecture',
          visual: 'partial-hydration-architecture',
        },
      ],
      id: 'islands-architecture',
      paragraphs: [
        'Partial Hydration combines the speed of static HTML with the interactivity of modern UI frameworks. Instead of hydrating the whole page, you only activate specific components based on user interaction or environment triggers.',
      ],
      title: 'Islands of Interactivity',
    },
  ],
  eyebrow: 'Getting Started',
  heroBullets: [
    'Zero-bundle impact for static regions.',
    'No custom compiler or bundler lock-in required.',
    'Flexible hydration triggers: viewport, ready, or immediate.',
  ],
  heroImage: islandArchitectureImg,
  heroParagraphs: [
    'VEAMS Partial Hydration activates components inside static HTML. It enables the Islands Architecture by writing component props into the DOM during server rendering and hydrating them selectively on the client. It works purely at runtime: no custom compiler, no bundler lock-in.',
  ],
  id: 'overview',
  intro:
    'Use the Islands Architecture to activate interactive components exactly when and where they are needed.',
  summary: 'Selective hydration for peak performance.',
  title: 'Overview',
};
