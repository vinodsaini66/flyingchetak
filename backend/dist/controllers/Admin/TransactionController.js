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
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const TransactionSetting_1 = require("../../models/TransactionSetting");
const Bet_1 = require("../../models/Bet");
const { ObjectId } = require('mongodb');
class TransactionController {
    static getTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const get = yield TransactionSetting_1.default.aggregate([
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
                        },
                    },
                ]);
                return ResponseHelper_1.default.ok(res, "Success", 'Transaction Found Successfully', get, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static getTransactionByUserId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                let { id } = req.params;
                console.log("idididid==========>>>>>>>", req.params);
                id = ObjectId(id);
                const get = yield TransactionSetting_1.default.find({
                    payee: id,
                    $and: [
                        { $or: [{ transaction_type: "Debit" }, { transaction_type: "Credit" }] },
                    ]
                });
                const betData = yield Bet_1.default.find({ user_id: id });
                return ResponseHelper_1.default.ok(res, "Success", 'Transaction Found Successfully', { get, betData }, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.TransactionController = TransactionController;
