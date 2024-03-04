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
exports.TransactionController = void 0;
const moment = require("moment");
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const TransactionSetting_1 = require("../../models/TransactionSetting");
const WalletSettings_1 = require("../../models/WalletSettings");
const HistorySetting_1 = require("../../models/HistorySetting");
const User_1 = require("../../models/User");
const AdminSetting_1 = require("../../models/AdminSetting");
const { ObjectId } = require('mongodb');
class TransactionController {
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
    static getTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { transaction_type, } = req.body;
            let transactions = yield TransactionSetting_1.default.find({ payee: req.user._id, transaction_type: transaction_type });
            if (transactions) {
                return ResponseHelper_1.default.api(res, true, "Transaction Found Successfully", transactions, startTime);
            }
            else {
                return ResponseHelper_1.default.api(res, false, "Some error occurs", {}, startTime);
            }
        });
    }
    static addWithdrawal(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { amount, } = req.body;
            let txnRefId = 'CHETAK' + new Date().getTime();
            let userId = new ObjectId(req.user._id);
            let getUserByuserId = yield User_1.default.findOne({ _id: userId });
            let adminsetting = yield AdminSetting_1.default.findOne();
            if (!getUserByuserId.withdrawal_status) {
                return ResponseHelper_1.default.api(res, false, "Your withdrawal is not active! Please contact to admin", {}, startTime);
            }
            if (!adminsetting.withdrawal) {
                return ResponseHelper_1.default.api(res, false, "Withdrawal is not active! Please contact to admin", {}, startTime);
            }
            let walletBalance = yield WalletSettings_1.default.findOne({ userId: userId });
            if (walletBalance && walletBalance.balance && walletBalance.balance > amount) {
                let actualbalance = Number(walletBalance.balance) - amount;
                let updateWalletbalance = yield WalletSettings_1.default.updateOne({ userId: userId }, { $set: { balance: actualbalance } });
                let add = {
                    payee: req.user._id,
                    receiver: req.user._id,
                    amount: Number(amount),
                    transaction_mode: "User",
                    transaction_type: "Debit",
                    wallet_id: walletBalance._id,
                    transaction_id: txnRefId,
                    status: "Pending"
                };
                try {
                    let transactions = yield TransactionSetting_1.default.create(add);
                    if (transactions) {
                        const historyTime = moment(startTime).format('MMMM Do YYYY, h:mm:ss a');
                        const history = {
                            userId: req.user._id,
                            type: "Debit",
                            status: "Pending",
                            message: `Amount ${amount} has been debited from your account at ${historyTime}`
                        };
                        let createHis = yield HistorySetting_1.default.create(history);
                        return ResponseHelper_1.default.api(res, true, "Withdrawal Request Send Successfully", {}, startTime);
                    }
                    else {
                        return ResponseHelper_1.default.api(res, false, "Some error occurs", {}, startTime);
                    }
                }
                catch (err) {
                    return ResponseHelper_1.default.api(res, false, "Some error occurs", err, startTime);
                }
            }
            else {
                return ResponseHelper_1.default.api(res, false, "Not enough balance", {}, startTime);
            }
        });
    }
}
exports.TransactionController = TransactionController;
