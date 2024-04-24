import type Listener from "./Listener";
import {
	SocketEvents,
	ListenerEvents
} from "./constants";

export type TSocketEvents = typeof SocketEvents[number];

export type TListenerEvents = typeof ListenerEvents[number];

export type TListenerCallback = (data:{channel: string}) => void;

export type TPermissions = 'public' | 'protected' | 'private';

export type TMessage<T> = {
	subscribe?: string;
	unsubscribe?: string;
	channel?: string;
	event?: string;
	token?: string;
	message?: T;
	type?: TPermissions;
};

export type TConfigDataReviver = {
	[index: string]: (value: any) => any;
};

export interface IConfig {
	host: string;
	token?: string;
	reviver?: (this: any, key: string, value: any) => any;
	dataReviver?: TConfigDataReviver;
	reconnect?: number;
	reconnectDelay?: number;
};

export type TChannels = {
	[channel: string]: Listener[];
};