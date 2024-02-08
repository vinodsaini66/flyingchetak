import * as mongoose from "mongoose";
import { AggregatePaginateModel, model } from "mongoose";
import { USER_TYPE } from "../constants/user-type.enum";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const UserSetting = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    user_type: {
      type: String,
      enum: [USER_TYPE.customer],
    },
    all_notifications: { type: Boolean, default: true },
    new_offer_notifications: { type: Boolean, default: true },
    order_status_notifications: { type: Boolean, default: true },
    setup_device_pin: { type: Boolean, default: false },
    device_pin: { type: Number, default: null },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

mongoose.plugin(aggregatePaginate);

export default model<any, AggregatePaginateModel<any>>(
  "UserSetting",
  UserSetting
);
