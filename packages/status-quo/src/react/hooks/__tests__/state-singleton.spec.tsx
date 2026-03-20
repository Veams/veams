import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import { makeStateSingleton } from '../../../store';
import { useStateSingleton } from '../state-singleton.js';

import type { StateSubscriptionHandler } from '../../../types/types.js';

declare global {
  // React 19 requires this flag in test environments that use manual act() calls.
   
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

type TestState = {
  value: number;
};

type TestActions = {
  noop: () => void;
};

type TestHandler = StateSubscriptionHandler<TestState, TestActions> & {
  destroy: jest.Mock;
};

const createStateHandler = (value: number): TestHandler => {
  const snapshot = { value };
  const actions = { noop: jest.fn() };

  return {
    subscribe: (_listener: (() => void) | ((value: TestState) => void)) => () => undefined,
    getSnapshot: () => snapshot,
    getInitialState: () => snapshot,
    getActions: () => actions,
    destroy: jest.fn(),
  };
};

const SingletonConsumer = ({
  singleton,
}: {
  singleton: ReturnType<typeof makeStateSingleton<TestState, TestActions>>;
}) => {
  useStateSingleton(singleton);

  return null;
};

describe('useStateSingleton', () => {
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

  it('should keep singleton alive while at least one consumer is mounted', () => {
    const firstHandler = createStateHandler(1);
    const singleton = makeStateSingleton(() => firstHandler);

    act(() => {
      root.render(
        <React.Fragment>
          <SingletonConsumer singleton={singleton} />
          <SingletonConsumer singleton={singleton} />
        </React.Fragment>
      );
    });

    act(() => {
      root.render(<SingletonConsumer singleton={singleton} />);
    });

    expect(firstHandler.destroy).not.toHaveBeenCalled();

    act(() => {
      root.render(<React.Fragment />);
    });

    expect(firstHandler.destroy).not.toHaveBeenCalled();
  });

  it('should create a new singleton instance after all consumers unmount when destroyOnNoConsumers is true', () => {
    const firstHandler = createStateHandler(1);
    const secondHandler = createStateHandler(2);
    const factory = jest.fn(() => firstHandler as StateSubscriptionHandler<TestState, TestActions>);

    factory.mockReturnValueOnce(firstHandler).mockReturnValueOnce(secondHandler);
    const singleton = makeStateSingleton<TestState, TestActions>(factory, {
      destroyOnNoConsumers: true,
    });

    act(() => {
      root.render(<SingletonConsumer singleton={singleton} />);
    });

    act(() => {
      root.render(<React.Fragment />);
    });

    expect(firstHandler.destroy).toHaveBeenCalledTimes(1);

    act(() => {
      root.render(<SingletonConsumer singleton={singleton} />);
    });

    expect(factory).toHaveBeenCalledTimes(2);
    expect(singleton.getInstance().getSnapshot()).toStrictEqual({ value: 2 });
  });

  it('should keep singleton instance alive by default', () => {
    const firstHandler = createStateHandler(1);
    const factory = jest.fn(() => firstHandler as StateSubscriptionHandler<TestState, TestActions>);
    const singleton = makeStateSingleton<TestState, TestActions>(factory);

    act(() => {
      root.render(<SingletonConsumer singleton={singleton} />);
    });

    act(() => {
      root.render(<React.Fragment />);
    });

    expect(firstHandler.destroy).not.toHaveBeenCalled();

    act(() => {
      root.render(<SingletonConsumer singleton={singleton} />);
    });

    expect(factory).toHaveBeenCalledTimes(1);
    expect(singleton.getInstance().getSnapshot()).toStrictEqual({ value: 1 });
  });
});
