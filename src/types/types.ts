export interface StateSubscriptionHandler<V, A> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => V;
  destroy: () => void;
  getInitialState: () => V;
  getActions: () => A;
}
