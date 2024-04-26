import { type Event as EventListener } from "easy-event-emitter";
import type Larasopp from ".";
declare class Listener implements EventListener {
    private readonly context;
    private channel;
    private listeners?;
    private listener?;
    private cacheEvents;
    constructor(channel: string, constext: Larasopp);
    listen(event: string, callback: (data: any) => void, withCache?: boolean): this;
    here(callback: (data: any) => void, withCache?: boolean): this;
    joining(callback: (data: any) => void, withCache?: boolean): this;
    leaving(callback: (data: any) => void, withCache?: boolean): this;
    unsubscribe(): void;
    remove(): void;
    private hasCache;
    private getCache;
    private pushCache;
    emit(data: any): void;
}
export default Listener;
