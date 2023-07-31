import Core, { IConfig, TPermissions } from "./Core";
import Subscribe from "./Subscribe";
declare class Larasopp extends Core {
    constructor(config: IConfig);
    subscribe(channel: string): Subscribe;
    trigger<T>(channel: string, event: string, message: T, permission?: TPermissions): void;
}
export default Larasopp;
