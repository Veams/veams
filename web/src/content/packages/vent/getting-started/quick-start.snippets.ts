export const ventQuickStart = `import createVent from '@veams/vent';

type Events = 'release:queued' | 'release:clear';

type ReleaseMessage = {
  channel: 'docs' | 'ops' | 'ui';
  text: string;
};

const vent = createVent<Events, ReleaseMessage>();

vent.subscribe('release:queued', (payload) => {
  console.log('queued for', payload.channel, payload.text);
});

vent.publish('release:queued', {
  channel: 'docs',
  text: 'Ship the package page before form.',
});`;

export const ventReactQuickStart = `import createVent from '@veams/vent';
import { VentProvider, useVent, useVentSubscribe } from '@veams/vent/react';

type Events = 'release:queued' | 'release:clear';
type ReleaseMessage = {
  channel: 'docs' | 'ops' | 'ui';
  text: string;
};

const vent = createVent<Events, ReleaseMessage>();

function Composer() {
  const eventBus = useVent<Events, ReleaseMessage>();

  return (
    <button
      onClick={() =>
        eventBus.publish('release:queued', {
          channel: 'docs',
          text: 'Ship the package page before form.',
        })
      }
      type="button"
    >
      Publish
    </button>
  );
}

function Feed() {
  useVentSubscribe<Events, ReleaseMessage>('release:queued', (payload) => {
    console.log(payload.text);
  });

  return null;
}

function App() {
  return (
    <VentProvider instance={vent}>
      <Composer />
      <Feed />
    </VentProvider>
  );
}`;
