"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const user_type_enum_1 = require("../constants/user-type.enum");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const UserSetting = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    user_type: {
        type: String,
        enum: [user_type_enum_1.USER_TYPE.customer],
    },
    all_notifications: { type: Boolean, default: true },
    new_offer_notifications: { type: Boolean, default: true },
    order_status_notifications: { type: Boolean, default: true },
    setup_device_pin: { type: Boolean, default: false },
    device_pin: { type: Number, default: null },
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});
mongoose.plugin(aggregatePaginate);
exports.default = (0, mongoose_1.model)("UserSetting", UserSetting);
