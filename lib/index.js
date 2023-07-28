"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = __importDefault(require("./Core"));
class Larasopp extends Core_1.default {
    constructor(config) {
        super(config);
        this.subscribe = this.subscribe.bind(this);
        this.trigger = this.trigger.bind(this);
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
}
exports.default = Larasopp;
