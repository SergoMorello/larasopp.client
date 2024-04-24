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
        this.channel = channel;
        this.context = constext;
    }
    listen(event, callback) {
        if (!this.listeners) {
            this.listeners = [];
        }
        const listener = this.context.events.addListener(this.channel + ':' + event, callback);
        this.listeners.push(listener);
        return listener;
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
}
exports.default = Listener;
