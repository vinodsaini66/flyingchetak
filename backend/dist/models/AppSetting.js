"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;
const AppSetting = new Schema({
    app_store_url: { type: String, default: null },
    play_store_url: { type: String, default: null },
    android_version: { type: String, default: null },
    ios_version: { type: String, default: null },
    android_share_content: { type: String, default: null },
    ios_share_content: { type: String, default: null },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
mongoose.plugin(aggregatePaginate);
exports.default = (0, mongoose_1.model)('AppSetting', AppSetting);
