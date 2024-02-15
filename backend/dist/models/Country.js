"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const CountrySchema = new mongoose_1.Schema({
    name: {
        type: String,
        default: null,
    },
    region: {
        type: String,
        default: null,
    },
    id: {
        type: Number,
        default: null
    },
    latitude: {
        type: Number,
        default: null,
    },
    longitude: {
        type: Number,
        default: null,
    },
    emoji: {
        type: String,
        default: null,
    },
    currency: {
        type: String,
        default: null,
    },
    currency_symbol: {
        type: String,
        default: null,
    },
    phone_code: {
        type: String,
        default: true,
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
CountrySchema.plugin(aggregatePaginate);
const Country = (0, mongoose_1.model)("Country", CountrySchema);
exports.default = Country;
