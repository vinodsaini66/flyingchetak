"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetStatus = void 0;
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;
exports.BetStatus = {
    ACTIVE: 'Active',
    PLACED: 'Placed',
    COMPLETED: 'Completed',
    PENDING: 'Pending',
};
const Bet = new Schema({
    game_id: { type: Schema.Types.ObjectId, ref: 'Game' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: Object.values(exports.BetStatus),
        default: exports.BetStatus.PENDING,
    },
    deposit_amount: { type: Number, default: 0 },
    bidType: { type: String },
    xValue: { type: Number },
    win_amount: { type: Number, default: 0 },
    withdraw_at: { type: String, default: null }, // Date.now()
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
mongoose.plugin(aggregatePaginate);
exports.default = (0, mongoose_1.model)('Bet', Bet);
