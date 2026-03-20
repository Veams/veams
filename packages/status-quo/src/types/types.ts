export interface StateSubscriptionHandler<V, A> {
  subscribe(listener: () => void): () => void;
  subscribe(listener: (value: V) => void): () => void;
  getSnapshot: () => V;
  destroy: () => void;
  getInitialState: () => V;
  getActions: () => A;
}
