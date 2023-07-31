import Core,{
	IConfig,
	TPermissions
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
}

export default Larasopp;