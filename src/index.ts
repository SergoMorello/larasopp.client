import {
	type EventListener
} from "easy-event-emitter";
import Core from "./Core";
import { SocketEvents } from "./constants";
import Listener from "./Listener";
import type {
	IConfig,
	TPermissions,
	TSocketEvents,
	TListenerCallback,
	TChannels,
	TUser
} from "./types";

class Larasopp<TChannelsEvents = Record<string, Record<string, unknown>>, TUserType extends TUser = TUser> extends Core {
	private readonly channels: TChannels<TChannelsEvents, TUserType>;

	constructor(config: IConfig) {
		super(config);
		
		this.channels = {} as TChannels<TChannelsEvents, TUserType>;

		this.listenResumeSubscribes();
	}

	private listenResumeSubscribes() {
		this.addListener('ready', () => {
			(Object.keys(this.channels) as Array<keyof TChannelsEvents>).forEach((channel) => this.send({
				subscribe: channel as string
			}));
		});
	}

	public user(callback: (user: TUserType) => void) {
		if (!this.status) return;
		this.send({me: true});
		this.events.once(`__SYSTEM:user`, callback);
	}

	public userRefresh(callback: (user: TUserType) => void) {
		if (!this.status) return;
		this.send({me: 'refresh'});
		this.events.once(`__SYSTEM:user-refresh`, callback);
	}

	public subscribe<K extends keyof TChannelsEvents>(channel: K): Listener<TChannelsEvents[K], TUserType> {
		const listener = new Listener<TChannelsEvents[K], TUserType>(channel as string, this as any);
		this.pushListener(channel, listener);
		return listener;
	}

	public unsubscribe<K extends keyof TChannelsEvents>(channel: K) {
		if (!this.channels[channel]) return;
		this.channels[channel]!.forEach((listener) => listener.remove());
		delete this.channels[channel];
		this.send({
			unsubscribe: channel as string
		});
	}

	public trigger<K extends keyof TChannelsEvents, E extends keyof TChannelsEvents[K]>(
		channel: K,
		event: E,
		message: TChannelsEvents[K][E],
		permission?: TPermissions,
		waitSubscribe?: boolean
	): void;
	public trigger(
		channel: string,
		event: string,
		message: unknown,
		permission?: TPermissions,
		waitSubscribe?: boolean
	): void;
	public trigger(
		channel: string,
		event: string,
		message: unknown,
		permission: TPermissions = 'public',
		waitSubscribe: boolean = false
	): void {
		const send = () => {
			this.send({
				channel: channel,
				event: event,
				message: message,
				type: permission
			});
		};
		
		if (waitSubscribe) this.events.addListener(`${event}:${channel}`, send);
		send();
	}

	private pushListener<K extends keyof TChannelsEvents>(channel: K, listener: Listener<TChannelsEvents[K], TUserType>): void {
		if (!this.channels[channel]) {
			this.channels[channel] = [];
			this.send({
				subscribe: channel as string
			});
		}
		this.channels[channel]!.push(listener);
	}

	public countListeners<K extends keyof TChannelsEvents>(channel: K): number {
		if (!this.channels[channel]) return -1;
		return this.channels[channel]!.length;
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