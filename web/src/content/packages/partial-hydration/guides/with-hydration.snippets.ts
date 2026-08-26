export const partialHydrationHocConfigExample = `import { withHydration } from '@veams/partial-hydration/react';

const MyComponent = ({ title }: { title: string }) => <h1>{title}</h1>;

MyComponent.displayName = 'MyComponent';

// Add custom classes and attributes to the wrapper div
export const MyHydratedComponent = withHydration(MyComponent, {
  modifiers: 'my-custom-wrapper-class',
  attributes: {
    'data-testid': 'hydrated-wrapper',
    'aria-live': 'polite'
  }
});
`;
