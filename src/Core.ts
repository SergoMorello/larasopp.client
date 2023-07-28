import EventEmitter,{
	Events
} from "easy-event-emitter";

export type TPermissions = 'public' | 'protected' | 'private';

type TMessage = {
	subscribe?: string;
	unsubscribe?: string;
	channel?: string;
	event?: string;
	message?: any;
	type?: TPermissions;
}

export interface IConfig {
	host: string;
	token?: string;
	tls?: boolean;
}

abstract class Core {
	protected events: Events;
	private ws?: WebSocket;
	protected status: boolean;
	private config: IConfig;

	constructor(config: IConfig) {
		this.events = new EventEmitter;

		this.config = {
			tls: false,
			...config,
		};
		this.status = false;

		this.setConfig = this.setConfig.bind(this);
		this.setToken = this.setToken.bind(this);
		this.connect = this.connect.bind(this);
		this.onOpen = this.onOpen.bind(this);
		this.onClose = this.onClose.bind(this);
		this.onError = this.onError.bind(this);
		this.onMessage = this.onMessage.bind(this);
		
	}

	public setConfig(config: IConfig): void {
		this.config = {
			tls: false,
			...config,
		};
	}

	public setToken(token: string): void {
		this.config = {
			...this.config,
			token
		};
	}

	/**
	 * Connect to websocket
	 * @returns {this}
	 */
	public connect(): this {

		if (!navigator.onLine) {
			setTimeout(this.connect.bind(this), 5000);
			return this;
		}

		try {
			this.ws = new WebSocket(this.config.tls ? 'wss' : 'ws' + '://' + this.config.host + '/token=' + this.config.token);
		}catch(e) {
			console.warn(e);
			this.onError('Socket exception');
			this.onClose(e);
		}

		// this.handleTimeout = setTimeout(() => {
		// 	this.ws?.close(1000, 'timeout');
		// },this.timeout);

		// this.startReconnect();

		this.ws!.onopen = this.onOpen;
		this.ws!.onclose = this.onClose;
		this.ws!.onerror = this.onError;
		this.ws!.onmessage = this.onMessage;
		
		return this;
	}

	/**
	 * Disconnect
	 * @returns {void}
	 */
	public disconnect(): void {
		if (this.status) {
			this.ws?.close();
		}
	}

	protected isJsonString(str: string) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	private onOpen(e: any): void {
		this.status = true;
		this.events.emit("open", e);
	}

	private onClose(e: any): void {
		// if (e.wasClean) {
		// 	console.log('Соединение закрыто чисто');
		// } else {
		// 	if (Larasopp.stepReconnect >= 5) {
		// 		console.log('connect error');
		// 	}else{
		// 		setTimeout(() => {
		// 			console.log('try reconnect...');
		// 			Larasopp.connect(params);
		// 			++Larasopp.stepReconnect;
		// 		}, 3000);
		// 	}
		// }
		this.status = false;
		this.events.emit("close", e);
	}

	private onError(e: any): void {
		this.events.emit("error", e);
	}

	private onMessage(e: any): void {
		if (this.isJsonString(e.data)) {
			const json = JSON.parse(e.data);
			
			this.events.emit(json.channel + ':' + json.event, json.message);
		}
	}

	protected send(message: TMessage) {
		if (!this.status) {
			return;
		}
		this.ws!.send(JSON.stringify(message));
	}
}

export default Core;