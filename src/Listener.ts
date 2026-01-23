import EventEmmiter, {
	type EventListener
} from "easy-event-emitter";
import type Larasopp from ".";
import type {
	TListenCallback,
	TJoiningCallback,
	TLeavingCallback,
	THereCallback,
	TUser
} from "./types";

type TListenerCacheEvents = {
	[event: string]: unknown;
};

class Listener<TEvents = Record<string, unknown>, TUserType extends TUser = TUser> extends EventEmmiter.Stack {
	private readonly context: Larasopp<any, TUserType>;
	private channel: string;
	private listener?: EventListener;
	private cacheEvents: TListenerCacheEvents;
	private hereMap = new Map<string| number, TUserType>();

	constructor(channel: string, constext: Larasopp<any, TUserType>) {
		super([]);
		this.channel = channel;
		this.context = constext;
		this.cacheEvents = {};

		this.here(()=>{}, true);
	}

	public listen<K extends keyof TEvents>(
		event: K,
		callback: TListenCallback<TEvents[K]>,
		withCache = false
	): this {
		const eventString = String(event);
		if (withCache && this.hasCache(eventString)) {
			callback(this.getCache(eventString) as TEvents[K]);
		}
		const listener = this.context.events.addListener(`${this.channel}:${eventString}`, (data) => {
			callback(data as TEvents[K]);
			if (withCache) this.pushCache(eventString, data);
		});

		this.push(listener);
		return this;
	}

	private listenInternal<T = unknown>(
		event: string,
		callback: TListenCallback<T>,
		withCache = false
	): this {
		if (withCache && this.hasCache(event)) {
			callback(this.getCache(event) as T);
		}
		const listener = this.context.events.addListener(`${this.channel}:${event}`, (data) => {
			callback(data as T);
			if (withCache) this.pushCache(event, data);
		});

		this.push(listener);
		return this;
	}

	public here(callback: THereCallback<TUserType>, withCache = true): this {
		const listeners = new EventEmmiter.Stack();

		listeners.push(this.joining((join) => {
			this.hereMap.set(join.id, join);
			callback([...this.hereMap.values()]);
		}));

		listeners.push(this.leaving((leave) => {
			this.hereMap.delete(leave.id);
			callback([...this.hereMap.values()]);
		}))

		const hereListener = this.listenInternal<TUserType[]>('__HERE', (here) => {
			this.hereMap = new Map(here.map((u: TUserType) => [u.id, u]));
			callback([...this.hereMap.values()]);
		}, withCache);

		return hereListener;
	}

	public joining(callback: TJoiningCallback<TUserType>, withCache = false): this {
		return this.listenInternal<TUserType>('__JOIN', callback, withCache);
	}

	public leaving(callback: TLeavingCallback<TUserType>, withCache = false): this {
		return this.listenInternal<TUserType>('__LEAVE', callback, withCache);
	}

	public unsubscribe() {
		this.context.unsubscribe(this.channel);
		this.remove();
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
}

export default Listener;