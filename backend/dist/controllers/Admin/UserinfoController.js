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
exports.UserInfoController = void 0;
const express = require('express');
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const User_1 = require("../../models/User");
const { ObjectId } = require('mongodb');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
class UserInfoController {
    static list(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            let { page, limit, status, search, start_date, end_date } = req.query;
            try {
                const startTime = new Date().getTime();
                let date = {
                    $gte: new Date(start_date),
                    $lte: new Date(end_date)
                };
                const matchStage = {
                    type: "Customer"
                };
                if (start_date && end_date) {
                    matchStage.created_at = date;
                }
                const orConditions = [];
                // Add conditions for fields with search terms
                if (search) {
                    orConditions.push({ "email": { $regex: search, $options: 'i' } }, { "name": { $regex: search, $options: 'i' } }, { "mobile_number": { $regex: search, $options: 'i' } }
                    // Add more fields as needed
                    );
                }
                // Combine match conditions with $or conditions
                if (orConditions.length > 0) {
                    matchStage.$or = orConditions;
                }
                console.log("matchstage", matchStage, req.query);
                const user = yield User_1.default.aggregate([
                    {
                        $match: matchStage,
                    },
                    {
                        $addFields: {
                            account_number: '$bank_info.account_number',
                            ifsc_code: '$bank_info.ifsc_code',
                            account_holder: '$bank_info.account_holder',
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            amount: 1,
                            transaction_type: 1,
                            transaction_id: 1,
                            is_active: 1,
                            country_code: 1,
                            withdrawal_status: 1,
                            created_at: 1,
                            user_id: 1,
                            name: 1,
                            email: 1,
                            mobile_number: 1,
                            account_number: 1,
                            ifsc_code: 1,
                            account_holder: 1,
                        },
                    }
                ]);
                return ResponseHelper_1.default.api(res, true, "Users Found Successfully", user, startTime);
            }
            catch (error) {
                next(error);
            }
            // try {
            // 	let isUsersExist = await User.find({ type: 'Customer' });
            // 	if (!isUsersExist) {
            // 		return _RS.notFound(res, 'NOTFOUND', '', isUsersExist, startTime);
            // 	}
            // 	return _RS.ok(
            // 		res,
            // 		'SUCCESS',
            // 		'User list found successfully',
            // 		{ users: isUsersExist },
            // 		startTime
            // 	);
            // } catch (err) {
            // 	next(err);
            // }
        });
    }
    static totalUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                let isUsersExist = yield User_1.default.count({ type: 'Customer' });
                if (isUsersExist == 0) {
                    return ResponseHelper_1.default.notFound(res, 'NOTFOUND', '', isUsersExist, startTime);
                }
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'Total No of Users found successfully', { users: isUsersExist }, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static addEdit(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            let { country_code, email, mobile_number, name, type, id } = req.body;
            let ids = ObjectId(id);
            console.log("userId", req.body);
            let object = {
                name: name,
                email: email,
                mobile_number: mobile_number,
                country_code: country_code,
                type: type
            };
            try {
                let addUser;
                if (!id) {
                    addUser = yield User_1.default.create(object);
                }
                else {
                    addUser = yield User_1.default.updateOne({ _id: ids }, { $set: object });
                }
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'User Details Set successfully', {}, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static withdrawalStatusChange(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const getCustomer = yield User_1.default.findOne({ _id: req.params.id });
                if (!getCustomer) {
                    return ResponseHelper_1.default.notFound(res, 'NOTFOUND', 'Customer not found', getCustomer, startTime);
                }
                (getCustomer.withdrawal_status = !getCustomer.withdrawal_status), getCustomer.save();
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'Withdrawal Status Changed Successfully', getCustomer, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static viewUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            let id = ObjectId(req.params.id);
            try {
                let user = yield User_1.default.aggregate([
                    { $match: { _id: id } },
                    {
                        $lookup: {
                            from: 'wallets',
                            localField: '_id',
                            foreignField: 'userId',
                            as: 'wallet'
                        }
                    },
                    {
                        $unwind: '$wallet'
                    },
                    //   {
                    // 	$lookup: {
                    // 	  from: 'transactions',
                    // 	  localField: 'wallet._id',
                    // 	  foreignField: 'wallet_id',
                    // 	  as: 'transactions'
                    // 	}
                    //   },
                    //   {
                    // 	$unwind: '$transactions'
                    //   },
                    {
                        $project: {
                            _id: 0,
                            name: "$name",
                            email: "$email",
                            mobile_number: "$mobile_number",
                            created_at: "$created_at",
                            account_holder: "$bank_info.account_holder",
                            ifsc_code: "$bank_info.ifsc_code",
                            account_number: "$bank_info.account_number",
                            is_active: "$is_active",
                            balance: "$wallet.balance"
                        }
                    },
                    //   {
                    // 	$group: {
                    // 	  _id: "$_id",
                    // 	  totalDeposits: {
                    // 		$sum: { $cond: [{ $eq: ["$transactions.transaction_type", "Debit"] }, "$transactions.amount", 0] }
                    // 	  },
                    // 	  totalWithdrawals: {
                    // 		$sum: { $cond: [{ $eq: ["$transactions.transaction_type", "Credit"] }, "$transactions.amount", 0] }
                    // 	  }
                    // 	},
                    // 	entries: { $push: "$$ROOT" }
                    //   },
                ]);
                // let isUsersExist = await User.findOne({_id:id});
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'User found successfully', user, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.UserInfoController = UserInfoController;
