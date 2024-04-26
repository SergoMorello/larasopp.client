import {
	type Event as EventListener
} from "easy-event-emitter";
import type Larasopp from ".";

class Listener implements EventListener {
	private readonly context: Larasopp;
	private channel: string;
	private listeners?: EventListener[];
	private listener?: EventListener;

	constructor(channel: string, constext: Larasopp) {
		this.channel = channel;
		this.context = constext;
	}

	public listen(event: string, callback: (data: any) => void) {
		if (!this.listeners) {
			this.listeners = [];
		}
		const listener = this.context.events.addListener(this.channel + ':' + event, callback);
		this.listeners.push(listener);
		return this;
	}

	public here(callback: (data: any) => void) {
		return this.listen('__HERE', callback);
	}

	public joining(callback: (data: any) => void) {
		return this.listen('__JOIN', callback);
	}

	public leaving(callback: (data: any) => void) {
		return this.listen('__LEAVE', callback);
	}

	public unsubscribe() {
		this.context.unsubscribe(this.channel);
		this.remove();
	}

	public remove() {
		if (!this.listeners) return;
		this.listeners.forEach((listener) => listener.remove());
	}

	public emit(data: any): void {}
}

export default Listener;