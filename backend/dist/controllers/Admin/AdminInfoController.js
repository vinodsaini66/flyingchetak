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
exports.AdminInfController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const AdminInfo_1 = require("../../models/AdminInfo");
class AdminInfController {
    static getDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const get = yield AdminInfo_1.default.findOne();
                return ResponseHelper_1.default.ok(res, "Success", 'Admin details has been get Successfully', get, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static updateDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { email, mobile_number, address, facebook, instagram } = req.body;
            try {
                const adminInfo = yield AdminInfo_1.default.findOne();
                adminInfo.mobile_number = !!mobile_number
                    ? mobile_number
                    : adminInfo.mobile_number;
                adminInfo.email = !!email ? email : adminInfo.email;
                adminInfo.address = !!address ? address : adminInfo.address;
                adminInfo.instagram = !!instagram ? instagram : adminInfo.instagram;
                adminInfo.facebook = !!facebook ? facebook : adminInfo.facebook;
                yield adminInfo.save();
                return ResponseHelper_1.default.api(res, true, "Admin Details Updated Successfully", {}, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminInfController = AdminInfController;
