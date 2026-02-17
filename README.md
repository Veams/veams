# Status Quo (`@veams/status-quo`)

The `Manager` to rule your state.

---

## Table of Content

1. [Getting Started](#getting-started)
2. [Example](#example)

---

## Getting Started

1. Create your own state handler which handles all the streams and a state you expose next to the actions
1. Use actions and state in your component
1. When using React, initialize the state handler with a custom hook called `useStateFactory()` (or `useStateSingleton()` for Singleton states)


These three steps are necessary to create a completely decoupled state management solution without the need of creating custom hooks with `useEffect()`.

__Note__: 
_Please keep in mind that dependencies for the hook needs to be flattened and cannot be used as an object due to how React works._

## Example

Let's start with a simple state example. 
You should start with the abstract class `ObservableStateHandler`:

```ts
import { useStateFactory, ObservableStateHandler } from '@veams/status-quo';

type CounterState = {
  count: number;
};
type CounterActions = {
  increase: () => void;
  decrease: () => void;
};

class CounterStateHandler extends ObservableStateHandler<CounterState, CounterActions> {
  constructor([startCount = 0]) {
    super({ initialState: { count: startCount } });
  }
  
  getActions() {
    return {
      increase() {
        this.setState({
          count: this.getState() + 1
        })
      },
      decrease() {
        const currentState = this.getState();

        if (currentState.count > 0) {
          this.setState({
            count: currentState - 1
          })
        }
      }
    }
  }
}

export function CounterStateFactory(...args) {
  return new CounterStateHandler(...args);
}
```

This can be used in our factory hook function:

```tsx
import { useStateFactory } from '@veams/status-quo';
import { CounterStateFactory } from './counter.state.js';

const Counter = () => {
  const [state, actions] = useStateFactory(CounterStateFactory, [0]);
  
  return (
    <div>
      <h2>Counter: {state}</h2>
      <button onClick={actions.increase}>Increase</button>
      <button onClick={actions.decrease}>Decrease</button>
    </div>
  )
}
```

**What about singletons?**

Therefore, you can use a simple singleton class or use `makeStateSingleton()` and pass it later on to the singleton hook function:

```ts
import { makeStateSingleton } from '@veams/status-quo';

import { CounterStateHandler } from './counter.state.js';

export const CounterStateManager = makeStateSingleton(() => new CounterStateHandler([0]))
```

```tsx
import { useStateSingleton } from '@veams/status-quo';
import { CounterStateManager } from './counter.singleton.js';

const GlobalCounterHandler = () => {
  const [_, actions] = useStateSingleton(CounterStateManager);
  
  return (
    <div>
      <button onClick={actions.increase}>Increase</button>
      <button onClick={actions.decrease}>Decrease</button>
    </div>
  )
}

const GlobalCounterDisplay = () => {
  const [state] = useStateSingleton(CounterStateManager);
  
  return (
    <div>
      <h2>Counter: {state}</h2>
    </div>
  )
}
```

### What about debugging? 

You know redux-devtools? You like it? We covered you (at least a bit)!
You can enable the devtools in an easy way: 

```ts

class CounterStateHandler extends ObservableStateHandler<CounterState, CounterActions> {
  constructor([startCount = 0]) {
    super({
      initialState: { count: startCount },
      options: {
        devTools: { enabled: true, namespace: 'Counter' },
      },
    });
  }

  getActions() {
    return {
      increase() {
        this.setState(
          {
            count: this.getState() + 1,
          },
          'increase'
        );
      },
      decrease() {
        const currentState = this.getState();

        if (currentState.count > 0) {
          this.setState(
            {
              count: currentState - 1,
            },
            'decrease'
          );
        }
      },
    };
  }
}

export function CounterStateFactory(...args) {
  return new CounterStateHandler(...args);
}
```

We just added the `options.devTools` option and also updated the `setState()` function by passing a second argument into it which is the actions name.
Now you can open up the the browser extension and you are able to take a look at your actions and state(s).
