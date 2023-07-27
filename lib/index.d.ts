import Core, { IConfig } from "./Core";
export default class Larasopp extends Core {
    private static instance;
    constructor(config: IConfig);
    static setConfig: (config: IConfig) => void;
    static connect: () => Larasopp;
    static disconnect: () => void;
    static subscribe: (channel: string) => {
        bind: (event: string, callback: (data: any) => void) => {
            remove: () => void;
        };
        remove: () => void;
    };
    static trigger: (channel: string, event: string, message: any, permission?: "public" | "protected" | "private") => void;
}
