import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import createEventHandling from '../../event-handler.js';
import { VentProvider, useVent, useVentSubscribe } from '../index.js';

declare global {
  // React 19 requires this flag in test environments that use manual act() calls.

  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

type TestTopic = 'scroll' | 'resize';

type TestPayload = {
  value: string;
};

function VentConsumer({
  onReady,
}: {
  onReady: (vent: ReturnType<typeof createEventHandling<TestTopic, TestPayload>>) => void;
}) {
  const vent = useVent<TestTopic, TestPayload>();

  onReady(vent);

  return null;
}

function Subscriber({
  onEvent,
  topic,
}: {
  onEvent: (payload: TestPayload) => void;
  topic: string;
}) {
  useVentSubscribe<TestTopic, TestPayload>(topic, onEvent);

  return null;
}

describe('VentProvider', () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });

    container.remove();
  });

  afterAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  });

  it('should expose the provided vent instance', () => {
    const vent = createEventHandling<TestTopic, TestPayload>();
    const readySpy = jest.fn<void, [ReturnType<typeof createEventHandling<TestTopic, TestPayload>>]>();

    act(() => {
      root.render(
        <VentProvider instance={vent}>
          <VentConsumer onReady={readySpy} />
        </VentProvider>
      );
    });

    expect(readySpy).toHaveBeenCalledWith(vent);
  });

  it('should subscribe through the provider and cleanup on unmount', () => {
    const vent = createEventHandling<TestTopic, TestPayload>();
    const eventSpy = jest.fn<void, [TestPayload]>();

    act(() => {
      root.render(
        <VentProvider instance={vent}>
          <Subscriber onEvent={eventSpy} topic="scroll" />
        </VentProvider>
      );
    });

    act(() => {
      vent.publish('scroll', { value: 'first' });
    });

    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenLastCalledWith({ value: 'first' });

    act(() => {
      root.render(
        <VentProvider instance={vent}>
          <React.Fragment />
        </VentProvider>
      );
    });

    act(() => {
      vent.publish('scroll', { value: 'second' });
    });

    expect(eventSpy).toHaveBeenCalledTimes(1);
  });

  it('should use the latest callback without resubscribing', () => {
    const baseVent = createEventHandling<TestTopic, TestPayload>();
    const subscribe = jest.fn(baseVent.subscribe);
    const unsubscribe = jest.fn(baseVent.unsubscribe);
    const vent = {
      ...baseVent,
      subscribe,
      unsubscribe,
    };
    const firstSpy = jest.fn<void, [TestPayload]>();
    const secondSpy = jest.fn<void, [TestPayload]>();

    act(() => {
      root.render(
        <VentProvider instance={vent}>
          <Subscriber onEvent={firstSpy} topic="scroll" />
        </VentProvider>
      );
    });

    act(() => {
      root.render(
        <VentProvider instance={vent}>
          <Subscriber onEvent={secondSpy} topic="scroll" />
        </VentProvider>
      );
    });

    act(() => {
      vent.publish('scroll', { value: 'latest' });
    });

    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(unsubscribe).toHaveBeenCalledTimes(0);
    expect(firstSpy).not.toHaveBeenCalled();
    expect(secondSpy).toHaveBeenCalledTimes(1);
    expect(secondSpy).toHaveBeenLastCalledWith({ value: 'latest' });
  });

  it('should throw when the hooks are used outside the provider', () => {
    function BrokenConsumer() {
      useVent<TestTopic, TestPayload>();
      return null;
    }

    expect(() => {
      act(() => {
        root.render(<BrokenConsumer />);
      });
    }).toThrow('useVent must be used within a VentProvider');
  });
});
