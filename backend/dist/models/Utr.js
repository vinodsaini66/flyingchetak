"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;
const Utr = new Schema({
    key: { type: String, default: "" },
    url: { type: String, default: "" }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
mongoose.plugin(aggregatePaginate);
exports.default = (0, mongoose_1.model)('utr', Utr);
