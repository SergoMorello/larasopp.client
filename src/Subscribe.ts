import {
	TMessage
} from "./Core";
import {
	Events
} from "easy-event-emitter";

type TReturn = {
	remove: () => void;
}

interface ISubscribe {
	events: Events;
	send: <T>(message: TMessage<T>) => void;
	channel: string;
	status: boolean;
}

class Subscribe {
	private events: Events;
	private status: boolean;
	private _channel: string;
	private send: <T>(message: TMessage<T>) => void;

	constructor({events, status, channel, send}: ISubscribe) {
		this.events = events;
		this.status = status;
		this._channel = channel;
		this.send = send;

		this.init();
	}

	public get channel(): string {
		return this._channel;
	}

	private init(): void {
		if (this.status) {
			this.send({
				subscribe: this.channel
			});
		}else{
			const event = this.events.addListener('open',() => {
				this.send({
					subscribe: this.channel
				});
				event.remove();
			});
		}
	}

	public bind<T>(event: string, callback: (data: T) => void): TReturn {
		const Event = this.events.addListener(this.channel + ':' + event, callback);
		return {
			remove: () => {
				this.send({
					unsubscribe: this.channel
				});
				Event.remove();
			}
		}
	}

	public remove(): void {
		this.send({
			unsubscribe: this.channel
		});
	}
}

export default Subscribe;