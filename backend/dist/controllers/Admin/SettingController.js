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
exports.AdminSettingController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const AdminSetting_1 = require("../../models/AdminSetting");
const express = require("express");
const app = express();
class AdminSettingController {
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const { email, mobile_number, country_code, bet_commission, min_bet, min_withdrawal, referral_bonus, address, facebook, instagram } = req.body;
                const adminSettingFind = yield AdminSetting_1.default.findOne();
                let newObj = {
                    country_code: country_code,
                    mobile_number: mobile_number,
                    email: email,
                    min_bet: min_bet,
                    address: address,
                    facebook: facebook,
                    instagram: instagram,
                    min_withdrawal: min_withdrawal,
                    referral_bonus: referral_bonus,
                    bet_commission: bet_commission
                };
                let adminSetting;
                if (!adminSettingFind || adminSettingFind == null) {
                    adminSetting = yield AdminSetting_1.default.create(newObj);
                }
                else {
                    adminSetting = yield AdminSetting_1.default.updateOne({ _id: adminSettingFind._id }, { $set: newObj });
                }
                return ResponseHelper_1.default.api(res, true, "Setting Updated Successfully", adminSetting, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const setting = yield AdminSetting_1.default.findOne();
                return ResponseHelper_1.default.api(res, true, "Admin Setting Get Successfully", setting, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminSettingController = AdminSettingController;
