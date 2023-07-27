type TPermissions = 'public' | 'protected' | 'private';
export interface IConfig {
    host: string;
    token?: string;
    tls?: boolean;
}
declare abstract class Core {
    private events;
    private ws?;
    private status;
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
    private isJsonString;
    private onOpen;
    private onClose;
    private onError;
    private onMessage;
    subscribe(channel: string): {
        bind: (event: string, callback: (data: any) => void) => {
            remove: () => void;
        };
        remove: () => void;
    };
    trigger(channel: string, event: string, message: any, permission?: TPermissions): void;
    private send;
}
export default Core;
