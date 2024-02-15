"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WITHDRAW_STATUS = void 0;
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;
exports.WITHDRAW_STATUS = {
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected'
};
const WithdrawalRequestSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    amount: {
        type: Number,
        default: 0,
        required: true
    },
    status: {
        type: String,
        enum: [exports.WITHDRAW_STATUS.pending, exports.WITHDRAW_STATUS.approved, exports.WITHDRAW_STATUS.rejected],
        default: 'pending',
        required: true
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
WithdrawalRequestSchema.plugin(aggregatePaginate);
const WithdrawalRequest = (0, mongoose_1.model)("WithdrawalRequest", WithdrawalRequestSchema);
exports.default = WithdrawalRequest;
