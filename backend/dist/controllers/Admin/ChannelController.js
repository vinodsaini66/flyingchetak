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
exports.ChannelController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const Channel_1 = require("../../models/Channel");
const Utr_1 = require("../../models/Utr");
const axios_1 = require("axios");
const { ObjectId } = require('mongodb');
class ChannelController {
    static getChannels(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const get = yield Channel_1.default.find().sort({ created_at: -1 });
                return ResponseHelper_1.default.ok(res, "Success", 'Channels Found Successfully', get, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static getUtr(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const get = yield Utr_1.default.find();
                return ResponseHelper_1.default.ok(res, "Success", 'Utr Info Found Successfully', get, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static AddChannel(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                let { name, key, _id, url } = req.body;
                let get;
                if (_id) {
                    get = yield Channel_1.default.updateOne({ _id: _id }, { $set: req.body });
                }
                else {
                    get = yield Channel_1.default.create(req.body);
                }
                let message = !_id ? "Channel Added Successfully" : "Channel Updateds Successfully";
                return ResponseHelper_1.default.ok(res, "Success", message, get, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static AddEditUtr(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                let { name, key, _id, url } = req.body;
                let get;
                if (_id) {
                    get = yield Utr_1.default.updateOne({ _id: _id }, { $set: req.body });
                }
                else {
                    get = yield Utr_1.default.create(req.body);
                }
                let message = !_id ? "Utr Info Added Successfully" : "Utr Info Updateds Successfully";
                return ResponseHelper_1.default.ok(res, "Success", message, get, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static CheckStatusViaUtr(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            let { client_txn_id, txn_date } = req.body;
            let getUtr = yield Utr_1.default.findOne();
            if (getUtr === null || getUtr === void 0 ? void 0 : getUtr.key) {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                let data = JSON.stringify({
                    "key": getUtr === null || getUtr === void 0 ? void 0 : getUtr.key,
                    "client_txn_id": client_txn_id,
                    "txn_date": txn_date
                });
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: getUtr.url,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                axios_1.default.request(config)
                    .then((result) => {
                    console.log("userId========>>>>>>", result);
                    if (result.status) {
                        return ResponseHelper_1.default.api(res, result.data.status, result.data.msg, result.data, startTime);
                    }
                    else {
                        return ResponseHelper_1.default.api(res, false, "Error occurred during Balance Add Request", {}, startTime);
                    }
                })
                    .catch((error) => {
                    console.log(error);
                    return ResponseHelper_1.default.api(res, false, "Error occurred during Balance Add Request", error, startTime);
                });
            }
            else {
                return ResponseHelper_1.default.api(res, false, "Please add utr details first", {}, startTime);
            }
        });
    }
    static DeleteChannel(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                let { _id } = req.body;
                let remove = yield Channel_1.default.deleteOne({ _id: _id });
                let message = "Channel Removed Successfully";
                return ResponseHelper_1.default.ok(res, "Success", message, remove, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.ChannelController = ChannelController;
