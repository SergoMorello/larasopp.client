import { Event } from "easy-event-emitter";
import Core, { type IConfig, type TPermissions, type TSocketEvents, type TListenerCallback, type TListen } from "./Core";
import Listener from "./Listener";
declare class Larasopp extends Core {
    private readonly channels;
    constructor(config: IConfig);
    subscribe(channel: string): Listener;
    unsubscribe(channel: string): void;
    trigger<T>(channel: string, event: string, message: T, permission?: TPermissions, waitSubscribe?: boolean): void;
    private pushListener;
    addListener(event: TSocketEvents, callback: TListenerCallback): Event | undefined;
}
export type { TListen };
export default Larasopp;
