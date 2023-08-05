import {
	Event
} from "easy-event-emitter";
import Core,{
	IConfig,
	TPermissions,
	SocketEvents,
	TSocketEvents,
	TListenerCallback
} from "./Core";
import Subscribe from "./Subscribe";

class Larasopp extends Core {
	private _channels: string[];

	constructor(config: IConfig) {
		super(config);
		
		this._channels = [];

		this.subscribe = this.subscribe.bind(this);
		this.trigger = this.trigger.bind(this);
		this.hasChannel = this.hasChannel.bind(this);
		this.pushChannel = this.pushChannel.bind(this);
		this.removeChannel = this.removeChannel.bind(this);
	}

	public subscribe(channel: string): Subscribe {
		return new Subscribe({
			events: this.events,
			hasChannel: this.hasChannel,
			pushChannel: this.pushChannel,
			removeChannel: this.removeChannel,
			status: this.status,
			send: this.send,
			channel
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

	private pushChannel(channel: string): void {
		if (this._channels.indexOf(channel) >= 0) return;
		this._channels.push(channel);
	}

	private removeChannel(channel: string): void {
		const index = this._channels.indexOf(channel);
		if (index >= 0) this._channels.splice(index, 1);
	}

	private get channels(): string[] {
		return this._channels;
	}

	public hasChannel(channel: string): boolean {
		return this.channels.indexOf(channel) >= 0;
	}

	public addListener(event: TSocketEvents, callback: TListenerCallback): Event | undefined {
		if (!SocketEvents.includes(event)) return;
		return this.events.addListener(event, callback);
	}
}

export type {
	Subscribe
};

export default Larasopp;