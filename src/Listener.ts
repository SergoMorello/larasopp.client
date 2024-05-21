import {
	type EventListener
} from "easy-event-emitter";
import type Larasopp from ".";

type TListenerCacheEvents = {
	[event: string]: unknown;
};

class Listener implements Omit<EventListener, 'events'> {
	private readonly context: Larasopp;
	private channel: string;
	private listeners?: EventListener[];
	private listener?: EventListener;
	private cacheEvents: TListenerCacheEvents;

	constructor(channel: string, constext: Larasopp) {
		this.channel = channel;
		this.context = constext;
		this.cacheEvents = {};

		this.here(()=>{}, true);
	}

	public get name() {
		return '__ws-event';
	}

	public pushListener(object: EventListener<any, string | number | symbol, any>): void {}

	public hasHandler(handler: (data: any) => void) {
		if (this.listeners) {
			for (const listener of this.listeners) {
				if (listener.hasHandler(handler)) {
					return true;
				}
			}
		}
		return false;
	}

	public onEmit(handlerEmit: () => void) {
		if (this.listeners) {
			for (const listener of this.listeners) {
				listener.onEmit(handlerEmit);
			}
		}
	}

	public onRemove(handlerRemove: () => void) {
		if (this.listeners) {
			for (const listener of this.listeners) {
				listener.onRemove(handlerRemove);
			}
		}
	}

	public listen(event: string, callback: (data: any) => void, withCache = false) {
		if (!this.listeners) {
			this.listeners = [];
		}
		
		if (withCache && this.hasCache(event)) callback(this.getCache(event));
		const listener = this.context.events.addListener(this.channel + ':' + event, (data) => {
			callback(data);
			if (withCache) this.pushCache(event, data);
		});
		this.listeners.push(listener);
		return this;
	}

	public here(callback: (data: any) => void, withCache = true) {
		return this.listen('__HERE', callback, withCache);
	}

	public joining(callback: (data: any) => void, withCache = false) {
		return this.listen('__JOIN', callback, withCache);
	}

	public leaving(callback: (data: any) => void, withCache = false) {
		return this.listen('__LEAVE', callback, withCache);
	}

	public unsubscribe() {
		this.context.unsubscribe(this.channel);
		this.remove();
	}

	public remove() {
		if (!this.listeners) return;
		this.listeners.forEach((listener) => listener.remove());
	}

	private hasCache(event: string) {
		return event in this.cacheEvents;
	}

	private getCache(event: string) {
		return this.cacheEvents[event];
	}

	private pushCache(event: string, data: unknown) {
		this.cacheEvents[event] = data;
	}

	public emit(data: any): void {}
}

export default Listener;