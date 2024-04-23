"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = __importStar(require("./Core"));
const Listener_1 = __importDefault(require("./Listener"));
class Larasopp extends Core_1.default {
    constructor(config) {
        super(config);
        Object.defineProperty(this, "channels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.channels = {};
    }
    subscribe(channel) {
        const listener = new Listener_1.default(channel, this);
        this.pushListener(channel, listener);
        return listener;
    }
    unsubscribe(channel) {
        if (!this.channels[channel])
            return;
        this.channels[channel].forEach((listener) => listener.remove());
        delete this.channels[channel];
        this.send({
            unsubscribe: channel
        });
    }
    trigger(channel, event, message, permission = 'public', waitSubscribe = false) {
        const send = () => {
            this.send({
                channel: channel,
                event: event,
                message: message,
                type: permission
            });
        };
        if (waitSubscribe)
            this.events.addListener(event + ':' + channel, send);
        send();
    }
    pushListener(channel, listener) {
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.send({
            subscribe: channel
        });
        this.channels[channel].push(listener);
    }
    addListener(event, callback) {
        if (!Core_1.SocketEvents.includes(event))
            return;
        return this.events.addListener(event, callback);
    }
}
exports.default = Larasopp;
