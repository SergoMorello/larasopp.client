import EventEmitter from "easy-event-emitter";
import Core,{
	IConfig
} from "./Core";

export default class Larasopp extends Core {
	private static instance = new Larasopp({
		host: '0.0.0.0'
	});

	constructor(config: IConfig) {
		super(config);
		Larasopp.instance?.setConfig(config);
	}

	public static setConfig = Larasopp.instance.setConfig;

	public static connect = Larasopp.instance.connect;

	public static disconnect = Larasopp.instance.disconnect;

	public static subscribe = Larasopp.instance.subscribe;

	public static trigger = Larasopp.instance.trigger;
}