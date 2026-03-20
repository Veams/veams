declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: {
      connect: (opts: Record<string, unknown>) => DevTools;
    };
  }
}

export type MessagePayload = {
  type: string;
  payload: {
    type: string;
    actionId: number;
  };
  state: string;
  id: string;
  source: '@devtools-extension';
};

export type DevTools = {
  init: (state: unknown) => void;
  send: (action: string, state: unknown) => void;
  subscribe: (cb: (message: MessagePayload) => void) => void;
};

export function withDevTools<S>(initialState: S, options = {}): DevTools | null {
  if (typeof window === 'undefined') {
    return null;
  }

   
  if (!window.__REDUX_DEVTOOLS_EXTENSION__) {
    console.error('Status Quo :: Devtools Extension is not installed!');
    return null;
  }

   
  const devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect(options);

  devTools.init(initialState);

   
  return devTools;
}
