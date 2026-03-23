# @veams/partial-hydration

Selective hydration infrastructure for static HTML and islands-style UI delivery.

This package provides a framework-agnostic client-side hydration engine and optional React helpers for server-rendered markup preparation.

## Docs

Live docs:

[https://veams.github.io/status-quo/packages/partial-hydration/overview](https://veams.github.io/status-quo/packages/partial-hydration/overview)

## Install

```bash
npm install @veams/partial-hydration
```

If you want to use the React bindings:

```bash
npm install @veams/partial-hydration react react-dom
```

## Package Exports

Root entrypoint:

- `createHydration`
- `HydrationOptions`
- `ComponentOption`

React entrypoint:

- `@veams/partial-hydration/react`
- `withHydration`
- `withHydrationProvider`
- `useIsomorphicId`

## Overview

`@veams/partial-hydration` is built around a simple contract:

1. Server rendering emits static HTML for an interactive island.
2. Serialized props are stored in a nearby `<script type="application/hydration-data">`.
3. The client scans the DOM for `[data-component]`, uses that value to look up the registered component, and activates it when its trigger fires.

The core stays framework-neutral. You decide how rendering happens in the `render()` callback.

## Quick Start

Create one hydration instance on the client and register your interactive islands:

```tsx
import { hydrateRoot } from 'react-dom/client';
import { createHydration } from '@veams/partial-hydration';

import { NewsletterForm } from './NewsletterForm';

type NewsletterProps = {
  title: string;
};

NewsletterForm.displayName = 'NewsletterForm';

const hydration = createHydration({
  components: {
    // The key must match the wrapper's data-component value.
    // When using withHydration(), that value comes from Component.displayName.
    NewsletterForm: {
      Component: NewsletterForm,
      on: 'in-viewport',
      render: (Component, props, element) => {
        hydrateRoot(element, <Component {...props} />);
      },
    },
  },
});

hydration.init(document);
```

Available triggers:

- `init`
- `dom-ready`
- `fonts-ready`
- `in-viewport`

For `in-viewport`, you can also pass:

```ts
config: {
  rootMargin: '200px';
}
```

## React SSR Flow

Use `withHydration()` during server rendering to generate the wrapper and serialized props automatically:

```tsx
import { withHydration, useIsomorphicId } from '@veams/partial-hydration/react';

type NewsletterProps = {
  title: string;
};

function NewsletterForm({ title }: NewsletterProps) {
  const id = useIsomorphicId();

  return (
    <section aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <button type="button">Subscribe</button>
    </section>
  );
}

NewsletterForm.displayName = 'NewsletterForm';

export const HydratedNewsletterForm = withHydration(NewsletterForm, {
  modifiers: 'island island-newsletter',
  attributes: {
    'data-testid': 'newsletter-island',
  },
});
```

`withHydration()` does three things:

- serializes props into a script tag
- adds a wrapper with `data-component={Component.displayName}` and `data-internal-id`
- injects `HydrationProvider` so `useIsomorphicId()` stays stable inside the hydrated subtree

That means the client-side registration key in `createHydration({ components })` must match the wrapped component's `displayName`.

## Generated DOM Shape

The client-side loader expects this structure:

```html
<script type="application/hydration-data" data-internal-ref="NewsletterForm-abc123">
  {"title":"Weekly updates"}
</script>
<div
  data-component="NewsletterForm"
  data-internal-id="NewsletterForm-abc123"
  class="island island-newsletter"
></div>
```

`data-component="NewsletterForm"` is the primary lookup value. The hydration engine uses it to find `components.NewsletterForm` on the client.

If the script is moved away from the wrapper before hydration, the package can still reconnect both nodes through `data-internal-ref` and `data-internal-id`.

## Lazy Loading

You can defer downloading component code until activation:

```tsx
import { hydrateRoot } from 'react-dom/client';
import { createHydration } from '@veams/partial-hydration';

type ChartProps = {
  title: string;
};

const hydration = createHydration({
  components: {
    // Must match the wrapper's data-component value in the DOM.
    HeavyChart: {
      Component: () => import('./HeavyChart'),
      on: 'in-viewport',
      config: {
        rootMargin: '300px',
      },
      render: async (loadComponent, props, element) => {
        const module = await loadComponent();
        hydrateRoot(element, <module.default {...props} />);
      },
    },
  },
});

hydration.init(document);
```

## API Notes

- `createHydration(options)` returns `{ init(context), clearAllObservers() }`.
- `init(context)` accepts `document` or a specific `HTMLElement`.
- Components are marked with `data-initialized="true"` after successful activation.
- The browser dispatches a `hydration:component:rendered` event after each successful render.

## Important Constraints

- React components wrapped with `withHydration()` must have a stable `displayName`. It is written to `data-component` and used for client-side matching.
- Props must be serializable to JSON.
- The root package is framework-agnostic. React-specific helpers only live under `@veams/partial-hydration/react`.

## Development

```bash
npm run build --workspace=@veams/partial-hydration
npm run test --workspace=@veams/partial-hydration
```
