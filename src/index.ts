import {
	Event
} from "easy-event-emitter";
import Core,{
	type IConfig,
	type TPermissions,
	SocketEvents,
	type TSocketEvents,
	type TListenerCallback,
	type TListen,
	type TChannels
} from "./Core";
import Listener from "./Listener";

class Larasopp extends Core {
	private readonly channels: TChannels;

	constructor(config: IConfig) {
		super(config);
		
		this.channels = {};
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
		}
		this.send({
			subscribe: channel
		});
		this.channels[channel].push(listener);
	}

	public addListener(event: TSocketEvents, callback: TListenerCallback): Event | undefined {
		if (!SocketEvents.includes(event)) return;
		return this.events.addListener(event, callback);
	}
}

export type {
	TListen
};

export default Larasopp;