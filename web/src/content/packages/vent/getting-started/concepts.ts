import type { PackagePage } from '../../../types';

export const conceptsPage: PackagePage = {
  blocks: [
    {
      bullets: [
        'Events represent something that happened, not long-lived state.',
        'Publishers should not know which subscribers exist.',
        'Subscribers can be replaced, added, or removed without changing the publisher flow.',
      ],
      id: 'event-model',
      paragraphs: [
        'Vent works best for short-lived coordination. If a value must stay readable over time, use a state handler. If the important thing is that something happened and several listeners may react, an event bus is the simpler fit.',
      ],
      title: 'Choose events for short-lived coordination',
    },
    {
      bullets: [
        'Use one event bus per feature boundary when possible.',
        'Keep topic names explicit, usually namespaced by feature or workflow.',
        'Prefer typed payloads over `any` so event contracts stay readable.',
      ],
      id: 'contracts',
      paragraphs: [
        'A good Vent setup is intentionally boring: one clear topic vocabulary, payloads that describe the event data, and subscribers that only do their own work after the event is emitted.',
      ],
      title: 'Treat topics as contracts',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'concepts',
  intro:
    'Use Vent when coordination should stay decoupled and short-lived, not when you need another source of durable state.',
  summary: 'Events for signals, state for ownership.',
  title: 'Concepts',
};
