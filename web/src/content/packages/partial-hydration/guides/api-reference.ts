import type { PackagePage } from '../../../types';
import { partialHydrationApiExample } from './api-reference.snippets';

export const apiReferencePage: PackagePage = {
  blocks: [
    {
      codeExamples: [
        {
          code: partialHydrationApiExample,
          label: 'Public entry points',
          language: 'ts',
        },
      ],
      id: 'entry-points',
      paragraphs: [
        'The package surface is focused on three main exports: the client-side hydration engine, the SSR metadata binder, and the isomorphic ID helper.',
      ],
      title: 'Entry points',
    },
    {
      bullets: [
        '`createHydration(options)` takes one `HydrationOptions` object.',
        '`options.components` maps each `data-component` value to `{ Component, on, render, config? }`.',
        'Returns a controller with `init(context)` and `clearAllObservers()`. `init(context)` accepts `document` or a specific `HTMLElement`.',
      ],
      id: 'create-hydration-api',
      paragraphs: [
        'Use `createHydration` to define your client-side activation logic. It works with any framework: you define exactly how each component renders in the `render` callback.',
      ],
      title: 'createHydration',
    },
    {
      bullets: [
        '`HydrationProvider({ componentId, children })` takes one hydration unit id and a subtree.',
        '`componentId` seeds the stable id namespace used by `useIsomorphicId()` inside that subtree.',
        'Use it directly when you need a custom wrapper shape instead of the default `withHydration()` markup helper.',
      ],
      id: 'hydration-provider-api',
      paragraphs: [
        'This provider is the metadata bridge between server markup and client hydration. Most React setups get it automatically through `withHydration()`.',
      ],
      title: 'HydrationProvider',
    },
    {
      bullets: [
        '`useIsomorphicId()` takes no parameters.',
        'Returns a stable string id derived from the current hydration unit and an internal counter.',
        'Use it for `id`, `htmlFor`, and aria relationships that must match between server HTML and the hydrated client tree.',
      ],
      id: 'use-isomorphic-id-api',
      paragraphs: [
        'This hook keeps accessibility ids deterministic across the server-rendered and hydrated passes.',
      ],
      title: 'useIsomorphicId',
    },
    {
      bullets: [
        '`withHydration(Component, config?)` takes the React component to wrap and an optional wrapper config.',
        '`config?.modifiers` adds wrapper classes. `config?.attributes` adds extra HTML attributes to the generated wrapper element.',
        'Returns a wrapped React component that serializes props and emits the matching `data-component={Component.displayName}` markup during SSR.',
      ],
      id: 'with-hydration-api',
      paragraphs: [
        'Use `withHydration` during SSR so the client-side loader gets all the data it needs to activate the component. The client-side `components` key must match the wrapped component `displayName`, because that value ends up in `data-component`.',
      ],
      title: 'withHydration',
    },
    {
      bullets: [
        '`withHydrationProvider(props, Component)` takes provider props plus the component to wrap.',
        '`props.componentId` defines the hydration unit id that should be exposed to the subtree.',
        'Returns a component already wrapped in `HydrationProvider`, which is useful for custom SSR pipelines and advanced composition.',
      ],
      id: 'with-hydration-provider-api',
      paragraphs: [
        'This helper is the low-level provider HOC. It is most useful when the hydration metadata already exists and you only need to reapply it around a component boundary.',
      ],
      title: 'withHydrationProvider',
    },
  ],
  eyebrow: 'Guides',
  id: 'api-reference',
  intro: 'A small API that covers the whole Islands Architecture setup.',
  summary: 'Core factory and bindings reference.',
  title: 'API Reference',
};
