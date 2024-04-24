import {
	type Event as EventListener
} from "easy-event-emitter";
import Core from "./Core";
import { SocketEvents } from "./constants";
import Listener from "./Listener";
import type {
	IConfig,
	TPermissions,
	TSocketEvents,
	TListenerCallback,
	TChannels
} from "./types";

class Larasopp extends Core {
	private readonly channels: TChannels;

	constructor(config: IConfig) {
		super(config);
		
		this.channels = {};

		this.listenResumeSubscribes();
	}

	private listenResumeSubscribes() {
		this.addListener('open', () => {
			Object.keys(this.channels).forEach((channel) => this.send({
				subscribe: channel
			}));
		});
	}

	public subscribe(channel: string) {
		const listener = new Listener(channel, this);
		this.pushListener(channel, listener);
		return listener;
	}

	public unsubscribe(channel: string) {
		if (!this.channels[channel]) return;
		this.channels[channel].forEach((listener) => listener.remove());
		delete this.channels[channel];
		this.send({
			unsubscribe: channel
		});
	}

	public trigger<T>(channel: string, event: string, message: T, permission: TPermissions = 'public', waitSubscribe: boolean = false): void {
		const send = () => {
			this.send<T>({
				channel: channel,
				event: event,
				message: message,
				type: permission
			});
		};
		
		if (waitSubscribe) this.events.addListener(event + ':' + channel, send);
		send();
	}

	private pushListener(channel: string, listener: Listener): void {
		if (!this.channels[channel]) {
			this.channels[channel] = [];
			this.send({
				subscribe: channel
			});
		}
		this.channels[channel].push(listener);
	}

	public countListeners(channel: string) {
		if (!this.channels[channel]) return -1;
		return this.channels[channel].length;
	}

	public addListener(event: TSocketEvents, callback: TListenerCallback): EventListener | undefined {
		if (!SocketEvents.includes(event)) return;
		return this.events.addListener(event, callback);
	}
}

export type {
	Listener,
	EventListener
};

export default Larasopp;