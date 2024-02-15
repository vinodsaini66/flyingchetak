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
const ResponseHelper_1 = require("../helpers/ResponseHelper");
const Auth_1 = require("../Utils/Auth");
const User_1 = require("../models/User");
const locale_1 = require("../locale");
const user_type_enum_1 = require("../constants/user-type.enum");
class Authentication {
    constructor() { }
    static userLanguage(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const language = (_a = req.user.language) !== null && _a !== void 0 ? _a : 'en';
            const lang = (0, locale_1.getLanguageStrings)(language);
            req.lang = lang;
            next();
        });
    }
    static user(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                let token;
                if (req.headers.authorization &&
                    req.headers.authorization.startsWith('Bearer')) {
                    token = req.headers.authorization.split(' ')[1];
                }
                if (!token) {
                    return ResponseHelper_1.default.api(res, false, 'Un-Authorized User', {}, startTime);
                }
                const decoded = yield Auth_1.default.decodeJwt(token);
                const currentUser = yield User_1.default.findOne({
                    _id: decoded._id,
                    type: user_type_enum_1.USER_TYPE.customer,
                });
                if (!currentUser) {
                    return ResponseHelper_1.default.api(res, false, "User doesn't exists with us", currentUser, startTime);
                }
                if (!currentUser.is_active) {
                    return ResponseHelper_1.default.api(res, false, 'Account deactivated, Please contact to admin', {}, startTime);
                }
                if (currentUser.is_delete) {
                    return ResponseHelper_1.default.api(res, false, 'This Account has been deleted', {}, startTime);
                }
                req.user = currentUser;
                req.user.id = decoded.id;
                req.user.type = decoded.type;
                next();
            }
            catch (err) {
                return next(err);
            }
        });
    }
    static admin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                let token;
                if (req.headers.authorization &&
                    req.headers.authorization.startsWith('Bearer')) {
                    token = req.headers.authorization.split(' ')[1];
                }
                if (!token) {
                    return ResponseHelper_1.default.unAuthenticated(res, 'UNAUTHORIZED', 'Un-Authorized', {}, startTime, 0);
                }
                const decoded = yield Auth_1.default.decodeJwt(token);
                const currentUser = yield User_1.default.findById(decoded.id).find({
                    type: { $in: ['Admin', 'ServiceProvider'] },
                });
                if (!currentUser) {
                    return ResponseHelper_1.default.notFound(res, 'NOTFOUND', "Admin doesn't exists with us", currentUser, startTime);
                }
                req.user = currentUser;
                req.user.id = decoded.id;
                req.user.type = decoded.type;
                next();
            }
            catch (err) {
                return next(err);
            }
        });
    }
}
exports.default = Authentication;
