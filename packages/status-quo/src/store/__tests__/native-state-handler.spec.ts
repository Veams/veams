import { resetStatusQuoForTests, setupStatusQuo } from '../../config/status-quo-config.js';
import { NativeStateHandler } from '../native-state-handler.js';
import { makeStateSingleton } from '../state-singleton.js';

import type { DistinctOptions } from '../../config/status-quo-config.js';

type TestState = { test: string; test2: string };
type TestActions = { testAction: () => void };
type TestNativeHandlerOptions = {
  withDevTools?: boolean;
  distinct?: DistinctOptions<TestState>;
  useDistinctUntilChanged?: boolean;
};

class TestNativeStateHandler extends NativeStateHandler<TestState, TestActions> {
  constructor({ withDevTools, distinct, useDistinctUntilChanged }: TestNativeHandlerOptions = {}) {
    super({
      initialState: {
        test: 'testValue',
        test2: 'testValue2',
      },
      options: {
        ...(withDevTools && {
          devTools: {
            enabled: true,
            namespace: 'TestNativeStateHandler',
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
type SetState = { openItems: Set<string> };
type SetActions = { toggle: (id: string) => void };
type CounterSubscribable = {
  subscribe: (listener: (value: CounterState) => void) => () => void;
  getSnapshot: () => CounterState;
};

class CounterNativeStateHandler extends NativeStateHandler<CounterState, CounterActions> {
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

class CounterNativeBridgeStateHandler extends NativeStateHandler<
  CounterState,
  { noop: () => void }
> {
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

class CounterNativeBucketBridgeStateHandler extends NativeStateHandler<
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

class CounterNamedNativeBridgeStateHandler extends NativeStateHandler<
  CounterState,
  { noop: () => void }
> {
  constructor(private readonly onCounterSync: (counterState: CounterState) => void) {
    super({
      initialState: {
        count: -1,
      },
    });
  }

  bindNamedCounter(service: CounterSubscribable, subscriptionName = 'namedSubscription') {
    this.bindSubscribable<CounterState, CounterState>(
      subscriptionName,
      service,
      (nextCounterState) => {
        this.onCounterSync(nextCounterState);
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

class SetNativeStateHandler extends NativeStateHandler<SetState, SetActions> {
  constructor() {
    super({
      initialState: {
        openItems: new Set(),
      },
    });
  }

  getActions(): SetActions {
    return {
      toggle: (id: string) => {
        const openItems = new Set(this.getState().openItems);

        if (openItems.has(id)) {
          openItems.delete(id);
        } else {
          openItems.add(id);
        }

        this.setState({ openItems }, 'toggle');
      },
    };
  }
}

function createCounterSubscribable(initialCount: number) {
  let listener: ((value: CounterState) => void) | null = null;
  const unsubscribe = jest.fn(() => {
    listener = null;
  });

  return {
    emit(value: CounterState) {
      listener?.(value);
    },
    service: {
      getSnapshot: () => ({ count: initialCount }),
      subscribe: (nextListener: (value: CounterState) => void) => {
        listener = nextListener;
        return unsubscribe;
      },
    } satisfies CounterSubscribable,
    unsubscribe,
  };
}

describe('Native State Handler', () => {
  let stateHandler: TestNativeStateHandler;

  beforeEach(() => {
    resetStatusQuoForTests();
    stateHandler = new TestNativeStateHandler();
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

  it('should call subscriber when state has changed and also on initial subscribe', () => {
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

    expect(spy).toHaveBeenCalledTimes(3); // initial + change + change
  });

  it('should respect global distinct setup when disabled', () => {
    setupStatusQuo({
      distinct: {
        enabled: false,
      },
    });

    const handler = new TestNativeStateHandler();
    const spy = jest.fn();
    const unsubscribe = handler.subscribe(spy);

    handler.setState({ test: 'same' });
    handler.setState({ test: 'same' });

    unsubscribe();

    expect(spy).toHaveBeenCalledTimes(3); // initial + change + change
  });

  it('should respect global custom distinct comparator from setupStatusQuo', () => {
    setupStatusQuo({
      distinct: {
        comparator: (previous: TestState, next: TestState) => {
          return previous.test === next.test;
        },
      },
    });

    const handler = new TestNativeStateHandler();
    const spy = jest.fn();
    const unsubscribe = handler.subscribe(spy);

    handler.setState({ test2: 'newValue2' }); // test remains same -> skipped
    handler.setState({ test: 'newValue' }); // test changed -> notified

    unsubscribe();

    expect(spy).toHaveBeenCalledTimes(2); // initial + one change
  });

  it('should notify subscribers when Set state changes', () => {
    const handler = new SetNativeStateHandler();
    const spy = jest.fn();
    const unsubscribe = handler.subscribe(spy);

    handler.getActions().toggle('item-1');
    handler.getActions().toggle('item-1');

    unsubscribe();

    expect(spy).toHaveBeenCalledTimes(3); // initial + open + close
  });

  it('should notify another state handler for each singleton counter update', () => {
    const counterSingleton = makeStateSingleton(() => new CounterNativeStateHandler(0), {
      destroyOnNoConsumers: false,
    });
    const syncSpy = jest.fn();
    const bridgeStateHandler = new CounterNativeBridgeStateHandler(counterSingleton, syncSpy);
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
    const counterSingleton = makeStateSingleton(() => new CounterNativeStateHandler(0), {
      destroyOnNoConsumers: false,
    });
    const syncSpy = jest.fn();
    const bridgeStateHandler = new CounterNativeBucketBridgeStateHandler(counterSingleton, syncSpy);
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

  it('should replace named bindSubscribable subscriptions when bound again with the same key', () => {
    const syncSpy = jest.fn();
    const bridgeStateHandler = new CounterNamedNativeBridgeStateHandler(syncSpy);
    const firstCounter = createCounterSubscribable(1);
    const secondCounter = createCounterSubscribable(5);

    bridgeStateHandler.bindNamedCounter(firstCounter.service);
    bridgeStateHandler.bindNamedCounter(secondCounter.service);

    firstCounter.emit({ count: 2 });
    secondCounter.emit({ count: 6 });

    expect(firstCounter.unsubscribe).toHaveBeenCalledTimes(1);
    expect(secondCounter.unsubscribe).toHaveBeenCalledTimes(0);
    expect(syncSpy).toHaveBeenCalledTimes(3);
    expect(syncSpy).toHaveBeenNthCalledWith(1, { count: 1 });
    expect(syncSpy).toHaveBeenNthCalledWith(2, { count: 5 });
    expect(syncSpy).toHaveBeenNthCalledWith(3, { count: 6 });
    expect(bridgeStateHandler.getState()).toStrictEqual({ count: 6 });

    bridgeStateHandler.destroy();
  });

  it('should unsubscribe named bindSubscribable subscriptions on destroy', () => {
    const syncSpy = jest.fn();
    const bridgeStateHandler = new CounterNamedNativeBridgeStateHandler(syncSpy);
    const counter = createCounterSubscribable(3);

    bridgeStateHandler.bindNamedCounter(counter.service);
    bridgeStateHandler.destroy();
    counter.emit({ count: 4 });

    expect(counter.unsubscribe).toHaveBeenCalledTimes(1);
    expect(syncSpy).toHaveBeenCalledTimes(1);
  });
});
