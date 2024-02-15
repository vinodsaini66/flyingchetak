"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOGIN_TYPES = void 0;
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;
exports.LOGIN_TYPES = [
    'Mobile_Number',
    'Email',
    'Google',
    'Facebook',
    'Apple',
];
const Wallet = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    balance: {
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
exports.default = (0, mongoose_1.model)('wallet', Wallet);
