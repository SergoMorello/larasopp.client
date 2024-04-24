import EventEmitter,{
	type Events
} from "easy-event-emitter";
import type Listener from "./Listener";

export const SocketEvents = ['open', 'close', 'error'] as const;
export type TSocketEvents = typeof SocketEvents[number];

export const ListenerEvents = ['subscribe', 'unsubscribe'] as const;
export type TListenerEvents = typeof ListenerEvents[number];

export type TListenerCallback = (data:{channel: string}) => void;

export type TPermissions = 'public' | 'protected' | 'private';

export type TListen = {
	remove: () => void;
}

export type TMessage<T> = {
	subscribe?: string;
	unsubscribe?: string;
	channel?: string;
	event?: string;
	token?: string;
	message?: T;
	type?: TPermissions;
}

export type TConfigDataReviver = {
	[index: string]: (value: any) => any;
};

export interface IConfig {
	host: string;
	token?: string;
	tls?: boolean;
	reviver?: (this: any, key: string, value: any) => any;
	dataReviver?: TConfigDataReviver;
}

export type TChannels = {
	[channel: string]: Listener[];
};

abstract class Core {
	public readonly events: Events;
	private ws?: WebSocket;
	private _socketId?: string;
	private config: IConfig;

	constructor(config: IConfig) {
		this.events = new EventEmitter;

		this.config = {
			tls: false,
			...config,
		};
		
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleError = this.handleError.bind(this);
		this.handleMessage = this.handleMessage.bind(this);
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
		this.send({
			token
		});
	}

	/**
	 * Connect to websocket
	 * @returns {this}
	 */
	public connect(): this {
		try {
			const host = [(this.config.tls ? 'wss' : 'ws') + '://'];
			host.push(this.config.host);
			if (this.config.token) host.push('/token=' + this.config.token);

			this.ws = new WebSocket(host.join(''));
			this.ws.onopen = this.handleOpen;
			this.ws.onclose = this.handleClose;
			this.ws.onerror = this.handleError;
			this.ws.onmessage = this.handleMessage;
		}catch(e) {
			console.warn(e);
			this.handleError(new Event('Socket exception'));
			this.handleClose(new CloseEvent(String(e)));
		}
		
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
		this.ws = undefined;
	}

	protected isJson(str: string) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	private handleOpen(e: Event): void {
		this.events.emit("open", e);
	}

	private handleClose(e: CloseEvent): void {
		this.events.emit("close", e);
	}

	private handleError(e: Event): void {
		this.events.emit("error", e);
	}

	private jsonParse(str: string) {
		if (this.config) {
			if (typeof this.config.reviver === 'function') {
				return JSON.parse(str, this.config.reviver);
			}
	
			if (this.config.dataReviver) {
				const replace = this.config.dataReviver;
				return JSON.parse(str, (key, value) => {
					if (key === "createdAt" || key === "updatedAt") {
						return new Date(value);
					}
					if (key in replace && typeof replace[key] === 'function') {
						return replace[key](value);
					}
					return value;
				});
			}
		}
		
		return JSON.parse(str);
	}

	private handleMessage(e: MessageEvent): void {
		if (this.isJson(e.data)) {
			const json = this.jsonParse(e.data);
			if (json.socket_id) {
				this._socketId = json.socket_id;
				return;
			}
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

	public get socketId() {
		return this._socketId;
	}

	public get status(): boolean {
		if (!this.ws) return false;
		return this.ws?.readyState === this.ws?.OPEN;
	}

	private _send<T>(message: TMessage<T>) {
		if (!this.ws || !this.status) return;
		this.ws.send(JSON.stringify(message));
	}

	protected send<T>(message: TMessage<T>) {
		if (this.status) {
			this._send(message);
		}else{
			if (this.ws?.readyState !== this.ws?.CONNECTING) this.connect();
			const event = this.events.addListener('open',() => {
				this._send(message);
				event.remove();
			});
		}
	}
}

export default Core;