import type { PackagePage } from '../../../types';

export const overviewPage: PackagePage = {
  blocks: [
    {
      bullets: [
        'Grow the service and state handler layer without rewriting component wiring.',
        'Let state and derived logic grow without adding more and more nested hooks to the view.',
        'Keep ownership clear: subscriptions, actions, and cleanup do not get stuck inside components.',
      ],
      id: 'why',
      paragraphs: [
        'The split between **service**, **state handler**, and the **component view** is the main benefit. Each layer can grow on its own. Business logic can get richer, state can get more complex, and the component stays focused on rendering snapshots and calling actions.',
        'This split keeps React components simple. You never have to wonder which nested hook owns a subscription, where cleanup happens, or which component quietly became the home of stateful behavior.',
      ],
      title: 'Why the split matters',
    },
    {
      bullets: [
        'Choose between local factory instances and shared singletons.',
        'Keep transitions, actions, and cleanup in one place.',
        'Let the UI stay unaware of the runtime underneath.',
      ],
      id: 'where-it-fits',
      paragraphs: [
        'Handlers own state transitions, expose actions, and clean up after themselves. You decide whether each component gets its own instance through a factory or shares a singleton. The UI does not need to know which one you chose.',
      ],
      title: 'Composable handlers with clear ownership',
    },
    {
      bullets: [
        'Handlers own transitions and action contracts.',
        'Components consume snapshots instead of mutating store internals directly.',
        'Lifecycle and teardown are part of the model, not an afterthought.',
      ],
      id: 'boundary',
      paragraphs: [
        'Status Quo has a clear opinion on boundaries. Stateful objects should be explicit, portable, and easy to dispose. That is why the handler API matters more than the hook layer around it.',
      ],
      title: 'Keep the boundary explicit',
    },
    {
      bullets: [
        'Native handlers are zero-dependency and perfect for simple state.',
        'Observable handlers are strong for stream-heavy composition.',
        'Signal handlers are strong for compact value-style reactivity.',
      ],
      id: 'swap-engine',
      paragraphs: [
        'One of the core ideas is that the reactive engine should be an implementation choice. Start with the zero-dependency native handler and scale up to observables or signals when necessary, without forcing the UI layer to relearn the state model.',
      ],
      title: 'Scale the engine, keep the API',
    },
  ],
  eyebrow: 'Getting Started',
  heroBullets: [
    'Zero-dependency native state handler by default.',
    'Small handler objects with explicit lifecycle.',
    'Snapshot subscriptions instead of framework-specific store APIs.',
  ],
  heroParagraphs: [
    'Status Quo treats state handlers as small, composable objects with explicit lifecycle and a tiny interface. The native handler has zero dependencies, making it the perfect starting point. When you need more, easily swap the engine under the hood: RxJS for observable streams or Preact Signals for ultra-light reactive state.',
  ],
  id: 'overview',
  intro:
    'Start with the mental model first: handlers own state and lifecycle, hooks only translate snapshots into the UI layer.',
  summary: 'State management that stays out of your way.',
  title: 'Overview',
};
