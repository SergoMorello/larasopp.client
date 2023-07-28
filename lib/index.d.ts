import Core, { IConfig, TPermissions } from "./Core";
export default class Larasopp extends Core {
    constructor(config: IConfig);
    subscribe(channel: string): {
        bind: (event: string, callback: (data: any) => void) => {
            remove: () => void;
        };
        remove: () => void;
    };
    trigger(channel: string, event: string, message: any, permission?: TPermissions): void;
}
