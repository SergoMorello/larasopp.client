import { type Events } from "easy-event-emitter";
import type Listener from "./Listener";
export declare const SocketEvents: readonly ["open", "close", "error"];
export type TSocketEvents = typeof SocketEvents[number];
export declare const ListenerEvents: readonly ["subscribe", "unsubscribe"];
export type TListenerEvents = typeof ListenerEvents[number];
export type TListenerCallback = (data: {
    channel: string;
}) => void;
export type TPermissions = 'public' | 'protected' | 'private';
export type TListen = {
    remove: () => void;
};
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
}
export type TChannels = {
    [channel: string]: Listener[];
};
declare abstract class Core {
    readonly events: Events;
    private ws?;
    private _socketId?;
    private config;
    constructor(config: IConfig);
    setConfig(config: IConfig): void;
    setToken(token: string): void;
    /**
     * Connect to websocket
     * @returns {this}
     */
    connect(token?: string): this;
    /**
     * Disconnect
     * @returns {void}
     */
    disconnect(): void;
    protected isJson(str: string): boolean;
    private handleOpen;
    private handleClose;
    private handleError;
    private jsonParse;
    private handleMessage;
    private emitListener;
    get socketId(): string | undefined;
    get status(): boolean;
    private _send;
    protected send<T>(message: TMessage<T>): void;
}
export default Core;
