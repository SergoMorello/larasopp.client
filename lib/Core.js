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
        this.config = config;
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
    }
    setConfig(config) {
        this.config = config;
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
    connect(token) {
        try {
            const host = [this.config.host];
            if (this.config.token)
                host.push('/token=' + (token !== null && token !== void 0 ? token : this.config.token));
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
        }
        this.ws = undefined;
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
        this.events.emit("open", e);
    }
    handleClose(e) {
        this.events.emit("close", e);
    }
    handleError(e) {
        this.events.emit("error", e);
    }
    jsonParse(str) {
        if (this.config) {
            if (typeof this.config.reviver === 'function') {
                return JSON.parse(str, this.config.reviver);
            }
            if (this.config.dataReviver) {
                const replace = this.config.dataReviver;
                return JSON.parse(str, (key, value) => {
                    if (key === "createdAt" || key === "updatedAt") {
                        return new Date(value);
                    }
                    if (key in replace && typeof replace[key] === 'function') {
                        return replace[key](value);
                    }
                    return value;
                });
            }
        }
        return JSON.parse(str);
    }
    handleMessage(e) {
        if (this.isJson(e.data)) {
            const json = this.jsonParse(e.data);
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
        var _a, _b;
        if (!this.ws)
            return false;
        return ((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) === ((_b = this.ws) === null || _b === void 0 ? void 0 : _b.OPEN);
    }
    _send(message) {
        if (!this.ws || !this.status)
            return;
        this.ws.send(JSON.stringify(message));
    }
    send(message) {
        var _a, _b;
        if (this.status) {
            this._send(message);
        }
        else {
            if (((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) !== ((_b = this.ws) === null || _b === void 0 ? void 0 : _b.CONNECTING))
                this.connect();
            const event = this.events.addListener('open', () => {
                this._send(message);
                event.remove();
            });
        }
    }
}
exports.default = Core;
