import {
  ToastContent,
  NotValidatedToastProps,
  ToastCallback,
  OnShowCallback,
  OnWillUnmountCallback,
  ToastEvent,
} from '@/core/toast/type';

class EventManager {
  list: Map<ToastEvent, ToastCallback[]> = new Map();

  on(event: 'show', callback: OnShowCallback): EventManager;
  on(event: 'willUnmount', callback: OnWillUnmountCallback): EventManager;
  on(event: ToastEvent, callback: ToastCallback): EventManager {
    const callbacks = this.list.get(event) ?? [];

    callbacks.push(callback);
    this.list.set(event, callbacks);

    return this;
  }

  off(event: ToastEvent, callback?: ToastCallback): EventManager {
    if (!callback) {
      this.list.delete(event);
    }

    if (callback) {
      const callbacks = this.list.get(event) ?? [];

      const cb = callbacks.filter((cb) => cb !== callback);

      this.list.set(event, cb);

      return this;
    }

    return this;
  }

  emit(event: 'show', content: ToastContent, options: NotValidatedToastProps): void;
  emit(event: 'willUnmount'): void;
  emit(event: ToastEvent, ...args: never) {
    const callbacks = this.list.get(event);

    if (!this.list.has(event) || !callbacks) {
      return;
    }

    callbacks.forEach((callback: ToastCallback) => {
      callback(args[0], args[1]);
    });
  }
}

const eventManager = new EventManager();

export { eventManager };
