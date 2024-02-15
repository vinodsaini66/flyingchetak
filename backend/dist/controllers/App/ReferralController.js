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
exports.ReferralController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const TransactionSetting_1 = require("../../models/TransactionSetting");
const WalletSettings_1 = require("../../models/WalletSettings");
const User_1 = require("../../models/User");
const { ObjectId } = require('mongodb');
class ReferralController {
    /**
     * @api {post} /api/app/auth/login Login
     * @apiVersion 1.0.0
     * @apiName Login
     * @apiGroup Auth
     * @apiParam {String} country_code Country Code.
     * @apiParam {String} mobile_number Mobile Number.
     * @apiParam {String} password Password .
     * @apiParam {String} type User Type ("Customer, ServiceProvider").
     * @apiParam {String} device_token Device Token.
     * @apiParam {String} device_type Device Type.
     * @apiParam {String} latitude Latitude.
     * @apiParam {String} longitude Longitude.
     */
    static getPromotionsData(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { transaction_type, } = req.body;
            try {
                let _id = req.user._id;
                let depositeNumberArray = [];
                let find_user = yield User_1.default.findOne({ _id: _id });
                let usersData = yield User_1.default.find({ referral_from_id: find_user.referral_id });
                let noOfUser = yield User_1.default.countDocuments({ referral_from_id: find_user.referral_id });
                let useDepositnumberArray = [];
                let matchArray = usersData.map((val, i) => {
                    useDepositnumberArray.push({ userId: ObjectId(val._id) });
                    return ObjectId(val._id);
                });
                console.log("totalBalance");
                let depositeAmount = yield WalletSettings_1.default.aggregate([
                    { $match: { userId: { $in: matchArray } } },
                    {
                        $group: {
                            _id: null,
                            totalBalance: { $sum: "$balance" }
                        }
                    }
                ]);
                let depositeUserNumber = yield TransactionSetting_1.default.aggregate([
                    { $match: { payee: { $in: matchArray } } },
                    { $match: { transaction_type: "Credit" } },
                    {
                        $group: {
                            _id: "$payee",
                            entries: { $push: "$$ROOT" },
                        },
                    },
                    {
                        $project: {
                            selectedEntries: { $slice: ["$entries", 1] },
                        },
                    },
                    {
                        $unwind: "$selectedEntries",
                    },
                    {
                        $replaceRoot: { newRoot: "$selectedEntries" },
                    },
                ]);
                let firstDepositeUser = yield TransactionSetting_1.default.aggregate([
                    {
                        $match: { payee: { $in: matchArray } },
                    },
                    {
                        $group: {
                            _id: "$payee",
                            entryCount: { $sum: 1 }
                        }
                    },
                    {
                        $match: {
                            entryCount: 1
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            usersWithOneEntry: { $sum: 1 }
                        }
                    }
                ]);
                console.log("totalBalance", depositeAmount);
                let finalArray = [];
                finalArray.push({ no_of_register: noOfUser || 0 });
                finalArray.push({ deposite_number: (depositeUserNumber === null || depositeUserNumber === void 0 ? void 0 : depositeUserNumber.length) || 0 });
                finalArray.push({ deposite_amount: ((_a = depositeAmount[0]) === null || _a === void 0 ? void 0 : _a.totalBalance) || 0 });
                finalArray.push({ user_no_with_first_deposite: ((_b = firstDepositeUser[0]) === null || _b === void 0 ? void 0 : _b.usersWithOneEntry) || 0 });
                return ResponseHelper_1.default.api(res, true, "Promotion Data Found Successfully", finalArray, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.ReferralController = ReferralController;
