import * as mongoose from 'mongoose';
import { model, AggregatePaginateModel } from 'mongoose';
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;

const AdminSetting = new Schema(
	{
		email: { type: String, default: null },
		country_code: { type: String, default: null },
		mobile_number: { type: String, default: null }, // these contact details are bw which admin can send email or sms
		address: {
			type: String,
			default: null,
		},
		facebook: {
			type: String,
			default: null,
		},
		instagram: {
			type: String,
			default: null,
		},

		bet_commission: {
			type: Number,
			default: 20,
		},
		min_withdrawal: {
			type: Number,
			default: 100,
		},
		min_bet: {
			type: Number,
			default: 0,
		},
		referral_bonus: {
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

export default model<any, AggregatePaginateModel<any>>(
	'AdminSetting',
	AdminSetting
);
