import {
	TMessage,
	ListenerEvents,
	TListenerEvents,
	TListenerCallback,
	TBind
} from "./Core";
import {
	Event,
	Events
} from "easy-event-emitter";


interface ISubscribe {
	events: Events;
	hasChannel: (channel: string) => boolean;
	pushChannel: (channel: string) => void;
	removeChannel: (channel: string) => void;
	send: <T>(message: TMessage<T>) => void;
	channel: string;
	status: boolean;
}

class Subscribe {
	private events: Events;
	private hasChannel: (channel: string) => boolean;
	private pushChannel: (channel: string) => void;
	private removeChannel: (channel: string) => void;
	private status: boolean;
	private _channel: string;
	private send: <T>(message: TMessage<T>) => void;

	constructor({events, hasChannel, pushChannel, removeChannel, status, channel, send}: ISubscribe) {
		this.events = events;
		this.hasChannel = hasChannel;
		this.pushChannel = pushChannel;
		this.removeChannel = removeChannel;
		this.status = status;
		this._channel = channel;
		this.send = send;

		this.init();
	}

	public get channel(): string {
		return this._channel;
	}

	private init(): void {
		this.pushChannel(this.channel);

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

	public bind<T>(event: string, callback: (data: T) => void): TBind {
		const Event = this.events.addListener(this.channel + ':' + event, callback);
		return {
			remove: () => {
				this.remove();
				Event.remove();
			}
		}
	}

	public remove(): void {
		this.removeChannel(this.channel);
		if (this.hasChannel(this.channel)) return;
		this.send({
			unsubscribe: this.channel
		});
	}

	public addListener(event: TListenerEvents, callback: TListenerCallback): Event | undefined {
		return this.events.addListener(event + ':' + this.channel, callback);
	}
}

export default Subscribe;