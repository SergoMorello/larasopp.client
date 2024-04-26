import { type Event as EventListener } from "easy-event-emitter";
import type Larasopp from ".";
declare class Listener implements EventListener {
    private readonly context;
    private channel;
    private listeners?;
    private listener?;
    constructor(channel: string, constext: Larasopp);
    listen(event: string, callback: (data: any) => void): this;
    here(callback: (data: any) => void): this;
    joining(callback: (data: any) => void): this;
    leaving(callback: (data: any) => void): this;
    unsubscribe(): void;
    remove(): void;
    emit(data: any): void;
}
export default Listener;
