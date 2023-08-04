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
    addListener(event, callback) {
        if (!Core_1.SocketEvents.includes(event))
            return;
        return this.events.addListener(event, callback);
    }
}
exports.default = Larasopp;
