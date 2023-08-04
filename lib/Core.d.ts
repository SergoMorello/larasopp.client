import { Events } from "easy-event-emitter";
export declare const SocketEvents: readonly ["open", "close", "error"];
export type TSocketEvents = typeof SocketEvents[number];
export declare const ListenerEvents: readonly ["subscribe", "unsubscribe"];
export type TListenerEvents = typeof ListenerEvents[number];
export type TListenerCallback = (data: {
    channel: string;
}) => void;
export type TPermissions = 'public' | 'protected' | 'private';
export type TMessage<T> = {
    subscribe?: string;
    unsubscribe?: string;
    channel?: string;
    event?: string;
    message?: T;
    type?: TPermissions;
};
export interface IConfig {
    host: string;
    token?: string;
    tls?: boolean;
}
declare abstract class Core {
    protected events: Events;
    private ws?;
    protected _status: boolean;
    private config;
    constructor(config: IConfig);
    setConfig(config: IConfig): void;
    setToken(token: string): void;
    /**
     * Connect to websocket
     * @returns {this}
     */
    connect(): this;
    /**
     * Disconnect
     * @returns {void}
     */
    disconnect(): void;
    protected isJsonString(str: string): boolean;
    private onOpen;
    private onClose;
    private onError;
    private onMessage;
    private emitListener;
    get status(): boolean;
    protected send<T>(message: TMessage<T>): void;
}
export default Core;
