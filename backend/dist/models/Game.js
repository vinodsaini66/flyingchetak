"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const Helper_1 = require("../helpers/Helper");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;
const Game = new Schema({
    session: {
        type: String,
        default: () => Helper_1.default.generateAlphaString(6),
        required: true,
    },
    total_deposit: { type: Number, default: 0 },
    commission_amount: { type: Number, default: 0 },
    fall_rate: { type: Number, default: 1 },
    earning: { type: Number, default: 0 },
    is_game_end: { type: Boolean, default: false },
    base_amount: { type: Number, default: 0 },
    start_time: { type: String, default: null },
    end_time: { type: String, default: null }, // date.now
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
mongoose.plugin(aggregatePaginate);
exports.default = (0, mongoose_1.model)('Game', Game);
