import createEventHandling from '../index.js';

type Events = 'onCustomChange' | 'onPurposeChange';

describe('Event Handler', () => {
  it('notifies subscriber', (done) => {
    const Vent = createEventHandling<Events>();

    Vent.subscribe('onCustomChange', (val) => {
      expect(val).toBe('foo');
      done();
    });

    Vent.publish('onCustomChange', 'foo');
  });

  it('calls the subscriber function', () => {
    const Vent = createEventHandling();
    const stub = jest.fn();

    Vent.subscribe('onCustomChange', stub);
    Vent.subscribe('onCustomChange', stub);
    Vent.publish('onCustomChange', 'foo');

    expect(stub).toHaveBeenCalledTimes(2);
  });

  it('calls the subscriber function on multiple events', () => {
    const Vent = createEventHandling<Events>();
    const stub = jest.fn();

    Vent.subscribe('onCustomChange onPurposeChange' as 'onCustomChange', stub);
    Vent.publish('onCustomChange', 'foo');
    Vent.publish('onPurposeChange', 'foo');

    expect(stub).toHaveBeenCalledTimes(2);
  });

  it('does not call different subscriber function', () => {
    const Vent = createEventHandling();
    const stub = jest.fn();

    Vent.subscribe('onCustomChange', stub);
    Vent.subscribe('test', stub);
    Vent.subscribe('test2', stub);
    Vent.publish('onCustomChange', 'foo');

    expect(stub).toHaveBeenCalledTimes(1);
  });

  it('does not call the subscriber function after unsubscribing from it', () => {
    const Vent = createEventHandling();
    const stub = jest.fn();

    Vent.subscribe('onCustomChange', stub);
    Vent.unsubscribe('onCustomChange', stub);
    Vent.publish('onCustomChange', 'foo');

    expect(stub).toHaveBeenCalledTimes(0);
  });

  it('does not throw when unsubscribing from an unknown topic', () => {
    const Vent = createEventHandling<Events>();
    const stub = jest.fn();

    expect(() => {
      Vent.unsubscribe('onCustomChange', stub);
    }).not.toThrow();
  });

  it('exposes aliases for publish, subscribe and unsubscribe', () => {
    const Vent = createEventHandling<Events>();
    const stub = jest.fn();

    Vent.on('onCustomChange', stub);
    Vent.trigger('onCustomChange', 'foo');
    Vent.off('onCustomChange', stub);
    Vent.trigger('onCustomChange', 'bar');

    expect(stub).toHaveBeenCalledTimes(1);
    expect(stub).toHaveBeenCalledWith('foo');
  });

  it('unsubscribes from multiple topics passed as a single string', () => {
    const Vent = createEventHandling<Events>();
    const stub = jest.fn();

    Vent.subscribe('onCustomChange onPurposeChange', stub);
    Vent.unsubscribe('onCustomChange onPurposeChange', stub);
    Vent.publish('onCustomChange', 'foo');
    Vent.publish('onPurposeChange', 'bar');

    expect(stub).not.toHaveBeenCalled();
  });
});
