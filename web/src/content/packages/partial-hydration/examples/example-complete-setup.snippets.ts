export const partialHydrationCompleteExample = `// 1. Server-Side (or Static Site Generation)
import { withHydration } from '@veams/partial-hydration/react';
import { Navigation } from './Navigation';
import { HeavyChart } from './HeavyChart';

// Wrap components to inject hydration metadata into HTML
Navigation.displayName = 'Navigation';
const HydratedNav = withHydration(Navigation);

HeavyChart.displayName = 'HeavyChart';
const HydratedChart = withHydration(HeavyChart);

export function Page() {
  return (
    <main>
      <HydratedNav items={['Home', 'About']} />
      <article>Static content here...</article>
      <HydratedChart data={[1, 2, 3]} />
    </main>
  );
}

// 2. Client-Side (Entry Point)
import { createHydration } from '@veams/partial-hydration';
import { hydrateRoot } from 'react-dom/client';
import { Navigation } from './Navigation'; // Imported immediately

const hydration = createHydration({
  components: {
    // Keys must match the server-rendered data-component values.
    Navigation: {
      Component: Navigation,
      on: 'init',
      render: (Component, props, el) => {
        hydrateRoot(el, <Component {...props} />);
      }
    },
    // Lazy: Load heavy UI only when scrolled into view
    HeavyChart: {
      Component: () => import('./HeavyChart'),
      on: 'in-viewport',
      config: { rootMargin: '200px' },
      render: async (Loader, props, el) => {
        const mod = await Loader();
        const Component = mod.default ?? mod.HeavyChart;

        hydrateRoot(el, <Component {...props} />);
      }
    }
  }
});

// Start the hydration engine
hydration.init(document);`;
