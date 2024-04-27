import { type Events } from "easy-event-emitter";
import type { IConfig, TMessage } from "./types";
declare abstract class Core {
    readonly events: Events;
    private ws?;
    private _socketId?;
    private config;
    private reconnectCount;
    constructor(config: IConfig);
    setConfig(config: IConfig): this;
    setToken(token: string): this;
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
    private tryReconnect;
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
