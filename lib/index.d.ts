import { Event } from "easy-event-emitter";
import Core, { IConfig, TPermissions, TSocketEvents, TListenerCallback } from "./Core";
import Subscribe from "./Subscribe";
declare class Larasopp extends Core {
    constructor(config: IConfig);
    subscribe(channel: string): Subscribe;
    trigger<T>(channel: string, event: string, message: T, permission?: TPermissions): void;
    addListener(event: TSocketEvents, callback: TListenerCallback): Event | undefined;
}
export type { Subscribe };
export default Larasopp;
