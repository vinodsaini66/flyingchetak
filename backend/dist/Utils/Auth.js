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
const Bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const Env_1 = require("../environments/Env");
class Auth {
    constructor() {
        this.MAX_TOKEN_TIME = 600000;
    }
    generateOtp(size = 4) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTime = new Date().getTime();
            const next10min = currentTime + 10 * 60 * 1000;
            const otpExpiresTime = new Date(next10min);
            let otp = '';
            let val;
            val = Math.floor(1000 + Math.random() * 9000);
            val = String(val);
            otp = val.substring(0, 4);
            const otpData = {
                otp: 1234,
                // otp: parseInt(otp),
                otpExpiresTime: otpExpiresTime,
            };
            return otpData;
        });
    }
    decodeJwt(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                Jwt.verify(token, (0, Env_1.env)().jwtSecret, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        return resolve(data);
                    }
                });
            });
        });
    }
    getToken(data, expiresIn, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return Jwt.sign(data, (0, Env_1.env)().jwtSecret, {
                    expiresIn,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    }
    comparePassword(candidatePassword, userPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                Bcrypt.compare(candidatePassword, userPassword, (err, isSame) => {
                    if (err) {
                        reject(err);
                    }
                    else if (!isSame) {
                        resolve(false);
                    }
                    else {
                        resolve(true);
                    }
                });
            });
        });
    }
    encryptPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                Bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(hash);
                    }
                });
            });
        });
    }
}
let respObj = new Auth();
exports.default = respObj;
