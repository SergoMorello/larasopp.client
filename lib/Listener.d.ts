import { type Event } from "easy-event-emitter";
import type Larasopp from ".";
declare class Listener {
    private readonly context;
    private channel;
    private listeners?;
    constructor(channel: string, constext: Larasopp);
    listen(event: string, callback: (data: any) => void): Event;
    remove(): void;
}
export default Listener;
