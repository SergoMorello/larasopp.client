import {
	type Event
} from "easy-event-emitter";
import type Larasopp from ".";

class Listener {
	private readonly context: Larasopp;
	private channel: string;
	private listeners?: Event[];

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
		return listener;
	}

	public remove() {
		if (!this.listeners) return;
		this.listeners.forEach((listener) => listener.remove());
	}
}

export default Listener;