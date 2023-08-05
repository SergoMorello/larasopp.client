import EventEmitter,{
	Events
} from "easy-event-emitter";

export const SocketEvents = ['open', 'close', 'error'] as const;
export type TSocketEvents = typeof SocketEvents[number];

export const ListenerEvents = ['subscribe', 'unsubscribe'] as const;
export type TListenerEvents = typeof ListenerEvents[number];

export type TListenerCallback = (data:{channel: string}) => void;

export type TPermissions = 'public' | 'protected' | 'private';

export type TBind = {
	remove: () => void;
}

export type TMessage<T> = {
	subscribe?: string;
	unsubscribe?: string;
	channel?: string;
	event?: string;
	message?: T;
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
	protected _status: boolean;
	private config: IConfig;

	constructor(config: IConfig) {
		this.events = new EventEmitter;

		this.config = {
			tls: false,
			...config,
		};
		this._status = false;

		this.send = this.send.bind(this);
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
		this._status = true;
		this.events.emit("open", e);
	}

	private onClose(e: any): void {
		this._status = false;
		this.events.emit("close", e);
	}

	private onError(e: any): void {
		this.events.emit("error", e);
	}

	private onMessage(e: any): void {
		if (this.isJsonString(e.data)) {
			const json = JSON.parse(e.data);
			this.emitListener(json.channel, json.message);
			this.events.emit(json.channel + ':' + json.event, json.message);
		}
	}

	private emitListener(method: TListenerEvents, channel: string): void {
		if (ListenerEvents.includes(method)) {	
			this.events.emit(method + ':' + channel, {
				channel
			});
		}
	}

	public get status(): boolean {
		return this._status;
	}

	protected send<T>(message: TMessage<T>) {
		if (!this.status) return;
		this.ws!.send(JSON.stringify(message));
	}
}

export default Core;