import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { makeStateSingleton } from '../../store/state-singleton.js';

import { useStateActions } from '../state-actions.js';
import { useStateFactory } from '../state-factory.js';
import { useStateHandler } from '../state-handler.js';
import { useStateSingleton } from '../state-singleton.js';
import { useStateSubscription } from '../state-subscription.js';

import type { StateSingleton } from '../../store/state-singleton.js';
import type { StateSubscriptionHandler } from '../../types/types.js';

declare global {
  // React 19 requires this flag in test environments that use manual act() calls.
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

type TestState = {
  user: {
    name: string;
  };
  counter: number;
};

type TestActions = {
  setName: (name: string) => void;
  increment: () => void;
};

type CounterState = {
  count: number;
};

type CounterActions = {
  increment: () => void;
};

type CounterMirrorState = {
  mirroredCount: number;
};

type CounterMirrorActions = {
  noop: () => void;
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
      setName: (name: string) => {
        this.state = {
          ...this.state,
          user: {
            ...this.state.user,
            name,
          },
        };

        this.emitStateChange();
      },
      increment: () => {
        this.state = {
          ...this.state,
          counter: this.state.counter + 1,
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

class CounterStateHandler implements StateSubscriptionHandler<CounterState, CounterActions> {
  private readonly initialState: CounterState;
  private state: CounterState;
  private readonly listeners = new Set<(value: CounterState) => void>();

  destroy = jest.fn();

  constructor(initialCount = 0) {
    this.initialState = { count: initialCount };
    this.state = this.initialState;
  }

  subscribe(listener: () => void): () => void;
  subscribe(listener: (value: CounterState) => void): () => void;
  subscribe(listener: ((value: CounterState) => void) | (() => void)) {
    const typedListener = listener as (value: CounterState) => void;
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
          count: this.state.count + 1,
        };

        const nextState = this.state;
        this.listeners.forEach((listener) => listener(nextState));
      },
    };
  };
}

class CounterMirrorStateHandler
  implements StateSubscriptionHandler<CounterMirrorState, CounterMirrorActions>
{
  private readonly initialState: CounterMirrorState;
  private state: CounterMirrorState;
  private readonly listeners = new Set<(value: CounterMirrorState) => void>();
  private readonly unsubscribeFromCounter: () => void;

  destroy = jest.fn(() => {
    this.unsubscribeFromCounter();
    this.listeners.clear();
  });

  constructor(counterSingleton: StateSingleton<CounterState, CounterActions>) {
    const counterStateHandler = counterSingleton.getInstance();
    const initialCounterState = counterStateHandler.getSnapshot();
    this.initialState = {
      mirroredCount: initialCounterState.count,
    };
    this.state = this.initialState;
    this.unsubscribeFromCounter = counterStateHandler.subscribe((nextCounterState: CounterState) => {
      this.state = {
        mirroredCount: nextCounterState.count,
      };
      const nextMirrorState = this.state;
      this.listeners.forEach((listener) => listener(nextMirrorState));
    });
  }

  subscribe(listener: () => void): () => void;
  subscribe(listener: (value: CounterMirrorState) => void): () => void;
  subscribe(listener: ((value: CounterMirrorState) => void) | (() => void)) {
    const typedListener = listener as (value: CounterMirrorState) => void;
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
      noop: () => undefined,
    };
  };
}

type ComposedHooksConsumerProps = {
  createStateHandler: () => StateSubscriptionHandler<TestState, TestActions>;
  onStateRender: (value: string) => void;
  onActionsReady: (actions: TestActions) => void;
};

const ComposedHooksConsumer = ({
  createStateHandler,
  onStateRender,
  onActionsReady,
}: ComposedHooksConsumerProps) => {
  const stateHandler = useStateHandler(createStateHandler, []);
  const actions = useStateActions(stateHandler);
  const [userName] = useStateSubscription(stateHandler, (state) => state.user.name);

  onActionsReady(actions);
  onStateRender(userName);

  return <span>{userName}</span>;
};

type ActionsOnlyConsumerProps = {
  createStateHandler: () => StateSubscriptionHandler<TestState, TestActions>;
  onRender: () => void;
  onActionsReady: (actions: TestActions) => void;
};

const ActionsOnlyConsumer = ({ createStateHandler, onRender, onActionsReady }: ActionsOnlyConsumerProps) => {
  const stateHandler = useStateHandler(createStateHandler, []);
  const actions = useStateActions(stateHandler);

  onRender();
  onActionsReady(actions);

  return <span>actions-only</span>;
};

type FactoryShortcutConsumerProps = {
  createStateHandler: () => StateSubscriptionHandler<TestState, TestActions>;
  onRender: (value: string) => void;
};

const FactoryShortcutConsumer = ({ createStateHandler, onRender }: FactoryShortcutConsumerProps) => {
  const [userName] = useStateFactory(
    createStateHandler,
    (state) => state.user.name,
    Object.is,
    []
  );
  onRender(userName);

  return <span>{userName}</span>;
};

type FactoryShortcutWithoutEqualityConsumerProps = {
  createStateHandler: () => StateSubscriptionHandler<TestState, TestActions>;
  onRender: (value: string) => void;
};

const FactoryShortcutWithoutEqualityConsumer = ({
  createStateHandler,
  onRender,
}: FactoryShortcutWithoutEqualityConsumerProps) => {
  const [userName] = useStateFactory(createStateHandler, (state) => state.user.name, []);
  onRender(userName);

  return <span>{userName}</span>;
};

type SingletonShortcutConsumerProps = {
  singleton: StateSingleton<TestState, TestActions>;
  onRender: (value: string) => void;
};

const SingletonShortcutConsumer = ({ singleton, onRender }: SingletonShortcutConsumerProps) => {
  const [userName] = useStateSingleton(singleton, (state) => state.user.name);
  onRender(userName);

  return <span>{userName}</span>;
};

type SingletonSubscriptionConsumerProps = {
  singleton: StateSingleton<TestState, TestActions>;
  onRender: (value: string) => void;
  onActionsReady: (actions: TestActions) => void;
};

const SingletonSubscriptionConsumer = ({
  singleton,
  onRender,
  onActionsReady,
}: SingletonSubscriptionConsumerProps) => {
  const [name, actions] = useStateSubscription(singleton, (state) => state.user.name);

  onRender(name);
  onActionsReady(actions);

  return <span>{name}</span>;
};

type FullSubscriptionConsumerProps = {
  createStateHandler: () => StateSubscriptionHandler<TestState, TestActions>;
  onRender: (state: TestState) => void;
  onActionsReady: (actions: TestActions) => void;
};

const FullSubscriptionConsumer = ({
  createStateHandler,
  onRender,
  onActionsReady,
}: FullSubscriptionConsumerProps) => {
  const stateHandler = useStateHandler(createStateHandler, []);
  const [state, actions] = useStateSubscription(stateHandler);

  onRender(state);
  onActionsReady(actions);

  return <span>{state.user.name}</span>;
};

type StrictModeMirrorFactoryConsumerProps = {
  createStateHandler: () => StateSubscriptionHandler<CounterMirrorState, CounterMirrorActions>;
  onRender: (count: number) => void;
};

const StrictModeMirrorFactoryConsumer = ({
  createStateHandler,
  onRender,
}: StrictModeMirrorFactoryConsumerProps) => {
  const [count] = useStateFactory(createStateHandler, (state) => state.mirroredCount, []);
  onRender(count);

  return <span>{count}</span>;
};

describe('Selector hooks', () => {
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

  it('useStateFactory selector should only rerender when selected state changes', async () => {
    let stateHandler: TestStateHandler | null = null;
    const createStateHandler = jest.fn(() => {
      if (!stateHandler) {
        stateHandler = new TestStateHandler({
          user: { name: 'Ada' },
          counter: 0,
        });
      }

      return stateHandler;
    });
    const renderSpy = jest.fn();

    act(() => {
      root.render(
        <FactoryShortcutConsumer createStateHandler={createStateHandler} onRender={renderSpy} />
      );
    });

    expect(stateHandler).not.toBeNull();

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(renderSpy).toHaveBeenLastCalledWith('Ada');

    act(() => {
      stateHandler!.getActions().increment();
    });

    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      stateHandler!.getActions().setName('Grace');
    });

    expect(renderSpy).toHaveBeenCalledTimes(2);
    expect(renderSpy).toHaveBeenLastCalledWith('Grace');
    expect(createStateHandler).toHaveBeenCalledTimes(1);

    act(() => {
      root.render(<></>);
    });

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(stateHandler!.destroy).toHaveBeenCalledTimes(1);
  });

  it('composed hook interface should support selector subscription and actions', () => {
    let stateHandler: TestStateHandler | null = null;
    const createStateHandler = jest.fn(() => {
      if (!stateHandler) {
        stateHandler = new TestStateHandler({
          user: { name: 'Ada' },
          counter: 0,
        });
      }

      return stateHandler;
    });
    const stateRenderSpy = jest.fn();
    const actionsReadySpy = jest.fn();

    act(() => {
      root.render(
        <ComposedHooksConsumer
          createStateHandler={createStateHandler}
          onStateRender={stateRenderSpy}
          onActionsReady={actionsReadySpy}
        />
      );
    });

    expect(stateRenderSpy).toHaveBeenCalledTimes(1);
    expect(stateRenderSpy).toHaveBeenLastCalledWith('Ada');
    expect(actionsReadySpy).toHaveBeenCalledTimes(1);

    act(() => {
      stateHandler!.getActions().increment();
    });

    expect(stateRenderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      stateHandler!.getActions().setName('Grace');
    });

    expect(stateRenderSpy).toHaveBeenCalledTimes(2);
    expect(stateRenderSpy).toHaveBeenLastCalledWith('Grace');
    expect(actionsReadySpy).toHaveBeenCalledTimes(2);
    expect(createStateHandler).toHaveBeenCalledTimes(1);
  });

  it('useStateActions should not subscribe when used without useStateSubscription', () => {
    let stateHandler: TestStateHandler | null = null;
    const createStateHandler = jest.fn(() => {
      if (!stateHandler) {
        stateHandler = new TestStateHandler({
          user: { name: 'Ada' },
          counter: 0,
        });
      }

      return stateHandler;
    });
    const renderSpy = jest.fn();
    const actionsReadySpy = jest.fn();

    act(() => {
      root.render(
        <ActionsOnlyConsumer
          createStateHandler={createStateHandler}
          onRender={renderSpy}
          onActionsReady={actionsReadySpy}
        />
      );
    });

    const actions = actionsReadySpy.mock.calls[0][0] as TestActions;

    act(() => {
      actions.increment();
      actions.setName('Grace');
    });

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(createStateHandler).toHaveBeenCalledTimes(1);
  });

  it('useStateFactory shortcut should support selector, equality and params as last argument', () => {
    let stateHandler: TestStateHandler | null = null;
    const createStateHandler = jest.fn(() => {
      if (!stateHandler) {
        stateHandler = new TestStateHandler({
          user: { name: 'Ada' },
          counter: 0,
        });
      }

      return stateHandler;
    });
    const renderSpy = jest.fn();

    act(() => {
      root.render(<FactoryShortcutConsumer createStateHandler={createStateHandler} onRender={renderSpy} />);
    });

    act(() => {
      stateHandler!.getActions().increment();
    });

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(createStateHandler).toHaveBeenCalledTimes(1);
  });

  it('useStateFactory should support selector and params without custom equality', () => {
    let stateHandler: TestStateHandler | null = null;
    const createStateHandler = jest.fn(() => {
      if (!stateHandler) {
        stateHandler = new TestStateHandler({
          user: { name: 'Ada' },
          counter: 0,
        });
      }

      return stateHandler;
    });
    const renderSpy = jest.fn();

    act(() => {
      root.render(
        <FactoryShortcutWithoutEqualityConsumer
          createStateHandler={createStateHandler}
          onRender={renderSpy}
        />
      );
    });

    act(() => {
      stateHandler!.getActions().increment();
    });

    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      stateHandler!.getActions().setName('Grace');
    });

    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('useStateSubscription should return full snapshot when no selector is provided', () => {
    let stateHandler: TestStateHandler | null = null;
    const createStateHandler = jest.fn(() => {
      if (!stateHandler) {
        stateHandler = new TestStateHandler({
          user: { name: 'Ada' },
          counter: 0,
        });
      }

      return stateHandler;
    });
    const renderSpy = jest.fn();
    const actionsReadySpy = jest.fn();

    act(() => {
      root.render(
        <FullSubscriptionConsumer
          createStateHandler={createStateHandler}
          onRender={renderSpy}
          onActionsReady={actionsReadySpy}
        />
      );
    });

    expect(renderSpy).toHaveBeenLastCalledWith({
      user: { name: 'Ada' },
      counter: 0,
    });

    const actions = actionsReadySpy.mock.calls[0][0] as TestActions;

    act(() => {
      actions.increment();
    });

    expect(renderSpy).toHaveBeenLastCalledWith({
      user: { name: 'Ada' },
      counter: 1,
    });
  });

  it('useStateSingleton selector should keep singleton alive while consumers exist', () => {
    const stateHandler = new TestStateHandler({
      user: { name: 'Ada' },
      counter: 0,
    });
    const singleton = makeStateSingleton(() => stateHandler);
    const firstRenderSpy = jest.fn();
    const secondRenderSpy = jest.fn();

    act(() => {
      root.render(
        <>
          <SingletonShortcutConsumer singleton={singleton} onRender={firstRenderSpy} />
          <SingletonShortcutConsumer singleton={singleton} onRender={secondRenderSpy} />
        </>
      );
    });

    act(() => {
      stateHandler.getActions().increment();
    });

    expect(firstRenderSpy).toHaveBeenCalledTimes(1);
    expect(secondRenderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      stateHandler.getActions().setName('Linus');
    });

    expect(firstRenderSpy).toHaveBeenCalledTimes(2);
    expect(secondRenderSpy).toHaveBeenCalledTimes(2);

    act(() => {
      root.render(<SingletonShortcutConsumer singleton={singleton} onRender={firstRenderSpy} />);
    });

    expect(stateHandler.destroy).not.toHaveBeenCalled();

    act(() => {
      root.render(<></>);
    });

    expect(stateHandler.destroy).toHaveBeenCalledTimes(1);
  });

  it('useStateSingleton shortcut should support selector without rerender fanout', () => {
    const stateHandler = new TestStateHandler({
      user: { name: 'Ada' },
      counter: 0,
    });
    const singleton = makeStateSingleton(() => stateHandler);
    const renderSpy = jest.fn();

    act(() => {
      root.render(<SingletonShortcutConsumer singleton={singleton} onRender={renderSpy} />);
    });

    act(() => {
      stateHandler.getActions().increment();
    });

    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      stateHandler.getActions().setName('Grace');
    });

    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('useStateSubscription should accept singleton sources directly', () => {
    const stateHandler = new TestStateHandler({
      user: { name: 'Ada' },
      counter: 0,
    });
    const singleton = makeStateSingleton(() => stateHandler);
    const renderSpy = jest.fn();
    const actionsReadySpy = jest.fn();

    act(() => {
      root.render(
        <SingletonSubscriptionConsumer
          singleton={singleton}
          onRender={renderSpy}
          onActionsReady={actionsReadySpy}
        />
      );
    });

    const actions = actionsReadySpy.mock.calls[0][0] as TestActions;

    act(() => {
      actions.increment();
    });

    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      actions.setName('Grace');
    });

    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('useStateSingleton selector should respect destroyOnNoConsumers false', () => {
    const firstHandler = new TestStateHandler({
      user: { name: 'Ada' },
      counter: 0,
    });
    const secondHandler = new TestStateHandler({
      user: { name: 'Grace' },
      counter: 0,
    });
    const createStateHandler = jest
      .fn(() => firstHandler as StateSubscriptionHandler<TestState, TestActions>)
      .mockReturnValueOnce(firstHandler)
      .mockReturnValueOnce(secondHandler);
    const singleton = makeStateSingleton<TestState, TestActions>(createStateHandler, {
      destroyOnNoConsumers: false,
    });
    const renderSpy = jest.fn();

    act(() => {
      root.render(<SingletonShortcutConsumer singleton={singleton} onRender={renderSpy} />);
    });

    act(() => {
      root.render(<></>);
    });

    expect(firstHandler.destroy).not.toHaveBeenCalled();

    act(() => {
      root.render(<SingletonShortcutConsumer singleton={singleton} onRender={renderSpy} />);
    });

    expect(createStateHandler).toHaveBeenCalledTimes(1);
    expect(renderSpy).toHaveBeenLastCalledWith('Ada');
  });

  it('useStateFactory should keep bridge handler alive through StrictMode subscribe re-check', () => {
    const counterStateHandler = new CounterStateHandler(0);
    const counterSingleton = makeStateSingleton(() => counterStateHandler, {
      destroyOnNoConsumers: false,
    });
    let counterMirrorStateHandler: CounterMirrorStateHandler | null = null;
    const createStateHandler = jest.fn(() => {
      if (!counterMirrorStateHandler) {
        counterMirrorStateHandler = new CounterMirrorStateHandler(counterSingleton);
      }

      return counterMirrorStateHandler;
    });
    const renderSpy = jest.fn();

    act(() => {
      root.render(
        <React.StrictMode>
          <StrictModeMirrorFactoryConsumer createStateHandler={createStateHandler} onRender={renderSpy} />
        </React.StrictMode>
      );
    });

    act(() => {
      counterStateHandler.getActions().increment();
    });

    act(() => {
      counterStateHandler.getActions().increment();
    });

    expect(createStateHandler).toHaveBeenCalledTimes(1);
    expect(renderSpy).toHaveBeenLastCalledWith(2);
    expect(counterMirrorStateHandler!.destroy).not.toHaveBeenCalled();
  });
});
