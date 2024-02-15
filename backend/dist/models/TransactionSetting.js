"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status_Types = exports.Transaction_Types = exports.Transaction_Modes = void 0;
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;
exports.Transaction_Modes = {
    USER: 'User',
    ADMIN: 'Admin',
    REFERRAL: 'Referral',
};
exports.Transaction_Types = {
    DEBIT: 'Debit',
    CREDIT: 'Credit',
};
exports.Status_Types = {
    PENDING: 'Pending',
    SUCCESS: 'Success',
    FAILED: 'Failed',
    REJECT: 'Reject',
};
const Transaction = new Schema({
    transaction_id: { type: String },
    payee: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    amount: {
        type: Number,
    },
    transaction_mode: {
        type: String,
        enum: Object.values(exports.Transaction_Modes),
    },
    transaction_type: {
        type: String,
        enum: Object.values(exports.Transaction_Types),
    },
    status: {
        type: String,
        enum: Object.values(exports.Status_Types),
    },
    wallet_id: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
mongoose.plugin(aggregatePaginate);
exports.default = (0, mongoose_1.model)('Transaction', Transaction);
