import { lastValueFrom, Subject, take } from 'rxjs';

import { resetStatusQuoForTests, setupStatusQuo } from '../../config/status-quo-config.js';
import { ObservableStateHandler } from '../observable-state-handler.js';

import type { DevToolsOptions, DistinctOptions } from '../../config/status-quo-config.js';

type TestState = { test: string; test2: string };
type TestActions = { testAction: () => void };
type TestObservableHandlerOptions = {
  devTools?: DevToolsOptions;
  distinct?: DistinctOptions<TestState>;
  useDistinctUntilChanged?: boolean;
};

class TestObservableStateHandler extends ObservableStateHandler<TestState, TestActions> {
  constructor({
    devTools,
    distinct,
    useDistinctUntilChanged,
  }: TestObservableHandlerOptions = {}) {
    super({
      initialState: {
        test: 'testValue',
        test2: 'testValue2',
      },
      options: {
        ...(devTools && { devTools }),
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

describe('Observable State Handler', () => {
  let stateHandler: TestObservableStateHandler;

  function mockDevToolsExtension() {
    const devTools = {
      init: jest.fn(),
      send: jest.fn(),
      subscribe: jest.fn(),
    };
    const connect = jest.fn(() => devTools);

    window.__REDUX_DEVTOOLS_EXTENSION__ = { connect };

    return { connect, devTools };
  }

  beforeEach(() => {
    resetStatusQuoForTests();
    stateHandler = new TestObservableStateHandler();
  });

  afterEach(() => {
    delete window.__REDUX_DEVTOOLS_EXTENSION__;
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

  it('should support state changing via setter and merge state object on first level', async () => {
    const expected = {
      test: 'change',
      test2: 'testValue2',
    };

    stateHandler.setState(expected);

    const state = await lastValueFrom(stateHandler.getObservable().pipe(take(1)));

    expect(state).toStrictEqual(expected);
    expect(stateHandler.getState()).toStrictEqual(expected);
  });

  it('should support additional subscriptions handling', () => {
    const customSubject = new Subject();
    const spy = jest.fn();
    const subscription = customSubject.subscribe(spy);

    stateHandler.subscriptions = [subscription];

    customSubject.next(1);

    stateHandler.destroy();

    customSubject.next(2);
    customSubject.next(3);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should expose state item observable via getObservableItem', async () => {
    const observableValue = await lastValueFrom(stateHandler.getObservableItem('test').pipe(take(1)));

    expect(observableValue).toBe('testValue');
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

    expect(spy).toHaveBeenCalledTimes(3); // 1. initial, 2. test (first setter), 3. test2 (second setter)
  });

  it('should respect global distinct setup when disabled', () => {
    setupStatusQuo({
      distinct: {
        enabled: false,
      },
    });

    const handler = new TestObservableStateHandler();
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

    const handler = new TestObservableStateHandler();
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

    const handler = new TestObservableStateHandler({
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

  it('should enable devtools from global setup and fall back to the class name as namespace', () => {
    const { connect, devTools } = mockDevToolsExtension();

    setupStatusQuo({
      devTools: {
        enabled: true,
      },
    });

    new TestObservableStateHandler();

    expect(connect).toHaveBeenCalledWith(
      expect.objectContaining({
        instanceId: 'testobservablestatehandler',
        name: 'TestObservableStateHandler',
      })
    );
    expect(devTools.init).toHaveBeenCalledWith({
      test: 'testValue',
      test2: 'testValue2',
    });
    expect(devTools.subscribe).toHaveBeenCalledTimes(1);
  });

  it('should prefer per-handler devtools options over global setup', () => {
    const { connect } = mockDevToolsExtension();

    setupStatusQuo({
      devTools: {
        enabled: true,
      },
    });

    new TestObservableStateHandler({
      devTools: {
        namespace: 'LocalHandler',
      },
    });

    expect(connect).toHaveBeenCalledWith(
      expect.objectContaining({
        instanceId: 'localhandler',
        name: 'LocalHandler',
      })
    );
  });

  it('should allow per-handler devtools settings to disable a global devtools setup', () => {
    const { connect } = mockDevToolsExtension();

    setupStatusQuo({
      devTools: {
        enabled: true,
      },
    });

    new TestObservableStateHandler({
      devTools: {
        enabled: false,
      },
    });

    expect(connect).not.toHaveBeenCalled();
  });
});
