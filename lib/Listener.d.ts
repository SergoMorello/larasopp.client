import EventEmmiter from "easy-event-emitter";
import type Larasopp from ".";
declare class Listener extends EventEmmiter.Stack {
    private readonly context;
    private channel;
    private listener?;
    private cacheEvents;
    constructor(channel: string, constext: Larasopp);
    listen(event: string, callback: (data: any) => void, withCache?: boolean): this;
    here(callback: (data: any) => void, withCache?: boolean): this;
    joining(callback: (data: any) => void, withCache?: boolean): this;
    leaving(callback: (data: any) => void, withCache?: boolean): this;
    unsubscribe(): void;
    private hasCache;
    private getCache;
    private pushCache;
}
export default Listener;
