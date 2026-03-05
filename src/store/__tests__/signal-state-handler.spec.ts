import { resetStatusQuoForTests, setupStatusQuo } from '../../config/status-quo-config.js';
import { SignalStateHandler } from '../signal-state-handler.js';
import { makeStateSingleton } from '../state-singleton.js';
import type { DistinctOptions } from '../../config/status-quo-config.js';

type TestState = { test: string; test2: string };
type TestActions = { testAction: () => void };
type TestSignalHandlerOptions = {
  withDevTools?: boolean;
  distinct?: DistinctOptions<TestState>;
  useDistinctUntilChanged?: boolean;
};

class TestSignalStateHandler extends SignalStateHandler<TestState, TestActions> {
  constructor({ withDevTools, distinct, useDistinctUntilChanged }: TestSignalHandlerOptions = {}) {
    super({
      initialState: {
        test: 'testValue',
        test2: 'testValue2',
      },
      options: {
        ...(withDevTools && {
          devTools: {
            enabled: true,
            namespace: 'TestSignalStateHandler',
          },
        }),
        ...(distinct && {
          distinct,
        }),
        ...(typeof useDistinctUntilChanged === 'boolean' && {
          useDistinctUntilChanged,
        }),
      },
    });
  }

  getActions(): TestActions {
    return {
      testAction: () => {
        this.setState({ test: 'newValue' });
      },
    };
  }
}

type CounterState = { count: number };
type CounterActions = { increase: () => void };
type CounterBucketSelection = { bucket: number };
type CounterBucketState = { bucket: number };

class CounterSignalStateHandler extends SignalStateHandler<CounterState, CounterActions> {
  constructor(initialCount = 0) {
    super({
      initialState: {
        count: initialCount,
      },
    });
  }

  getActions(): CounterActions {
    return {
      increase: () => {
        this.setState({ count: this.getState().count + 1 }, 'increase');
      },
    };
  }
}

class CounterSignalBridgeStateHandler extends SignalStateHandler<CounterState, { noop: () => void }> {
  constructor(
    counterSingleton: ReturnType<typeof makeStateSingleton<CounterState, CounterActions>>,
    onCounterSync: (counterState: CounterState) => void
  ) {
    super({
      initialState: {
        count: 0,
      },
    });

    const counterStateHandler = counterSingleton.getInstance();

    this.bindSubscribable<CounterState, CounterState>(
      counterStateHandler,
      (nextCounterState) => {
        onCounterSync(nextCounterState);
        this.setState({ count: nextCounterState.count }, 'sync-counter');
      },
      (counterState) => counterState
    );
  }

  getActions(): { noop: () => void } {
    return {
      noop: () => undefined,
    };
  }
}

class CounterSignalBucketBridgeStateHandler extends SignalStateHandler<
  CounterBucketState,
  { noop: () => void }
> {
  constructor(
    counterSingleton: ReturnType<typeof makeStateSingleton<CounterState, CounterActions>>,
    onCounterSync: (selection: CounterBucketSelection) => void
  ) {
    super({
      initialState: {
        bucket: -1,
      },
    });

    const counterStateHandler = counterSingleton.getInstance();

    this.bindSubscribable<CounterState, CounterBucketSelection>(
      counterStateHandler,
      (nextSelection) => {
        onCounterSync(nextSelection);
        this.setState({ bucket: nextSelection.bucket }, 'sync-counter-bucket');
      },
      (counterState) => ({
        bucket: Math.floor(counterState.count / 2),
      }),
      (current, next) => current.bucket === next.bucket
    );
  }

  getActions(): { noop: () => void } {
    return {
      noop: () => undefined,
    };
  }
}

describe('Signal State Handler', () => {
  let stateHandler: TestSignalStateHandler;

  beforeEach(() => {
    resetStatusQuoForTests();
    stateHandler = new TestSignalStateHandler();
  });

  afterEach(() => {
    resetStatusQuoForTests();
  });

  it('should provide initial state', () => {
    expect(stateHandler.getInitialState()).toStrictEqual({
      test: 'testValue',
      test2: 'testValue2',
    });
  });

  it('should provide current state', () => {
    expect(stateHandler.getState()).toStrictEqual({
      test: 'testValue',
      test2: 'testValue2',
    });
  });

  it('should support state changing via setter and merge state object on first level', () => {
    const expected = {
      test: 'change',
      test2: 'testValue2',
    };

    stateHandler.setState(expected);

    expect(stateHandler.getState()).toStrictEqual(expected);
  });

  it('should support additional subscriptions handling', () => {
    const spy = jest.fn();
    const subscription = { unsubscribe: spy };

    stateHandler.subscriptions = [subscription];

    stateHandler.destroy();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should only call subscriber when object state has changed', () => {
    const spy = jest.fn();
    const unsubscribe = stateHandler.subscribe(spy);

    stateHandler.setState({
      test: 'test',
    });
    stateHandler.setState({
      test: 'test2',
    });
    stateHandler.setState({
      test: 'test2',
    });
    stateHandler.setState({
      test: 'test2',
    });

    unsubscribe();

    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should respect global distinct setup when disabled', () => {
    setupStatusQuo({
      distinct: {
        enabled: false,
      },
    });

    const handler = new TestSignalStateHandler();
    const spy = jest.fn();
    const unsubscribe = handler.subscribe(spy);

    handler.setState({ test: 'same' });
    handler.setState({ test: 'same' });

    unsubscribe();

    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should respect global custom distinct comparator from setupStatusQuo', () => {
    setupStatusQuo({
      distinct: {
        comparator: (previous: TestState, next: TestState) => {
          return previous.test === next.test;
        },
      },
    });

    const handler = new TestSignalStateHandler();
    const spy = jest.fn();
    const unsubscribe = handler.subscribe(spy);

    handler.setState({ test2: 'newValue2' });
    handler.setState({ test: 'newValue' });

    unsubscribe();

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should prefer per-handler distinct options over global setup', () => {
    setupStatusQuo({
      distinct: {
        enabled: false,
      },
    });

    const handler = new TestSignalStateHandler({
      distinct: {
        enabled: true,
      },
    });
    const spy = jest.fn();
    const unsubscribe = handler.subscribe(spy);

    handler.setState({ test: 'same' });
    handler.setState({ test: 'same' });

    unsubscribe();

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should notify another signal state handler for each singleton counter update', () => {
    const counterSingleton = makeStateSingleton(() => new CounterSignalStateHandler(0), {
      destroyOnNoConsumers: false,
    });
    const syncSpy = jest.fn();
    const bridgeStateHandler = new CounterSignalBridgeStateHandler(counterSingleton, syncSpy);
    const counterStateHandler = counterSingleton.getInstance();

    counterStateHandler.getActions().increase();
    counterStateHandler.getActions().increase();

    expect(syncSpy).toHaveBeenCalledTimes(3);
    expect(syncSpy).toHaveBeenNthCalledWith(1, { count: 0 });
    expect(syncSpy).toHaveBeenNthCalledWith(2, { count: 1 });
    expect(syncSpy).toHaveBeenNthCalledWith(3, { count: 2 });
    expect(bridgeStateHandler.getState()).toStrictEqual({ count: 2 });

    bridgeStateHandler.destroy();
  });

  it('should support selector + equality filtering for bindSubscribable', () => {
    const counterSingleton = makeStateSingleton(() => new CounterSignalStateHandler(0), {
      destroyOnNoConsumers: false,
    });
    const syncSpy = jest.fn();
    const bridgeStateHandler = new CounterSignalBucketBridgeStateHandler(counterSingleton, syncSpy);
    const counterStateHandler = counterSingleton.getInstance();

    counterStateHandler.getActions().increase(); // count 1 -> bucket 0 (no change)
    counterStateHandler.getActions().increase(); // count 2 -> bucket 1
    counterStateHandler.getActions().increase(); // count 3 -> bucket 1 (no change)
    counterStateHandler.getActions().increase(); // count 4 -> bucket 2

    expect(syncSpy).toHaveBeenCalledTimes(3);
    expect(syncSpy).toHaveBeenNthCalledWith(1, { bucket: 0 });
    expect(syncSpy).toHaveBeenNthCalledWith(2, { bucket: 1 });
    expect(syncSpy).toHaveBeenNthCalledWith(3, { bucket: 2 });
    expect(bridgeStateHandler.getState()).toStrictEqual({ bucket: 2 });

    bridgeStateHandler.destroy();
  });
});
