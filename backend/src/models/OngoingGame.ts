import * as mongoose from "mongoose";
import { AggregatePaginateModel, model } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const OngoingGame = new Schema(
  {
    current_game: { type: Schema.Types.ObjectId, ref: "Game", default: null },
    next_game: { type: Schema.Types.ObjectId, ref: "Game", default: null },
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
  "OngoingGame",
  OngoingGame
);
