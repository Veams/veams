import { resetStatusQuoForTests, setupStatusQuo } from '../../config/status-quo-config.js';
import { SignalStateHandler } from '../signal-state-handler.js';
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

    expect(spy).toHaveBeenCalledTimes(2);
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

    expect(spy).toHaveBeenCalledTimes(2);
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

    expect(spy).toHaveBeenCalledTimes(1);
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

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
