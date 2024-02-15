"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;
const City = new Schema({
    name: {
        type: String,
        default: null,
    },
    state_id: {
        type: Number,
        default: null,
    },
    state_name: {
        type: String,
        default: null,
    },
    state_code: {
        type: String,
        default: null,
    },
    country_id: {
        type: Number,
        default: null,
    },
    country_code: {
        type: String,
        default: null,
    },
    country_name: {
        type: String,
        default: null,
    },
    latitude: {
        type: String,
        default: null,
    },
    longitude: {
        type: String,
        default: null,
    },
    is_status: {
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
exports.default = (0, mongoose_1.model)("City", City);
