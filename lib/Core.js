"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenerEvents = exports.SocketEvents = void 0;
const easy_event_emitter_1 = __importDefault(require("easy-event-emitter"));
exports.SocketEvents = ['open', 'close', 'error'];
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
        Object.defineProperty(this, "_socketId", {
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
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
    }
    setConfig(config) {
        this.config = Object.assign({ tls: false }, config);
    }
    setToken(token) {
        this.config = Object.assign(Object.assign({}, this.config), { token });
        this.send({
            token
        });
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
            const host = [(this.config.tls ? 'wss' : 'ws') + '://'];
            host.push(this.config.host);
            if (this.config.token)
                host.push('/token=' + this.config.token);
            this.ws = new WebSocket(host.join(''));
            this.ws.onopen = this.handleOpen;
            this.ws.onclose = this.handleClose;
            this.ws.onerror = this.handleError;
            this.ws.onmessage = this.handleMessage;
        }
        catch (e) {
            console.warn(e);
            this.handleError(new Event('Socket exception'));
            this.handleClose(new CloseEvent(String(e)));
        }
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
            this._status = false;
        }
        this.ws = null;
    }
    isJson(str) {
        try {
            JSON.parse(str);
        }
        catch (e) {
            return false;
        }
        return true;
    }
    handleOpen(e) {
        this._status = true;
        this.events.emit("open", e);
    }
    handleClose(e) {
        this._status = false;
        this.events.emit("close", e);
    }
    handleError(e) {
        this.events.emit("error", e);
    }
    handleMessage(e) {
        if (this.isJson(e.data)) {
            const json = JSON.parse(e.data);
            if (json.socket_id) {
                this._socketId = json.socket_id;
                return;
            }
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
    get socketId() {
        return this._socketId;
    }
    get status() {
        if (!this._status)
            this.connect();
        return this._status;
    }
    _send(message) {
        if (!this.ws)
            return;
        this.ws.send(JSON.stringify(message));
    }
    send(message) {
        if (this.status) {
            this._send(message);
        }
        else {
            const event = this.events.addListener('open', () => {
                this._send(message);
                event.remove();
            });
        }
    }
}
exports.default = Core;
