/**
 * React context and provider for managing hydration metadata.
 */
import React, { createContext, useContext, useRef } from 'react';

import type { ComponentType, PropsWithChildren } from 'react';

/**
 * Metadata carried through the component tree for a hydrated unit.
 */
type ProviderValues = {
  // Unique ID for the hydration unit.
  componentId: string;
  // Function to generate stable sub-IDs within this unit.
  getCounter: () => number | null;
};

/**
 * Context holding the hydration metadata.
 */
const HydrationContext = createContext<ProviderValues>({
  componentId: '',
  getCounter: () => null,
});

/**
 * Props for the HydrationProvider.
 */
type HydrationProviderProps = PropsWithChildren<Pick<ProviderValues, 'componentId'>>;

/**
 * Factory for a simple incrementing counter.
 */
function createCounter() {
  let i = 0;

  return () => {
    i += 1;
    return i;
  };
}

/**
 * Provider component that initializes hydration metadata for a subtree.
 */
const HydrationProvider = (props: HydrationProviderProps) => {
  const { children, ...providerValues } = props;
  // Ensure the counter factory is created once per provider mount.
  const dataRef = useRef({ ...providerValues, getCounter: createCounter() });

  return <HydrationContext.Provider value={dataRef.current}>{children}</HydrationContext.Provider>;
};
HydrationProvider.displayName = 'HydrationProvider';

/**
 * HOC that wraps a component with a HydrationProvider.
 */
function withHydrationProvider<P>(props: HydrationProviderProps, Component: ComponentType<P>) {
  const WrappedWithHydrationProvider = (cmpProps: P) => {
    return (
      <HydrationProvider {...props}>
        <Component {...(cmpProps as P & React.JSX.IntrinsicAttributes)} />
      </HydrationProvider>
    );
  };

  WrappedWithHydrationProvider.displayName = `HydrationProvider${Component.displayName}`;

  return WrappedWithHydrationProvider;
}

/**
 * Hook to retrieve a stable, unique ID for the current component.
 * Useful for ensuring IDs match between server and client during partial hydration.
 */
function useIsomorphicId() {
  const { componentId, getCounter } = useContext(HydrationContext);
  const ref = useRef<string | null>(null);

  if (!ref.current) {
    const counter = getCounter();
    ref.current = counter !== null ? `${componentId}_${counter}` : componentId;
  }

  return ref.current;
}

export { HydrationProvider, useIsomorphicId, withHydrationProvider };
