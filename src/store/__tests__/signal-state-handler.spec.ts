import { SignalStateHandler } from '../signal-state-handler.js';

class TestSignalStateHandler extends SignalStateHandler<
  { test: string; test2: string },
  { testAction: () => void }
> {
  constructor(withDevTools?: boolean) {
    super({
      initialState: {
        test: 'testValue',
        test2: 'testValue2',
      },
      ...(withDevTools && {
        options: {
          devTools: {
            enabled: true,
            namespace: 'TestSignalStateHandler',
          },
        },
      }),
    });
  }

  getActions(): { testAction: () => void } {
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
    stateHandler = new TestSignalStateHandler();
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
});
