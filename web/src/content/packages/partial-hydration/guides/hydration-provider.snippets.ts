export const partialHydrationProviderExample = `import { HydrationProvider } from '@veams/partial-hydration/react';

function CustomHydrationWrapper({
  children,
  cmpId,
  componentName,
}: {
  children: React.ReactNode;
  cmpId: string;
  componentName: string;
}) {
  return (
    <div data-component={componentName} data-internal-id={cmpId}>
      {/* Provide the ID to the React tree */}
      <HydrationProvider componentId={cmpId}>
        {children}
      </HydrationProvider>
    </div>
  );
}`;
