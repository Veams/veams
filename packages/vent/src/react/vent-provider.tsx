import React, { createContext, useContext, useEffect, useRef } from 'react';

import type { EventCallback, EventHandler } from '../event-handler.js';

export interface VentProviderProps<TTopic extends string = string, TData = unknown, TScope = unknown> {
  children: React.ReactNode;
  instance: EventHandler<TTopic, TData, TScope>;
}

const VentContext = createContext<EventHandler<string, unknown, unknown> | null>(null);

export function VentProvider<TTopic extends string = string, TData = unknown, TScope = unknown>({
  children,
  instance,
}: VentProviderProps<TTopic, TData, TScope>) {
  return (
    <VentContext.Provider value={instance as EventHandler<string, unknown, unknown>}>
      {children}
    </VentContext.Provider>
  );
}

export function useVent<TTopic extends string = string, TData = unknown, TScope = unknown>() {
  const vent = useContext(VentContext);

  if (!vent) {
    throw new Error('useVent must be used within a VentProvider');
  }

  return vent as EventHandler<TTopic, TData, TScope>;
}

export function useVentSubscribe<
  TTopic extends string = string,
  TData = unknown,
  TScope = unknown,
>(topic: TTopic | string, callback: EventCallback<TData, TScope>) {
  const vent = useVent<TTopic, TData, TScope>();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const listener: EventCallback<TData, TScope> = function (this: TScope, data: TData) {
      callbackRef.current.call(this, data);
    };

    vent.subscribe(topic, listener);

    return () => {
      vent.unsubscribe(topic, listener);
    };
  }, [topic, vent]);
}
