import * as mongoose from "mongoose";
import { AggregatePaginateModel, model } from "mongoose";
import { USER_TYPE } from "../constants/user-type.enum";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const Winning_wallet = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, default: 0 },
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
  "winning_wallet",
  Winning_wallet
);
