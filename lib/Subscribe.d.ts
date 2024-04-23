import { TMessage, TListenerEvents, TListenerCallback, TListen } from "./Core";
import type { Event, Events } from "easy-event-emitter";
interface ISubscribe {
    events: Events;
    hasChannel: (channel: string) => boolean;
    pushChannel: (channel: string) => void;
    removeChannel: (channel: string) => void;
    send: <T>(message: TMessage<T>) => void;
    channel: string;
    status: boolean;
}
declare class Subscribe {
    private events;
    private currentEvents;
    private hasChannel;
    private pushChannel;
    private removeChannel;
    private status;
    private _channel;
    private send;
    constructor({ events, hasChannel, pushChannel, removeChannel, status, channel, send }: ISubscribe);
    get channel(): string;
    private init;
    listen<T>(event: string, callback: (data: T) => void): TListen;
    private clearEvents;
    remove(): void;
    addListener(event: TListenerEvents, callback: TListenerCallback): Event | undefined;
}
export default Subscribe;
