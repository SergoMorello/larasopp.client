"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Subscribe {
    constructor({ events, hasChannel, pushChannel, removeChannel, status, channel, send }) {
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hasChannel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pushChannel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "removeChannel", {
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
        Object.defineProperty(this, "_channel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "send", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.events = events;
        this.hasChannel = hasChannel;
        this.pushChannel = pushChannel;
        this.removeChannel = removeChannel;
        this.status = status;
        this._channel = channel;
        this.send = send;
        this.init();
    }
    get channel() {
        return this._channel;
    }
    init() {
        this.pushChannel(this.channel);
        if (this.status) {
            this.send({
                subscribe: this.channel
            });
        }
        else {
            const event = this.events.addListener('open', () => {
                this.send({
                    subscribe: this.channel
                });
                event.remove();
            });
        }
    }
    bind(event, callback) {
        const Event = this.events.addListener(this.channel + ':' + event, callback);
        return {
            remove: () => {
                Event.remove();
            }
        };
    }
    remove() {
        this.removeChannel(this.channel);
        if (this.hasChannel(this.channel))
            return;
        this.send({
            unsubscribe: this.channel
        });
    }
    addListener(event, callback) {
        return this.events.addListener(event + ':' + this.channel, callback);
    }
}
exports.default = Subscribe;
