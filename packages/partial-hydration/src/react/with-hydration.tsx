/**
 * HOC for preparing a React component for partial hydration.
 */
import React, { Fragment } from 'react';

import { scriptEncode } from '../utils/script-replacer.js';
import { HydrationProvider } from './hydration.provider.js';

import type { ComponentType, JSX } from 'react';
import { randomId } from '../utils/random-id.js';

/**
 * Configuration options for the withHydration HOC.
 */
type WithHydrationConfig = {
  // Optional CSS class names for the wrapper element.
  modifiers?: string;
  // Optional HTML attributes for the wrapper element.
  attributes?: Record<string, string>;
};

/**
 * High-Order Component that prepares a component for client-side hydration.
 *
 * It does two main things:
 * 1. Serializes props into a hidden script tag so the client can read them.
 * 2. Wraps the component in a uniquely identified div that the client-side loader can target.
 *
 * NOTE: The Component must have a stable displayName for correct client-side matching.
 */
export function withHydration<P = unknown>(
  Component: ComponentType<P>,
  config?: WithHydrationConfig
): (props: P) => JSX.Element {
  const WrappedWithHydration = ({ ...props }: P) => {
    // Generate a unique ID for this specific instance.
    const id = randomId();
    const cmpId = `${Component.displayName}-${id}`;

    return (
      <Fragment>
        {/* Store the component props in the DOM for the client to pick up */}
        <script
          type="application/hydration-data"
          data-internal-ref={cmpId}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Props are internally generated and considered safe.
          dangerouslySetInnerHTML={{ __html: scriptEncode(JSON.stringify(props)) }}
        />
        {/* Wrapper element that the client-side createHydration logic targets */}
        <div
          data-component={Component.displayName}
          data-internal-id={cmpId}
          className={config?.modifiers}
          {...config?.attributes}
        >
          {/* Provide the componentId to the subtree via context */}
          <HydrationProvider componentId={cmpId}>
            <Component {...(props as P & React.JSX.IntrinsicAttributes)} />
          </HydrationProvider>
        </div>
      </Fragment>
    );
  };
  WrappedWithHydration.displayName = `Wrapped${Component.displayName}`;

  return WrappedWithHydration;
}
