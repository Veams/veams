import type { PackagePage } from '../../../types';
import { ventPluginSetup } from './api.snippets';

export const apiPage: PackagePage = {
  blocks: [
    {
      paragraphs: [
        'Use the root package for the generic event bus, `@veams/vent/react` for the React provider and hooks, and `@veams/vent/plugin` only when your runtime already revolves around Veams globals.',
      ],
      id: 'entry-points',
      title: 'Entry points',
    },
    {
      bullets: [
        '`createEventHandling()` takes no runtime parameters.',
        'Its generic parameters let you type topics, payloads, and callback scope when you need stricter contracts.',
        'Returns one `EventHandler` instance with `publish`, `subscribe`, `unsubscribe`, and their aliases.',
      ],
      id: 'create-event-handling',
      paragraphs: [
        'Use `createEventHandling()` from the root package when you want a plain event bus with no framework dependency. This is the primary entrypoint for Vent.',
      ],
      title: 'createEventHandling',
    },
    {
      bullets: [
        '`publish(topic, data?, scope?)` emits one event for one topic. `data?` is the payload and `scope?` becomes the callback `this` context.',
        '`subscribe(topic, callback)` registers one callback for one or multiple space-separated topics.',
        '`unsubscribe(topic, callback, completely?)` removes callback registrations. Set `completely` to `true` when you also want empty topic buckets removed immediately.',
        'Aliases are `trigger` for `publish`, `on` for `subscribe`, and `off` for `unsubscribe`.',
      ],
      id: 'event-handler',
      paragraphs: [
        'The `EventHandler` API stays intentionally small. It only deals with event publishing and subscription lifecycle. There is no state snapshot layer in this package.',
      ],
      title: 'EventHandler',
    },
    {
      codeExamples: [
        {
          code: ventPluginSetup,
          label: 'Plugin entry',
          language: 'ts',
        },
      ],
      bullets: [
        'Import the default plugin export from `@veams/vent/plugin` and call `initialize(veams, options?)`.',
        '`veams` is the host object to enrich. `options?.furtherEvents` lets you merge additional event names into `Veams.EVENTS`.',
        'The plugin attaches `Veams.Vent` and keeps this global integration out of the generic root API.',
      ],
      id: 'plugin-api',
      paragraphs: [
        'Use the plugin entry when your runtime already revolves around Veams and you want the bus attached there. The plugin remains a separate concern so the root package stays generic.',
      ],
      title: 'VentPlugin.initialize',
    },
    {
      bullets: [
        '`VentProvider({ children, instance })` takes one existing bus instance and exposes it through React context.',
        '`children` is the subtree that should share the bus. `instance` is the `EventHandler` to provide.',
        'Use it when multiple components in one subtree should publish and subscribe against the same bus instance.',
      ],
      id: 'vent-provider',
      paragraphs: [
        'The React subpath stays narrow on purpose. `VentProvider` only shares an existing bus; it does not add selectors, caching, or another abstraction on top.',
      ],
      title: 'VentProvider',
    },
    {
      bullets: [
        '`useVent()` takes no parameters.',
        'Returns the current `EventHandler` from the nearest `VentProvider`.',
        'Throws when used outside a `VentProvider`, so a missing provider fails fast.',
      ],
      id: 'use-vent',
      paragraphs: [
        'Use `useVent()` when a component needs direct access to the provided bus instance for manual publish or subscribe composition.',
      ],
      title: 'useVent',
    },
    {
      bullets: [
        '`useVentSubscribe(topic, callback)` subscribes inside an effect and cleans up automatically.',
        '`topic` can be one topic or a space-separated topic string. `callback` receives the typed payload and preserves the event scope binding.',
        'Use it when a component should react to bus events without manually wiring subscription lifecycle.',
      ],
      id: 'use-vent-subscribe',
      paragraphs: [
        'This hook is the convenience path for React subscribers. It keeps effect cleanup consistent while leaving the event model itself unchanged.',
      ],
      title: 'useVentSubscribe',
    },
  ],
  eyebrow: 'API',
  id: 'api',
  intro:
    'The public surface is split into one generic event bus, one narrow React entry, and one separate plugin entry.',
  summary: 'Everything the package exposes, without extra layers.',
  title: 'API Reference',
};
