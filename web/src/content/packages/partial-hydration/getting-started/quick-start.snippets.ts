export const partialHydrationQuickStart = `import { createHydration } from '@veams/partial-hydration';
import { hydrateRoot } from 'react-dom/client';

// A simple React component
function Navigation({ title }: { title: string }) {
  return <nav><h1>{title}</h1></nav>;
}

Navigation.displayName = 'Navigation';

const hydration = createHydration({
  components: {
    // Key must match the wrapper's data-component value.
    // When using withHydration(), that value comes from Component.displayName.
    Navigation: {
      Component: Navigation,
      on: 'init',
      render: (Component, props, el) => {
        hydrateRoot(el, <Component {...props} />);
      }
    },
    // Lazy: Load non-critical UI only when it enters the viewport
    HeavyChart: {
      Component: () => import('./HeavyChart'),
      on: 'in-viewport',
      render: async (Loader, props, el) => {
        const mod = await Loader();
        const Component = mod.default;

        hydrateRoot(el, <Component {...props} />);
      }
    }
  }
});

// Start scanning the DOM for these components
hydration.init(document);`;
