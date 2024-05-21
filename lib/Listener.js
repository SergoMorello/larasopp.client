"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const easy_event_emitter_1 = __importDefault(require("easy-event-emitter"));
class Listener extends easy_event_emitter_1.default.Stack {
    constructor(channel, constext) {
        super([]);
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "channel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "listener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cacheEvents", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.channel = channel;
        this.context = constext;
        this.cacheEvents = {};
        this.here(() => { }, true);
    }
    listen(event, callback, withCache = false) {
        if (withCache && this.hasCache(event))
            callback(this.getCache(event));
        const listener = this.context.events.addListener(this.channel + ':' + event, (data) => {
            callback(data);
            if (withCache)
                this.pushCache(event, data);
        });
        this.push(listener);
        return this;
    }
    here(callback, withCache = true) {
        return this.listen('__HERE', callback, withCache);
    }
    joining(callback, withCache = false) {
        return this.listen('__JOIN', callback, withCache);
    }
    leaving(callback, withCache = false) {
        return this.listen('__LEAVE', callback, withCache);
    }
    unsubscribe() {
        this.context.unsubscribe(this.channel);
        this.remove();
    }
    hasCache(event) {
        return event in this.cacheEvents;
    }
    getCache(event) {
        return this.cacheEvents[event];
    }
    pushCache(event, data) {
        this.cacheEvents[event] = data;
    }
}
exports.default = Listener;
