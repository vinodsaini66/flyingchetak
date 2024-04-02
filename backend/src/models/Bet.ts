import * as mongoose from 'mongoose';
import { AggregatePaginateModel, model } from 'mongoose';
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;

export const BetStatus = {
	ACTIVE: 'Active',
	PLACED: 'Placed',
	COMPLETED: 'Completed',
	PENDING: 'Pending',
};

const Bet = new Schema(
	{
		game_id: { type: Schema.Types.ObjectId, ref: 'Game' },
		user_id: { type: Schema.Types.ObjectId, ref: 'User' },
		status: {
			type: String,
			enum: Object.values(BetStatus),
			default: BetStatus.PENDING,
		},
		deposit_amount: { type: Number, default: 0 },
		betType: { type: String},
		boxType: { type: String},
		xValue: {type: Number},
		withdraw_amount: { type: Number, default: 0 },
		withdraw_at: { type: String, default: null }, // Date.now()
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
);

mongoose.plugin(aggregatePaginate);

export default model<any, AggregatePaginateModel<any>>('Bet', Bet);