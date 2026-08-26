export const partialHydrationCreateOptionsExample = `const hydration = createHydration({
  components: {
    // Key must match the wrapper's data-component attribute in the DOM.
    // withHydration() writes data-component from Component.displayName.
    'SearchFilter': {
      // The actual component instance or a dynamic import factory.
      Component: () => import('./SearchFilter'),
      
      // Activation strategy: 'init', 'dom-ready', 'fonts-ready', 'in-viewport'.
      on: 'in-viewport',
      
      // Optional: configuration for the 'in-viewport' IntersectionObserver.
      config: {
        rootMargin: '200px'
      },
      
      // Render function: called with Component, parsed Props, and the DOM Element. Can be async.
      render: async (Loader, props, el, id) => {
        const mod = await Loader();
        const Component = mod.default;
        const root = createRoot(el);
        root.render(<Component {...props} />);
      }
    }
  }
});`;
