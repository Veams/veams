import type { PackagePage } from '../../../types';
import { ventOverviewCards } from './overview.snippets';

export const overviewPage: PackagePage = {
  blocks: [
    {
      featureCards: ventOverviewCards,
      id: 'overview-shape',
      paragraphs: [
        'Vent is the smallest coordination layer in the VEAMS ecosystem: publish an event, let interested consumers react, and keep ownership local without creating another shared state store.',
      ],
      title: 'Keep event boundaries explicit',
    },
    {
      bullets: [
        'Use the root package for the event bus itself.',
        'Use `@veams/vent/react` only when React should manage subscription lifecycle.',
      ],
      id: 'entries',
      paragraphs: [
        'The package surface stays intentionally narrow. Most consumers only need the root bus and, in React applications, the provider-based subscription layer.',
      ],
      title: 'Three small entry points',
    },
  ],
  eyebrow: 'Getting Started',
  heroBullets: [
    'Typed topics and payloads over a tiny publish/subscribe core.',
    'Optional React bindings for provider-scoped subscriptions.',
    'A simple event boundary when a store would be heavier than the problem.',
  ],
  heroParagraphs: [
    'Vent gives you a focused event bus when one part of the app needs to signal another part without sharing state ownership. It fits short-lived coordination such as notifications, workflow signals, and integration points where a store would be heavier than the problem.',
  ],
  id: 'overview',
  intro:
    'Start with the root event bus, then add React bindings only when the component tree needs one shared instance.',
  summary: 'A narrow event bus for decoupled coordination.',
  title: 'Overview',
};
