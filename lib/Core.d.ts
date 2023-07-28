import { Events } from "easy-event-emitter";
export type TPermissions = 'public' | 'protected' | 'private';
type TMessage = {
    subscribe?: string;
    unsubscribe?: string;
    channel?: string;
    event?: string;
    message?: any;
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
    protected status: boolean;
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
    protected send(message: TMessage): void;
}
export default Core;
