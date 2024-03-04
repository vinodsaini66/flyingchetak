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
exports.WithdrawalController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const AdminSetting_1 = require("../../models/AdminSetting");
const TransactionSetting_1 = require("../../models/TransactionSetting");
const User_1 = require("../../models/User");
const WalletSettings_1 = require("../../models/WalletSettings");
const express = require("express");
const app = express();
class WithdrawalController {
    static get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { page, limit, status, search, start_date, end_date } = req.query;
            try {
                const startTime = new Date().getTime();
                let date = {
                    $gte: new Date(start_date),
                    $lte: new Date(end_date)
                };
                const matchStage = {
                    status: status,
                    transaction_type: 'Debit',
                };
                if (start_date && end_date) {
                    matchStage.created_at = date;
                }
                const orConditions = [];
                // Add conditions for fields with search terms
                if (search) {
                    orConditions.push({ "customerInfo.email": { $regex: search, $options: 'i' } }, { "customerInfo.name": { $regex: search, $options: 'i' } }, { "customerInfo.mobile_number": { $regex: search, $options: 'i' } }
                    // Add more fields as needed
                    );
                }
                // Combine match conditions with $or conditions
                if (orConditions.length > 0) {
                    matchStage.$or = orConditions;
                }
                const withdrawal = yield TransactionSetting_1.default.aggregate([
                    {
                        $lookup: {
                            from: "users",
                            localField: "payee",
                            foreignField: "_id",
                            as: "customerInfo",
                        },
                    },
                    {
                        $unwind: "$customerInfo",
                    },
                    {
                        $match: matchStage,
                    },
                    {
                        $project: {
                            _id: 1,
                            amount: 1,
                            transaction_type: 1,
                            transaction_id: 1,
                            status: 1,
                            created_at: 1,
                            user_id: "$customerInfo._id",
                            name: "$customerInfo.name",
                            email: "$customerInfo.email",
                            mobile_number: "$customerInfo.mobile_number",
                            account_number: "$customerInfo.bank_info.account_number",
                            ifsc_code: "$customerInfo.bankInfo.ifsc_code",
                            account_holder: "$customerInfo.bankInfo.account_holder"
                            // Add more fields as needed
                        },
                    },
                    // {
                    //   $limit: Number(limit),
                    // },
                ]).sort({ created_at: -1 });
                return ResponseHelper_1.default.api(res, true, "Withdrawal Found Successfully", withdrawal, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static _changeStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { _id, amount, status, type } = req.body;
            try {
                console.log("amountamountamount", type, status, _id);
                const startTime = new Date().getTime();
                let statusChange = yield TransactionSetting_1.default.updateOne({ _id: _id }, { $set: { status: status } });
                if ((type == "Credit" && status == "Success") || (type == "Debit" && status == "Reject")) {
                    let getTra = yield TransactionSetting_1.default.findOne({ _id: _id });
                    let reSendMoney = yield WalletSettings_1.default.updateOne({ userId: getTra.payee }, { $inc: { balance: getTra.amount } });
                    let userWithRefer = yield User_1.default.findOne({ _id: getTra.payee });
                    if (userWithRefer.referral_from_id && type == "Credit") {
                        let getAll = yield TransactionSetting_1.default.find({ payee: getTra.payee, status: "Success" });
                        console.log("userWithRefer++++++.>>>>>>>>>", getAll.length);
                        if (getAll.length == 1) {
                            let txnRefId = 'CHETAK' + new Date().getTime();
                            let getAdminSetting = yield AdminSetting_1.default.findOne();
                            let getFromUser = yield User_1.default.findOne({ referral_id: userWithRefer.referral_from_id });
                            let walletUpdate = yield WalletSettings_1.default.updateOne({ userId: getFromUser._id }, { $inc: { balance: Number(getAdminSetting.referral_bonus) } });
                            let add = {
                                payee: getFromUser._id,
                                receiver: getFromUser._id,
                                amount: Number(getAdminSetting.referral_bonus),
                                transaction_mode: "Referral",
                                transaction_type: "Credit",
                                // wallet_id:previousBalance._id,
                                transaction_id: txnRefId,
                                status: "Success"
                            };
                            let createTra = yield TransactionSetting_1.default.create(add);
                            console.log("userWithRefer++++++.>>>>>>>>>", getFromUser, getAdminSetting);
                        }
                    }
                }
                if (statusChange) {
                    return ResponseHelper_1.default.api(res, true, "Withdrawal Status Updated Successfully", {}, startTime);
                }
                else {
                    return ResponseHelper_1.default.api(res, true, "Some Error Occurs", {}, startTime);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.WithdrawalController = WithdrawalController;
