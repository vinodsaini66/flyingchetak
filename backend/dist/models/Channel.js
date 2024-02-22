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
const Channel = new Schema({
    key: { type: String, default: "" },
    name: { type: String, default: "" },
    url: { type: String, default: "" }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
mongoose.plugin(aggregatePaginate);
exports.default = (0, mongoose_1.model)('channel', Channel);
