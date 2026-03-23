# @veams/vent

Vent is a small publish/subscribe utility for loosely coupled modules.

For a file-by-file implementation walkthrough, see [`LINE_BY_LINE.md`](./LINE_BY_LINE.md).

## Install

```bash
npm install @veams/vent
```

## Package Exports

Root exports:

- `createEventHandling` as the default export
- `EventHandler`
- `EventCallback`

Subpath exports:

- `@veams/vent/react`
- `@veams/vent/plugin`
- `@veams/vent/plugin/vent`

## Quickstart

```ts
import createVent from '@veams/vent';

type Events = 'scroll' | 'custom:event';

const vent = createVent<Events>();

const handleCustomEvent = (payload: { testData: string }) => {
  console.log(payload.testData);
};

vent.subscribe('custom:event', handleCustomEvent);
vent.subscribe('scroll', () => {
  vent.publish('custom:event', { testData: 'Hello from Vent' });
  vent.unsubscribe('custom:event', handleCustomEvent);
});
```

You can subscribe to multiple topics at once by passing a space-separated string:

```ts
vent.subscribe('scroll custom:event', (payload) => {
  console.log(payload);
});
```

## Veams Plugin

The plugin attaches a shared event handler to `Veams.Vent` and merges additional event names into `Veams.EVENTS`.

```ts
import Veams from '@veams/core';
import VentPlugin from '@veams/vent/plugin';
import EVENTS from './custom-events';

Veams.onInitialize(() => {
  Veams.use(VentPlugin, {
    furtherEvents: EVENTS,
  });
});
```

## React

The React entry stays intentionally small and only covers provider-based wiring.

```tsx
import createVent from '@veams/vent';
import { VentProvider, useVentSubscribe } from '@veams/vent/react';

const vent = createVent<'toast'>(); 

function ToastListener() {
  useVentSubscribe('toast', (message) => {
    console.log(message);
  });

  return null;
}

function App() {
  return (
    <VentProvider instance={vent}>
      <ToastListener />
    </VentProvider>
  );
}
```

## API

### `vent.subscribe(topic, callback)`

Registers a callback for a topic. Alias: `vent.on(...)`.

### `vent.unsubscribe(topic, callback, completely?)`

Removes a previously registered callback. Alias: `vent.off(...)`.

If `completely` is `true`, the topic entry is removed after matching callbacks are detached.

### `vent.publish(topic, data?, scope?)`

Notifies subscribers of a topic. Alias: `vent.trigger(...)`.

If `scope` is omitted, the vent instance is used as the callback context.
