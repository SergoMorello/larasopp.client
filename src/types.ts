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
	me?: true | 'refresh';
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
	debug?: boolean;
};

export type TUser = {
	id: string | number;
	[key: string]: unknown;
};

export type TChannels<TChannelsEvents = Record<string, Record<string, unknown>>, TUserType extends TUser = TUser> = {
	[K in keyof TChannelsEvents]?: Listener<TChannelsEvents[K], TUserType>[];
};

export type TJoinData<T extends TUser = TUser> = T;

export type TLeaveData<T extends TUser = TUser> = T;

export type THereCallback<T extends TUser = TUser> = (users: T[]) => void;

export type TListenCallback<T = unknown> = (data: T) => void;

export type TJoiningCallback<T extends TUser = TUser> = (data: TJoinData<T>) => void;

export type TLeavingCallback<T extends TUser = TUser> = (data: TLeaveData<T>) => void;