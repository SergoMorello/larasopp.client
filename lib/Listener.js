"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Listener {
    constructor(channel, constext) {
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
        Object.defineProperty(this, "listeners", {
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
        if (!this.listeners) {
            this.listeners = [];
        }
        if (withCache && this.hasCache(event))
            callback(this.getCache(event));
        const listener = this.context.events.addListener(this.channel + ':' + event, (data) => {
            const result = callback(data);
            if (withCache)
                this.pushCache(event, result);
        });
        this.listeners.push(listener);
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
    remove() {
        if (!this.listeners)
            return;
        this.listeners.forEach((listener) => listener.remove());
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
    emit(data) { }
}
exports.default = Listener;
