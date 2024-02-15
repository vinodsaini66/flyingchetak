"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;
const history_type = ["Login", "Register", "Credit", "Debit"];
const history_status = ["Success", "Pending", "Reject"];
const History = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    type: {
        type: String,
        enum: [history_type[0], history_type[1], history_type[2], history_type[3]],
    },
    message: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: [history_status[0], history_status[1], history_status[2]],
    },
    is_active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
mongoose.plugin(aggregatePaginate);
exports.default = (0, mongoose_1.model)("history", History);
