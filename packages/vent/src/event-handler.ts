export type EventCallback<TData = unknown, TScope = unknown> = (
  this: TScope,
  data: TData
) => void;

export interface EventHandler<TTopic extends string = string, TData = unknown, TScope = unknown> {
  publish: (topic: TTopic, data?: TData, scope?: TScope) => void;
  trigger: EventHandler<TTopic, TData, TScope>['publish'];
  subscribe: (topic: TTopic | string, callback: EventCallback<TData, TScope>) => void;
  on: EventHandler<TTopic, TData, TScope>['subscribe'];
  unsubscribe: (
    topic: TTopic | string,
    callback: EventCallback<TData, TScope>,
    completely?: boolean
  ) => void;
  off: EventHandler<TTopic, TData, TScope>['unsubscribe'];
}

function toTopics<TTopic extends string>(topic: TTopic | string): TTopic[] {
  return topic
    .trim()
    .split(/\s+/)
    .filter(Boolean) as TTopic[];
}

export function createEventHandling<
  TTopic extends string = string,
  TData = unknown,
  TScope = unknown,
>(): EventHandler<TTopic, TData, TScope> {
  const listenersByTopic = new Map<TTopic, EventCallback<TData, TScope>[]>();

  const publish: EventHandler<TTopic, TData, TScope>['publish'] = (topic, data, scope) => {
    const listeners = listenersByTopic.get(topic);

    if (!listeners || listeners.length === 0) {
      return;
    }

    const listenerScope = scope ?? (eventHandler as TScope);

    for (const listener of [...listeners].reverse()) {
      listener.call(listenerScope, data as TData);
    }
  };

  const subscribe: EventHandler<TTopic, TData, TScope>['subscribe'] = (topic, callback) => {
    for (const topicName of toTopics(topic)) {
      const listeners = listenersByTopic.get(topicName) ?? [];

      listeners.push(callback);
      listenersByTopic.set(topicName, listeners);
    }
  };

  const unsubscribe: EventHandler<TTopic, TData, TScope>['unsubscribe'] = (
    topic,
    callback,
    completely = false
  ) => {
    for (const topicName of toTopics(topic)) {
      const listeners = listenersByTopic.get(topicName);

      if (!listeners || listeners.length === 0) {
        continue;
      }

      for (let index = listeners.length - 1; index >= 0; index -= 1) {
        if (listeners[index] === callback) {
          listeners.splice(index, 1);
        }
      }

      if (completely || listeners.length === 0) {
        listenersByTopic.delete(topicName);
      }
    }
  };

  const eventHandler: EventHandler<TTopic, TData, TScope> = {
    off: unsubscribe,
    on: subscribe,
    publish,
    subscribe,
    trigger: publish,
    unsubscribe,
  };

  return eventHandler;
}

export default createEventHandling;
