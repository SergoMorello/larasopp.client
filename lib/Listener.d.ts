import { type Event as EventListener } from "easy-event-emitter";
import type Larasopp from ".";
declare class Listener {
    private readonly context;
    private channel;
    private listeners?;
    constructor(channel: string, constext: Larasopp);
    listen(event: string, callback: (data: any) => void): EventListener;
    here(callback: (data: any) => void): EventListener;
    joining(callback: (data: any) => void): EventListener;
    leaving(callback: (data: any) => void): EventListener;
    unsubscribe(): void;
    remove(): void;
}
export default Listener;
