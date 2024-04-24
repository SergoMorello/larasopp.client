import { type Event as EventListener } from "easy-event-emitter";
import Core from "./Core";
import Listener from "./Listener";
import type { IConfig, TPermissions, TSocketEvents, TListenerCallback } from "./types";
declare class Larasopp extends Core {
    private readonly channels;
    constructor(config: IConfig);
    private listenResumeSubscribes;
    subscribe(channel: string): Listener;
    unsubscribe(channel: string): void;
    trigger<T>(channel: string, event: string, message: T, permission?: TPermissions, waitSubscribe?: boolean): void;
    private pushListener;
    countListeners(channel: string): number;
    addListener(event: TSocketEvents, callback: TListenerCallback): EventListener | undefined;
}
export type { Listener, EventListener };
export default Larasopp;
