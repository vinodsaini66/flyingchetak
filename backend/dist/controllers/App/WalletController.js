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
exports.WalletController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const WalletSettings_1 = require("../../models/WalletSettings");
const TransactionSetting_1 = require("../../models/TransactionSetting");
const axios_1 = require("axios");
const moment = require("moment");
const HistorySetting_1 = require("../../models/HistorySetting");
const WinningWallet_1 = require("../../models/WinningWallet");
const Channel_1 = require("../../models/Channel");
const { ObjectId } = require('mongodb');
const Env_1 = require("../../environments/Env");
class WalletController {
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
    static addBalanceViaThirdParty(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            let { id, amount, txn } = req.query;
            let userId = new ObjectId(id);
            let previousBalance = yield WalletSettings_1.default.findOne({ userId: userId });
            let newBalance = (previousBalance === null || previousBalance === void 0 ? void 0 : previousBalance.balance) && Number(previousBalance.balance) + Number(amount);
            console.log("thirdartyapi", previousBalance, newBalance, amount);
            try {
                let updateWallet = yield WalletSettings_1.default.updateOne({ userId: userId }, { $set: { balance: newBalance } });
                let add = {
                    payee: id,
                    receiver: id,
                    amount: Number(amount),
                    transaction_mode: "User",
                    transaction_type: "Credit",
                    wallet_id: previousBalance._id,
                    transaction_id: txn,
                    status: "Pending"
                };
                if (updateWallet.nModified > 0) {
                    const historyTime = moment(startTime).format('MMMM Do YYYY, h:mm:ss a');
                    let historypayload = {
                        userId: id,
                        type: "Credit",
                        status: "Success",
                        message: `Your account has been Credited to ${amount} at ${historyTime}`
                    };
                    let createhistory = yield HistorySetting_1.default.create(historypayload);
                    let addTransaction = yield TransactionSetting_1.default.create(add);
                    return ResponseHelper_1.default.api(res, true, "Balance Update Successfully", {}, startTime);
                }
                else {
                    return ResponseHelper_1.default.api(res, false, "Some error occurs", {}, startTime);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    static requestBalanceViaThirdParty(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            let { balance, _id } = req.body;
            let getChannel = yield Channel_1.default.findOne({ _id: _id });
            if (getChannel === null || getChannel === void 0 ? void 0 : getChannel.key) {
                let txnRefId = 'CHETAK' + new Date().getTime();
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                console.log("redirect_url", `${(0, Env_1.env)().redirection_url}?id=${req.user._id}&amount=${balance}&txn=${txnRefId}`);
                let data = JSON.stringify({
                    "key": getChannel === null || getChannel === void 0 ? void 0 : getChannel.key,
                    "client_txn_id": txnRefId,
                    "amount": balance,
                    "p_info": "Recharge",
                    "customer_name": "Anil",
                    "customer_email": "test@gmail.com",
                    "customer_mobile": "9983732323",
                    "redirect_url": `${(0, Env_1.env)().redirection_url}?id=${req.user._id}&amount=${balance}&txn=${txnRefId}`,
                    "udf1": "user defined field 1",
                    "udf2": "user defined field 2",
                    "udf3": "user defined field 3"
                });
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://api.ekqr.in/api/create_order',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                axios_1.default.request(config)
                    .then((response) => {
                    let result = response.data;
                    console.log("userId========>>>>>>", response);
                    if (result.status) {
                        return ResponseHelper_1.default.api(res, true, "Balance Add Request Triggered Successfully", response.data, startTime);
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
                return ResponseHelper_1.default.api(res, false, "Channel Id is invalid", {}, startTime);
            }
        });
    }
    static getBalance(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            let { _id } = req.user;
            let userId = new ObjectId(_id);
            let find = yield WalletSettings_1.default.findOne({ userId: userId });
            if (find) {
                return ResponseHelper_1.default.api(res, true, "Balance Found Successfully", find, startTime);
            }
            else {
                return ResponseHelper_1.default.api(res, false, "Some error occurs", {}, startTime);
            }
        });
    }
    static getWinningWalletBalance(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            let { _id } = req.user;
            let userId = new ObjectId(_id);
            try {
                let find = yield WinningWallet_1.default.findOne({ userId: userId });
                if (find) {
                    return ResponseHelper_1.default.api(res, true, "Winning Found Successfully", find, startTime);
                }
                else {
                    return ResponseHelper_1.default.api(res, false, "Some error occurs", {}, startTime);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.WalletController = WalletController;
