import createEventHandling, { type EventHandler } from '../event-handler.js';

export interface EventMap {
  [name: string]: string;
}

export interface VentOptions {
  furtherEvents?: EventMap;
}

export interface VeamsWithVent {
  EVENTS?: EventMap;
  Vent?: EventHandler<string>;
  [key: string]: unknown;
}

export interface VentPluginDefinition {
  initialize: (
    this: VentPluginDefinition,
    veams: VeamsWithVent,
    options?: VentOptions
  ) => VeamsWithVent;
  options: Required<VentOptions>;
  pluginName: string;
}

const DEFAULT_OPTIONS: Required<VentOptions> = {
  furtherEvents: {},
};

const VentPlugin: VentPluginDefinition = {
  initialize(
    this: VentPluginDefinition,
    veams: VeamsWithVent,
    options: VentOptions = {}
  ): VeamsWithVent {
    this.options = {
      furtherEvents: {
        ...DEFAULT_OPTIONS.furtherEvents,
        ...(options.furtherEvents ?? {}),
      },
    };

    veams.Vent = createEventHandling();
    veams.EVENTS = {
      ...(veams.EVENTS ?? {}),
      ...this.options.furtherEvents,
    };

    return veams;
  },
  options: {
    furtherEvents: {},
  },
  pluginName: 'Vent',
};

export default VentPlugin;
