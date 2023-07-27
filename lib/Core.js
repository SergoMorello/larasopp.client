"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const easy_event_emitter_1 = __importDefault(require("easy-event-emitter"));
class Core {
    constructor(config) {
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ws", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.events = new easy_event_emitter_1.default;
        this.config = Object.assign({ tls: false }, config);
        this.status = false;
        this.setConfig = this.setConfig.bind(this);
        this.setToken = this.setToken.bind(this);
        this.connect = this.connect.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onError = this.onError.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.trigger = this.trigger.bind(this);
    }
    setConfig(config) {
        this.config = Object.assign({ tls: false }, config);
    }
    setToken(token) {
        this.config = Object.assign(Object.assign({}, this.config), { token });
    }
    /**
     * Connect to websocket
     * @returns {this}
     */
    connect() {
        if (!navigator.onLine) {
            setTimeout(this.connect.bind(this), 5000);
            return this;
        }
        try {
            this.ws = new WebSocket(this.config.tls ? 'wss' : 'ws' + '://' + this.config.host + '/token=' + this.config.token);
        }
        catch (e) {
            console.warn(e);
            this.onError('Socket exception');
            this.onClose(e);
        }
        // this.handleTimeout = setTimeout(() => {
        // 	this.ws?.close(1000, 'timeout');
        // },this.timeout);
        // this.startReconnect();
        this.ws.onopen = this.onOpen;
        this.ws.onclose = this.onClose;
        this.ws.onerror = this.onError;
        this.ws.onmessage = this.onMessage;
        return this;
    }
    /**
     * Disconnect
     * @returns {void}
     */
    disconnect() {
        var _a;
        if (this.status) {
            (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
        }
    }
    isJsonString(str) {
        try {
            JSON.parse(str);
        }
        catch (e) {
            return false;
        }
        return true;
    }
    onOpen(e) {
        this.status = true;
        this.events.emit("open", e);
    }
    onClose(e) {
        // if (e.wasClean) {
        // 	console.log('Соединение закрыто чисто');
        // } else {
        // 	if (Larasopp.stepReconnect >= 5) {
        // 		console.log('connect error');
        // 	}else{
        // 		setTimeout(() => {
        // 			console.log('try reconnect...');
        // 			Larasopp.connect(params);
        // 			++Larasopp.stepReconnect;
        // 		}, 3000);
        // 	}
        // }
        this.status = false;
        this.events.emit("close", e);
    }
    onError(e) {
        this.events.emit("error", e);
    }
    onMessage(e) {
        if (this.isJsonString(e.data)) {
            const json = JSON.parse(e.data);
            this.events.emit(json.channel + ':' + json.event, json.message);
        }
    }
    subscribe(channel) {
        if (this.status) {
            this.send({
                subscribe: channel
            });
        }
        else {
            const event = this.events.addListener('open', () => {
                this.send({
                    subscribe: channel
                });
                event.remove();
            });
        }
        return {
            bind: (event, callback) => {
                const retEvent = this.events.addListener(channel + ':' + event, callback);
                return {
                    remove: () => {
                        this.send({
                            unsubscribe: channel
                        });
                        retEvent.remove();
                    }
                };
            },
            remove: () => {
                this.send({
                    unsubscribe: channel
                });
            }
        };
    }
    trigger(channel, event, message, permission = 'public') {
        this.send({
            channel: channel,
            event: event,
            message: message,
            type: permission
        });
    }
    send(message) {
        if (!this.status) {
            return;
        }
        this.ws.send(JSON.stringify(message));
    }
}
exports.default = Core;
