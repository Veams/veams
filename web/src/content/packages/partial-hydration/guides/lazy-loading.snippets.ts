export const partialHydrationLazyExample = `const hydration = createHydration({
  components: {
    // Must match the wrapper's data-component value.
    HeavyChart: {
      // Return a dynamic import instead of the component itself
      Component: () => import('./HeavyChart'),
      on: 'in-viewport',
      render: async (Loader, props, el) => {
        // Await the loader to get the module when the trigger fires
        const mod = await Loader();
        const Component = mod.default;

        // Hydrate the server-rendered markup
        hydrateRoot(el, <Component {...props} />);
      }
    }
  }
});`;
