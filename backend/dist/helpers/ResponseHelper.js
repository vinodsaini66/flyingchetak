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
class ResponseHelper {
    ok(res, statusText, message, data, startTime) {
        return __awaiter(this, void 0, void 0, function* () {
            let exeTime = yield this.execTime(startTime);
            data = Array.isArray(data) ? { data } : data;
            res
                .status(200)
                .json({
                status: 200,
                statusText: statusText ? statusText : 'SUCCESS',
                message: message,
                data: data,
                exeTime,
            });
        });
    }
    api(res, status, message, data, startTime) {
        return __awaiter(this, void 0, void 0, function* () {
            let exeTime = yield this.execTime(startTime);
            data = Array.isArray(data) ? data : data;
            res.status(200).json({
                status: status,
                message: message,
                data: data,
                exeTime,
            });
        });
    }
    badRequest(res, statusText, message, data = {}, startTime) {
        return __awaiter(this, void 0, void 0, function* () {
            let exeTime = yield this.execTime(startTime);
            res.status(400).json({
                status: 400,
                statusText: statusText ? statusText : 'BAD_REQUEST',
                message: message,
                data: data,
                exeTime,
            });
        });
    }
    notAcceptable(res, statusText, message, data = {}, startTime) {
        return __awaiter(this, void 0, void 0, function* () {
            let exeTime = yield this.execTime(startTime);
            res.status(406).json({
                status: 406,
                statusText: statusText ? statusText : 'NOT_ACCEPTABLE',
                message: message,
                data: data,
                exeTime,
            });
        });
    }
    conflict(res, statusText, message, data = {}, startTime) {
        return __awaiter(this, void 0, void 0, function* () {
            let exeTime = yield this.execTime(startTime);
            res.status(409).json({
                status: 409,
                statusText: statusText ? statusText : 'CONFLICT',
                message: message,
                data: data,
                exeTime,
            });
        });
    }
    noContent(res, statusText, message, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({
                status: 205,
                statusText: statusText ? statusText : '',
                message: message ? message : 'Un-authenticated Request!',
                data: data,
            });
        });
    }
    unAuthenticated(res, statusText, message = null, data = {}, startTime, wrongAttempt) {
        return __awaiter(this, void 0, void 0, function* () {
            let exeTime = yield this.execTime(startTime);
            res.status(401).json({
                status: 401,
                statusText: statusText ? statusText : 'UNAUTHORIZE',
                message: message ? message : 'Un-authenticated Request!',
                data: data,
                exeTime,
                wrongAttempt,
            });
        });
    }
    notFound(res, statusText, message = null, data = {}, startTime) {
        return __awaiter(this, void 0, void 0, function* () {
            let exeTime = yield this.execTime(startTime);
            res.status(404).json({
                status: 404,
                statusText: statusText ? statusText : 'NOTFOUND',
                message: message ? message : 'Not Found',
                data: data,
                exeTime,
            });
        });
    }
    unAuthorize(res, statusText, message = null, data = {}, startTime) {
        return __awaiter(this, void 0, void 0, function* () {
            let exeTime = yield this.execTime(startTime);
            res.status(403).json({
                status: 403,
                statusText: statusText ? statusText : 'UNAUTHORIZE',
                message: message ? message : 'Un-authenticated Request!',
                data: data,
                exeTime,
            });
        });
    }
    serverError(res, message = null, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let exeTime = yield this.execTime(res);
            res.status(500).json({
                status: 500,
                message: message ? message : 'Internal Server Error!',
                data: data,
                exeTime,
            });
        });
    }
    created(res, statusText, message = null, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(201).json({
                status: 201,
                statusText: statusText ? statusText : 'CREATED',
                message: message ? message : 'created!',
                data: data,
            });
        });
    }
    acceptanceRequired(res, statusText, message = null, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(406).json({
                status: 406,
                statusText: statusText ? statusText : 'FAILED',
                message: message ? message : 'created!',
                data: data,
            });
        });
    }
    execTime(res) {
        return __awaiter(this, void 0, void 0, function* () {
            // return new Date().getTime() - res.startTime;
            return new Date().getTime() - res;
        });
    }
    tracking(tempt) {
        return __awaiter(this, void 0, void 0, function* () {
            return +tempt;
        });
    }
}
exports.default = new ResponseHelper();
