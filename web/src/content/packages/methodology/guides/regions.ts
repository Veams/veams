import type { PackagePage } from '../../../types';
import { methodologyRegionsExample } from './regions.snippets';

export const regionsPage: PackagePage = {
  blocks: [
    {
      featureCards: [
        {
          description:
            'Regions are high-level structural areas (Header, Sidebar, Main, Footer) that compose the page skeleton.',
          title: 'The Page Skeleton',
          visual: 'methodology-layout',
        },
      ],
      id: 'role',
      paragraphs: [
        'Regions are structural sections used to compose pages. They exist only in layout files and are not reusable by design.',
        'Why use regions: Region styles are isolated from component styles. Layouts become drop-in replaceable because components can move without breaking layout CSS.',
      ],
      title: 'Regions (Layout Only)',
    },
    {
      codeExamples: [
        {
          code: methodologyRegionsExample,
          label: 'Region markup',
          language: 'html',
        },
      ],
      id: 'markup',
      paragraphs: [
        'Naming: Use the `r-` prefix for region/layout classes (example: `r-header`, `r-sidebar`).',
        'Typical regions: Header region, Logo region in header, Navigation region in header, Stage region, Main content region, Sidebar region, Footer region.',
      ],
      title: 'Name page areas, not widgets',
    },
  ],
  eyebrow: 'Guides',
  id: 'regions',
  intro: 'Regions are the page skeleton. Keep them structural.',
  summary: 'Let layout own the layout.',
  title: 'Regions',
};
