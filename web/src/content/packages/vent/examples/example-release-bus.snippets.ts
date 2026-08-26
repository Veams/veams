export const ventExampleSetup = `import createVent from '@veams/vent';
import { VentProvider } from '@veams/vent/react';

type EventTopic = 'release:queued' | 'release:clear';
type ReleaseMessage = {
  channel: 'docs' | 'ops' | 'ui';
  text: string;
};

const vent = createVent<EventTopic, ReleaseMessage>();

function App() {
  return <VentProvider instance={vent}>{/* children */}</VentProvider>;
}`;

export const ventExampleSubscribers = `import { useVent, useVentSubscribe } from '@veams/vent/react';

function Composer() {
  const vent = useVent<'release:queued' | 'release:clear', ReleaseMessage>();

  return (
    <button
      onClick={() =>
        vent.publish('release:queued', {
          channel: 'ops',
          text: 'Queue the rollout.',
        })
      }
      type="button"
    >
      Publish event
    </button>
  );
}

function Metrics() {
  useVentSubscribe<'release:queued' | 'release:clear', ReleaseMessage>(
    'release:queued',
    (payload) => {
      console.log('metrics update', payload.channel);
    }
  );

  return null;
}`;
