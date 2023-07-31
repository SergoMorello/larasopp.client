import { TMessage } from "./Core";
import { Events } from "easy-event-emitter";
type TReturn = {
    remove: () => void;
};
interface ISubscribe {
    events: Events;
    send: <T>(message: TMessage<T>) => void;
    channel: string;
    status: boolean;
}
declare class Subscribe {
    private events;
    private status;
    private _channel;
    private send;
    constructor({ events, status, channel, send }: ISubscribe);
    get channel(): string;
    private init;
    bind<T>(event: string, callback: (data: T) => void): TReturn;
    remove(): void;
}
export default Subscribe;