import * as mongoose from 'mongoose';
import { AggregatePaginateModel, model } from 'mongoose';
import Helper from '../helpers/Helper';
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;

const Game = new Schema(
	{
		session: {
			type: String,
			default: () => Helper.generateAlphaString(6),
			required: true,
		},
		total_deposit: { type: Number, default: 0 },
		commission_amount: { type: Number, default: 0 },
		fall_rate: { type: Number, default: 1 },
		earning: { type: Number, default: 0 },
		is_game_end: { type: Boolean, default: false },
		base_amount: { type: Number, default: 0 }, // max bet amount
		start_time: { type: String, default: null }, // date.now
		end_time: { type: String, default: null }, // date.now
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
);

mongoose.plugin(aggregatePaginate);

export default model<any, AggregatePaginateModel<any>>('Game', Game);
