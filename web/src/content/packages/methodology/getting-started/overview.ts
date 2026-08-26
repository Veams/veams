import type { PackagePage } from '../../../types';
import { methodologyInstrumentExample } from './overview.snippets';

export const overviewPage: PackagePage = {
  blocks: [
    {
      bullets: [
        'How we scope and differentiate HTML.',
        'How we bind JavaScript to DOM elements.',
        'How we structure layouts.',
        'How we write CSS classes.',
        'How we expand the project over time.',
      ],
      id: 'why',
      paragraphs: [
        'Our methodology defines how projects are structured so they stay modular, scalable, and easy to maintain. It covers HTML, CSS, and JavaScript, so the same mental model works across the whole frontend.',
        'The approach is BEM-inspired, but it is not strict BEM. We limit nesting depth to keep class names readable.',
        'This section covers the structure and styling rules. JavaScript binding rules belong to the same methodology but are documented separately.',
      ],
      title: 'Methodology Overview',
    },
    {
      codeExamples: [
        {
          code: methodologyInstrumentExample,
          label: 'Instrument structure example',
          language: 'html',
        },
      ],
      featureCards: [
        {
          description:
            'Structural sections like Header, Sidebar, and Main that shape the page skeleton. Never reused.',
          title: 'Regions',
          visual: 'methodology-regions',
        },
        {
          description:
            'Reusable UI elements like Cards, Buttons, and Navs that live inside regions.',
          title: 'Components',
          visual: 'methodology-components',
        },
        {
          description:
            'Low-level helpers like Grid systems or spacing that provide structure without content.',
          title: 'Utilities',
          visual: 'methodology-utilities',
        },
      ],
      id: 'instruments',
      paragraphs: [
        'Markup is structured using three instruments: Regions, Components, and Utilities. Each instrument has a specific purpose and unique attributes.',
      ],
      title: 'Instruments (Markup Structure)',
    },
  ],
  eyebrow: 'Getting Started',
  heroBullets: [
    'Use `Regions` for layout ownership, not reusable UI.',
    'Use `Components` for named interface pieces with clear inner structure.',
    'Use `Utilities` for tiny exceptions instead of bloating components.',
  ],
  heroParagraphs: [
    'VEAMS Methodology gives every piece of markup a clear job. **Regions** shape page structure, **Components** carry reusable UI, and **Utilities** handle small helper work. That keeps HTML legible and CSS predictable as the project grows.',
  ],
  id: 'overview',
  intro: 'Start with the mental model first: name by responsibility, not by convenience.',
  summary: 'Structure first. Scale without chaos.',
  title: 'Overview',
};
