"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const OngoingGame = new Schema({
    current_game: { type: Schema.Types.ObjectId, ref: "Game", default: null },
    next_game: { type: Schema.Types.ObjectId, ref: "Game", default: null },
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});
mongoose.plugin(aggregatePaginate);
exports.default = (0, mongoose_1.model)("OngoingGame", OngoingGame);
