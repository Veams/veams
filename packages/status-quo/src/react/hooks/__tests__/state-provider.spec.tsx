import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import {
  StateProvider,
  useProvidedStateActions,
  useProvidedStateHandler,
  useProvidedStateSubscription,
} from '../state-provider.js';

import type { StateSubscriptionHandler } from '../../../types/types.js';

declare global {
  // React 19 requires this flag in test environments that use manual act() calls.

  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

type TestState = {
  count: number;
  label: string;
};

type TestActions = {
  increment: () => void;
  rename: (label: string) => void;
};

class TestStateHandler implements StateSubscriptionHandler<TestState, TestActions> {
  private readonly initialState: TestState;
  private state: TestState;
  private readonly listeners = new Set<(value: TestState) => void>();

  destroy = jest.fn();

  constructor(initialState: TestState) {
    this.initialState = initialState;
    this.state = initialState;
  }

  subscribe(listener: () => void): () => void;
  subscribe(listener: (value: TestState) => void): () => void;
  subscribe(listener: ((value: TestState) => void) | (() => void)) {
    const typedListener = listener as (value: TestState) => void;
    this.listeners.add(typedListener);

    return () => {
      this.listeners.delete(typedListener);
    };
  }

  getSnapshot = () => {
    return this.state;
  };

  getInitialState = () => {
    return this.initialState;
  };

  getActions = () => {
    return {
      increment: () => {
        this.state = {
          ...this.state,
          count: this.state.count + 1,
        };

        this.emitStateChange();
      },
      rename: (label: string) => {
        this.state = {
          ...this.state,
          label,
        };

        this.emitStateChange();
      },
    };
  };

  private emitStateChange() {
    const nextState = this.state;
    this.listeners.forEach((listener) => listener(nextState));
  }
}

function CountConsumer({ onRender }: { onRender: (count: number) => void }) {
  const [count] = useProvidedStateSubscription<TestState, TestActions, number>(
    (state) => state.count
  );

  onRender(count);

  return <span>{count}</span>;
}

function FullStateConsumer({
  onActionsReady,
  onRender,
}: {
  onActionsReady: (actions: TestActions) => void;
  onRender: (state: TestState) => void;
}) {
  const [state, actions] = useProvidedStateSubscription<TestState, TestActions>();

  onRender(state);
  onActionsReady(actions);

  return <span>{state.label}</span>;
}

function ActionsOnlyConsumer({
  onActionsReady,
  onRender,
}: {
  onActionsReady: (actions: TestActions) => void;
  onRender: () => void;
}) {
  const actions = useProvidedStateActions<TestState, TestActions>();

  onRender();
  onActionsReady(actions);

  return <span>actions-only</span>;
}

function HandlerConsumer({
  onHandlerReady,
}: {
  onHandlerReady: (handler: StateSubscriptionHandler<TestState, TestActions>) => void;
}) {
  const handler = useProvidedStateHandler<TestState, TestActions>();

  onHandlerReady(handler);

  return <span>handler</span>;
}

function MissingProviderConsumer() {
  useProvidedStateActions<TestState, TestActions>();

  return null;
}

describe('StateProvider', () => {
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

  it('should share one handler instance across the provider subtree', () => {
    const stateHandler = new TestStateHandler({
      count: 0,
      label: 'Counter',
    });
    const countRenderSpy = jest.fn<void, [number]>();
    const actionsRenderSpy = jest.fn();
    const actionsReadySpy = jest.fn<void, [TestActions]>();
    const handlerReadySpy = jest.fn<void, [StateSubscriptionHandler<TestState, TestActions>]>();

    act(() => {
      root.render(
        <StateProvider instance={stateHandler}>
          <CountConsumer onRender={countRenderSpy} />
          <ActionsOnlyConsumer onActionsReady={actionsReadySpy} onRender={actionsRenderSpy} />
          <HandlerConsumer onHandlerReady={handlerReadySpy} />
        </StateProvider>
      );
    });

    expect(countRenderSpy).toHaveBeenCalledTimes(1);
    expect(countRenderSpy).toHaveBeenLastCalledWith(0);
    expect(actionsRenderSpy).toHaveBeenCalledTimes(1);
    expect(handlerReadySpy).toHaveBeenCalledWith(stateHandler);

    const [[actions]] = actionsReadySpy.mock.calls as [[TestActions]];

    act(() => {
      actions.rename('Renamed');
    });

    expect(countRenderSpy).toHaveBeenCalledTimes(1);
    expect(actionsRenderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      actions.increment();
    });

    expect(countRenderSpy).toHaveBeenCalledTimes(2);
    expect(countRenderSpy).toHaveBeenLastCalledWith(1);
    expect(actionsRenderSpy).toHaveBeenCalledTimes(1);
  });

  it('should return the full snapshot when no selector is provided', () => {
    const stateHandler = new TestStateHandler({
      count: 2,
      label: 'Counter',
    });
    const renderSpy = jest.fn<void, [TestState]>();
    const actionsReadySpy = jest.fn<void, [TestActions]>();

    act(() => {
      root.render(
        <StateProvider instance={stateHandler}>
          <FullStateConsumer onActionsReady={actionsReadySpy} onRender={renderSpy} />
        </StateProvider>
      );
    });

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(renderSpy).toHaveBeenLastCalledWith({ count: 2, label: 'Counter' });

    const [[actions]] = actionsReadySpy.mock.calls as [[TestActions]];

    act(() => {
      actions.increment();
    });

    expect(renderSpy).toHaveBeenCalledTimes(2);
    expect(renderSpy).toHaveBeenLastCalledWith({ count: 3, label: 'Counter' });
  });

  it('should follow a new instance when the provider instance changes', () => {
    const firstHandler = new TestStateHandler({
      count: 1,
      label: 'First',
    });
    const secondHandler = new TestStateHandler({
      count: 8,
      label: 'Second',
    });
    const renderSpy = jest.fn<void, [number]>();

    act(() => {
      root.render(
        <StateProvider instance={firstHandler}>
          <CountConsumer onRender={renderSpy} />
        </StateProvider>
      );
    });

    act(() => {
      root.render(
        <StateProvider instance={secondHandler}>
          <CountConsumer onRender={renderSpy} />
        </StateProvider>
      );
    });

    expect(renderSpy).toHaveBeenCalledTimes(2);
    expect(renderSpy).toHaveBeenNthCalledWith(1, 1);
    expect(renderSpy).toHaveBeenNthCalledWith(2, 8);
  });

  it('should throw when provider hooks are used outside StateProvider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => {
      act(() => {
        root.render(<MissingProviderConsumer />);
      });
    }).toThrow('No StateProvider instance found in the current React tree.');

    consoleErrorSpy.mockRestore();
  });
});
