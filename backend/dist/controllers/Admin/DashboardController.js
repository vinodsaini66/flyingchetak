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
exports.DashboardController = void 0;
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const User_1 = require("../../models/User");
const user_type_enum_1 = require("../../constants/user-type.enum");
const TransactionSetting_1 = require("../../models/TransactionSetting");
class DashboardController {
    static dashboardData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const [customerCount] = yield Promise.all([
                    User_1.default.countDocuments({ type: user_type_enum_1.USER_TYPE.customer }),
                    // User.countDocuments({ type: USER_TYPE.serviceProvider }),
                ]);
                // const earnings = await Wallet.findOne({ user_id: Helper.admin._id });
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
                            // Add more fields as needed
                        },
                    },
                ]).sort({ created_at: -1 }).limit(10);
                let data = {
                    customerCount: customerCount,
                    tentransaction: get
                    // earnings: !!earnings ? earnings : null,
                };
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'Dashboard data has been get Successfully', data, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static dashboardBoxData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                let getTransaction = yield TransactionSetting_1.default.aggregate([
                    {
                        $match: {
                            transaction_type: { $in: ["Debit", "Credit"] } // Filter only debit and credit transactions
                        }
                    },
                    {
                        $group: {
                            _id: "$transaction_type",
                            totalAmount: { $sum: "$amount" }
                        }
                    }
                ]);
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'Dashboard data has been get Successfully', getTransaction, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.DashboardController = DashboardController;
