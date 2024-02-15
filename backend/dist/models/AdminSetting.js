"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;
const AdminSetting = new Schema({
    email: { type: String, default: null },
    country_code: { type: String, default: null },
    mobile_number: { type: String, default: null },
    address: {
        type: String,
        default: null,
    },
    facebook: {
        type: String,
        default: null,
    },
    instagram: {
        type: String,
        default: null,
    },
    bet_commission: {
        type: Number,
        default: 20,
    },
    min_withdrawal: {
        type: Number,
        default: 100,
    },
    min_bet: {
        type: Number,
        default: 0,
    },
    referral_bonus: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
mongoose.plugin(aggregatePaginate);
exports.default = (0, mongoose_1.model)('AdminSetting', AdminSetting);
