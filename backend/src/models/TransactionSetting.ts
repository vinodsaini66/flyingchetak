import * as mongoose from 'mongoose';
import { AggregatePaginateModel, model } from 'mongoose';

const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;

export const Transaction_Modes = {
	USER: 'User',
	ADMIN: 'Admin',
	REFERRAL: 'Referral',
};
export const Transaction_Types = {
	DEBIT: 'Debit',
	CREDIT: 'Credit',
};
export const Status_Types = {
	PENDING: 'Pending',
	SUCCESS: 'Success',
	FAILED: 'Failed',
	REJECT: 'Reject',
};

const Transaction = new Schema(
	{
		transaction_id: { type: String }, // random id of length 6-7
		payee: { type: Schema.Types.ObjectId, ref: 'User' },
		receiver: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		amount: {
			type: Number,
		},
		transaction_mode: {
			type: String,
			enum: Object.values(Transaction_Modes),
		},
		transaction_type: {
			type: String,
			enum: Object.values(Transaction_Types),
		},
		status: {
			type: String,
			enum: Object.values(Status_Types),
		},
		betType: {
			type: String
		},
		wallet_id: {
			type: Schema.Types.ObjectId,
			ref: 'Wallet',
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

export default model<any, AggregatePaginateModel<any>>(
	'Transaction',
	Transaction
);
