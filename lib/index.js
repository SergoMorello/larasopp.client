"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = __importDefault(require("./Core"));
const constants_1 = require("./constants");
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
        this.listenResumeSubscribes();
    }
    listenResumeSubscribes() {
        this.addListener('open', () => {
            Object.keys(this.channels).forEach((channel) => this.send({
                subscribe: channel
            }));
        });
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
        if (!constants_1.SocketEvents.includes(event))
            return;
        return this.events.addListener(event, callback);
    }
}
exports.default = Larasopp;
