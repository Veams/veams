import type { PackagePage } from '../../../types';

export const landingPage: PackagePage = {
  blocks: [],
  eyebrow: 'Welcome',
  featureCards: [
    {
      description:
        'A structural CSS and HTML methodology to keep large codebases scalable and predictable.',
      link: '/packages/methodology/overview',
      title: 'Methodology',
      visual: 'methodology-layout',
    },
    {
      description:
        'State handlers that work with any framework, plus React hooks and a clear lifecycle.',
      link: '/packages/status-quo/overview',
      title: 'Status Quo',
      visual: 'framework-core',
    },
    {
      description:
        'Stable query and mutation handles on top of TanStack Query, plus a central query manager.',
      link: '/packages/status-quo-query/overview',
      title: 'Status Quo Query',
      visual: 'query-facade',
    },
    {
      description:
        'A typed publish/subscribe bus with optional React bindings for provider-scoped subscriptions.',
      link: '/packages/vent/overview',
      title: 'Vent',
      visual: 'vent-card-publish',
    },
    {
      description:
        'A generic form state engine with optional React bindings for fast, uncontrolled inputs.',
      link: '/packages/form/overview',
      title: 'Form',
      visual: 'form-architecture',
    },
    {
      description: 'A collection of high-performance CSS animations for modern web applications.',
      link: '/packages/css-animations/overview',
      title: 'CSS Animations',
      visual: 'css-animations-architecture',
    },
    {
      description:
        'Activate interactive components in a static HTML environment using the Islands Architecture.',
      link: '/packages/partial-hydration/overview',
      title: 'Partial Hydration',
      visual: 'partial-hydration-architecture',
    },
  ],
  heroParagraphs: [
    'VEAMS is a set of small packages that keep your frontend **clean**, **scalable**, and **fast** without too much magic! They cover structure rules, state management, forms, events, and partial hydration. Each tool solves one problem and does not tie your business logic to a specific UI framework.',
  ],
  id: 'landing',
  intro: '',
  summary: 'The Architectural Blueprint for Modern Frontends.',
  title: 'Ecosystem Overview',
};
