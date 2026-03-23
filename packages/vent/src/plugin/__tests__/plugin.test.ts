import VentPlugin from '../vent.js';

describe('VentPlugin', () => {
  it('attaches a vent instance and merges further events', () => {
    const Veams = {
      EVENTS: {
        resize: 'resize',
      },
    };

    const result = VentPlugin.initialize.call(VentPlugin, Veams, {
      furtherEvents: {
        custom: 'custom',
      },
    });

    expect(result.EVENTS).toEqual({
      custom: 'custom',
      resize: 'resize',
    });
    expect(result.Vent).toBeDefined();
    expect(typeof result.Vent?.publish).toBe('function');
  });

  it('does not require an existing EVENTS object', () => {
    const result = VentPlugin.initialize.call(VentPlugin, {}, {
      furtherEvents: {
        custom: 'custom',
      },
    });

    expect(result.EVENTS).toEqual({
      custom: 'custom',
    });
  });
});
