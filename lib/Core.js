"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenerEvents = void 0;
const easy_event_emitter_1 = __importDefault(require("easy-event-emitter"));
exports.ListenerEvents = ['subscribe', 'unsubscribe'];
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
        Object.defineProperty(this, "_status", {
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
        this._status = false;
        this.send = this.send.bind(this);
        this.setConfig = this.setConfig.bind(this);
        this.setToken = this.setToken.bind(this);
        this.connect = this.connect.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onError = this.onError.bind(this);
        this.onMessage = this.onMessage.bind(this);
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
        this._status = true;
        this.events.emit("open", e);
    }
    onClose(e) {
        this._status = false;
        this.events.emit("close", e);
    }
    onError(e) {
        this.events.emit("error", e);
    }
    onMessage(e) {
        if (this.isJsonString(e.data)) {
            const json = JSON.parse(e.data);
            this.emitListener(json.channel, json.message);
            this.events.emit(json.channel + ':' + json.event, json.message);
        }
    }
    emitListener(method, channel) {
        if (exports.ListenerEvents.includes(method)) {
            this.events.emit(method + ':' + channel, {
                channel
            });
        }
    }
    get status() {
        return this._status;
    }
    send(message) {
        if (!this.status) {
            return;
        }
        this.ws.send(JSON.stringify(message));
    }
}
exports.default = Core;
