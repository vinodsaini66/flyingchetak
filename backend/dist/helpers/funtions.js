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
exports.updateBalance = void 0;
const User_1 = require("../models/User");
const Wallet_1 = require("../models/Wallet");
const Helper_1 = require("./Helper");
const user_type_enum_1 = require("../constants/user-type.enum");
const WalletTransaction_1 = require("../models/WalletTransaction");
const updateBalance = ({ id, balance, total_balance, data, transaction_id, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (id == "admin") {
        id = Helper_1.default.admin._id;
    }
    console.log(balance, total_balance, id, data, transaction_id);
    const user = yield User_1.default.findById(id);
    if (!user)
        return;
    const wallet = yield Wallet_1.default.findOne({ user_id: user._id });
    console.log(wallet, "wallet");
    if (!wallet) {
        yield new Wallet_1.default({
            user_id: user._id,
            balance: balance,
            total_balance: total_balance,
        }).save();
        console.log("new wallet created");
        return;
    }
    console.log("line 38");
    wallet.balance = !!balance ? wallet.balance + parseInt(balance) : 0;
    console.log("line 42");
    if (user.type === user_type_enum_1.USER_TYPE.admin) {
        wallet.total_balance = !!total_balance
            ? Math.round((+wallet.total_balance + +total_balance) * 100) / 100
            : 0;
        console.log("line 46");
        wallet.revenue = !!wallet.revenue
            ? Math.round((+wallet.revenue + +total_balance) * 100) / 100
            : 0;
    }
    console.log("line 49");
    wallet.save();
    console.log("will create new transaction");
    yield WalletTransaction_1.default.create({
        wallet_id: wallet._id,
        type: "credit",
        amount: total_balance,
        remaining: wallet.total_balance,
        transaction_id: transaction_id ? transaction_id : null,
        data,
    });
    return;
});
exports.updateBalance = updateBalance;
