import type { EventPayload, EventHandler, SubscriptionEntry } from './types';

function patternToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const regexStr = escaped.replace(/\*/g, '.*');
  return new RegExp(`^${regexStr}$`);
}

export class EventBus {
  private subscribers: SubscriptionEntry[] = [];
  private broadcastChannel: BroadcastChannel | null = null;
  private debugMode = false;

  constructor(options?: { debug?: boolean; useBroadcastChannel?: boolean }) {
    if (options?.debug) {
      this.debugMode = true;
    }
    if (options?.useBroadcastChannel && typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel('learninghub-event-bus');
        this.broadcastChannel.onmessage = (event: MessageEvent) => {
          const { type, payload } = event.data as { type: string; payload: EventPayload };
          this.dispatchToLocal(type, payload);
        };
      } catch {
      }
    }
  }

  publish<T = Record<string, unknown>>(type: string, payload: EventPayload<T>): void {
    if (this.debugMode) {
      console.log(`[EVENT BUS] ${type}`, payload);
    }
    this.dispatchToLocal(type, payload as unknown as EventPayload);
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type, payload });
      } catch {
      }
    }
  }

  subscribe<T = Record<string, unknown>>(pattern: string, handler: EventHandler<T>): () => void {
    const regex = patternToRegex(pattern);
    const entry: SubscriptionEntry = {
      pattern,
      regex,
      handler: handler as EventHandler,
    };
    this.subscribers.push(entry);
    return () => this.unsubscribe(pattern, handler as EventHandler);
  }

  unsubscribe(pattern: string, handler: EventHandler): void {
    this.subscribers = this.subscribers.filter(
      (s) => !(s.pattern === pattern && s.handler === handler),
    );
  }

  clear(): void {
    this.subscribers = [];
  }

  getSubscriberCount(): number {
    return this.subscribers.length;
  }

  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  private dispatchToLocal(type: string, payload: EventPayload): void {
    for (const entry of this.subscribers) {
      if (entry.regex.test(type)) {
        entry.handler(payload);
      }
    }
  }
}

let defaultInstance: EventBus | null = null;

export function getDefaultEventBus(options?: { debug?: boolean; useBroadcastChannel?: boolean }): EventBus {
  if (!defaultInstance) {
    defaultInstance = new EventBus(options);
  }
  return defaultInstance;
}

export function initEventBus(): EventBus {
  const query = typeof globalThis !== 'undefined' && typeof (globalThis as Record<string, unknown>).location !== 'undefined'
    ? ((globalThis as Record<string, unknown>).location as Location).search
    : '';
  const urlParams = new URLSearchParams(query);
  const debugEvents = urlParams.get('debug_events') === 'true';
  const bus = getDefaultEventBus({ debug: debugEvents, useBroadcastChannel: true });
  return bus;
}
