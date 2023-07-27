"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = __importDefault(require("./Core"));
class Larasopp extends Core_1.default {
    constructor(config) {
        var _a;
        super(config);
        (_a = Larasopp.instance) === null || _a === void 0 ? void 0 : _a.setConfig(config);
    }
}
Object.defineProperty(Larasopp, "instance", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Larasopp({
        host: '0.0.0.0'
    })
});
Object.defineProperty(Larasopp, "setConfig", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Larasopp.instance.setConfig
});
Object.defineProperty(Larasopp, "connect", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Larasopp.instance.connect
});
Object.defineProperty(Larasopp, "disconnect", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Larasopp.instance.disconnect
});
Object.defineProperty(Larasopp, "subscribe", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Larasopp.instance.subscribe
});
Object.defineProperty(Larasopp, "trigger", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Larasopp.instance.trigger
});
exports.default = Larasopp;
