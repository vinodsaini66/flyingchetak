import * as mongoose from 'mongoose';
import { AggregatePaginateModel, model } from 'mongoose';

const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;

export const LOGIN_TYPES = [
	'Mobile_Number',
	'Email',
	'Google',
	'Facebook',
	'Apple',
];

const Wallet = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		balance: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
);

mongoose.plugin(aggregatePaginate);

export default model<any, AggregatePaginateModel<any>>('wallet', Wallet);
