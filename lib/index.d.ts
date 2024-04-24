import { Event } from "easy-event-emitter";
import Core from "./Core";
import Listener from "./Listener";
import type { IConfig, TPermissions, TSocketEvents, TListenerCallback, TListen } from "./types";
declare class Larasopp extends Core {
    private readonly channels;
    constructor(config: IConfig);
    private listenResumeSubscribes;
    subscribe(channel: string): Listener;
    unsubscribe(channel: string): void;
    trigger<T>(channel: string, event: string, message: T, permission?: TPermissions, waitSubscribe?: boolean): void;
    private pushListener;
    addListener(event: TSocketEvents, callback: TListenerCallback): Event | undefined;
}
export type { TListen };
export default Larasopp;
