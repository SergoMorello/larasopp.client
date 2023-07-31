"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = __importDefault(require("./Core"));
const Subscribe_1 = __importDefault(require("./Subscribe"));
class Larasopp extends Core_1.default {
    constructor(config) {
        super(config);
        this.subscribe = this.subscribe.bind(this);
        this.trigger = this.trigger.bind(this);
    }
    subscribe(channel) {
        return new Subscribe_1.default({
            events: this.events,
            status: this.status,
            send: this.send,
            channel
        });
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
