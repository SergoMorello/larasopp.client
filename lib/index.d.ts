import { Event } from "easy-event-emitter";
import Core, { IConfig, TPermissions, TSocketEvents, TListenerCallback, TBind } from "./Core";
import Subscribe from "./Subscribe";
declare class Larasopp extends Core {
    private _channels;
    constructor(config: IConfig);
    subscribe(channel: string): Subscribe;
    trigger<T>(channel: string, event: string, message: T, permission?: TPermissions, waitSubscribe?: boolean): void;
    private pushChannel;
    private removeChannel;
    private get channels();
    hasChannel(channel: string): boolean;
    addListener(event: TSocketEvents, callback: TListenerCallback): Event | undefined;
}
export type { Subscribe, TBind };
export default Larasopp;
