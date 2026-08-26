export const ventPluginSetup = `import Veams from '@veams/core';
import VentPlugin from '@veams/vent/plugin';

Veams.onInitialize(() => {
  Veams.use(VentPlugin, {
    furtherEvents: {
      'release:queued': 'release:queued',
      'release:clear': 'release:clear',
    },
  });
});`;
