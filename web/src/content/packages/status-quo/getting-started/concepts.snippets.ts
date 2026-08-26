import type { FeatureCard } from '../../../types';

export const statusQuoPhilosophyCards: FeatureCard[] = [
  {
    description:
      'The native handler has zero dependencies. When you need more, move to RxJS or Signals without rewriting your components. Stores keep the same shape; only the internal runtime changes.',
    title: 'Zero dependencies, total scale',
    visual: 'swap-engine',
  },
  {
    description:
      'Handlers own transitions and expose actions. Views subscribe to snapshots and never touch store internals.',
    title: 'Separate view and state',
    visual: 'view-state',
  },
  {
    description:
      'Your state logic lives outside any UI library. Hooks provide the glue, not the business logic.',
    title: 'Framework-agnostic core',
    visual: 'framework-core',
  },
];
