import EventEmmiter, {
	type EventListener
} from "easy-event-emitter";
import type Larasopp from ".";

type TListenerCacheEvents = {
	[event: string]: unknown;
};

class Listener extends EventEmmiter.Stack {
	private readonly context: Larasopp;
	private channel: string;
	private listener?: EventListener;
	private cacheEvents: TListenerCacheEvents;
	private hereMap = new Map<string| number, unknown>();

	constructor(channel: string, constext: Larasopp) {
		super([]);
		this.channel = channel;
		this.context = constext;
		this.cacheEvents = {};

		this.here(()=>{}, true);
	}

	public listen(event: string, callback: (data: any) => void, withCache = false) {

		if (withCache && this.hasCache(event)) callback(this.getCache(event));
		const listener = this.context.events.addListener(`${this.channel}:${event}`, (data) => {
			callback(data);
			if (withCache) this.pushCache(event, data);
		});

		this.push(listener);
		return this;
	}

	public here(callback: (data: any) => void, withCache = true) {
		const listeners = new EventEmmiter.Stack();

		listeners.push(this.joining((join) => {
			this.hereMap.set(join.id, join);
			callback([...this.hereMap.values()]);
		}));

		listeners.push(this.leaving((leave) => {
			this.hereMap.delete(leave.id);
			callback([...this.hereMap.values()]);
		}))

		const hereListener = this.listen('__HERE', (here) => {
			this.hereMap = new Map(here.map((u: any) => [u.id, u]));
			callback([...this.hereMap.values()]);
		}, withCache);

		return hereListener;
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