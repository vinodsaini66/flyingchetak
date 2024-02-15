"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderBookingHash = void 0;
const Helper_1 = require("./Helper");
function getOrderBookingHash() {
    return __awaiter(this, void 0, void 0, function* () {
        var month = ("0" + (new Date().getMonth() + 1)).slice(-2);
        const unique = new Date().valueOf();
        let generateCode = yield Helper_1.default.generatePassword(4, {
            digits: true,
            lowercase: false,
            uppercase: false,
        });
        let randomId = generateCode + String(unique).substring(10, 12) + month;
        return randomId;
    });
}
exports.getOrderBookingHash = getOrderBookingHash;
