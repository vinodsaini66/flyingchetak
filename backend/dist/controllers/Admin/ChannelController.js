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
const { ObjectId } = require('mongodb');
class ChannelController {
    static getChannels(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const get = yield Channel_1.default.find();
                return ResponseHelper_1.default.ok(res, "Success", 'Channels Found Successfully', get, startTime);
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
                let { name, key, _id } = req.body;
                let get;
                console.log("sdfbsdjhfbsdjhbds", req.body);
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
