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

	constructor(config: IConfig) {
		super(config);
		
		this.subscribe = this.subscribe.bind(this);
		this.trigger = this.trigger.bind(this);
	}

	public subscribe(channel: string): Subscribe {
		return new Subscribe({
			events: this.events,
			status: this.status,
			send: this.send,
			channel
		});
	}

	public trigger<T>(channel: string, event: string, message: T, permission: TPermissions = 'public'): void {
		this.send<T>({
			channel: channel,
			event: event,
			message: message,
			type: permission
		});
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