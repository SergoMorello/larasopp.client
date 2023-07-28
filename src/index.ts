import Core,{
	IConfig,
	TPermissions
} from "./Core";

export default class Larasopp extends Core {

	constructor(config: IConfig) {
		super(config);

		this.subscribe = this.subscribe.bind(this);
		this.trigger = this.trigger.bind(this);
	}

	public subscribe(channel: string) {
		if (this.status) {
			this.send({
				subscribe: channel
			});
		}else{
			const event = this.events.addListener('open',() => {
				this.send({
					subscribe: channel
				});
				event.remove();
			});
		}
		
		return {
			bind: (event: string, callback: (data: any) => void) => {
				const retEvent = this.events.addListener(channel + ':' + event, callback);
				return {
					remove: () => {
						this.send({
							unsubscribe: channel
						});
						retEvent.remove();
					}
				}
			},
			remove: () => {
				this.send({
					unsubscribe: channel
				});
			}
		}
	}

	public trigger(channel: string, event: string, message: any, permission: TPermissions = 'public'): void {
		this.send({
			channel: channel,
			event: event,
			message: message,
			type: permission
		});
	}
}