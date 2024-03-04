import * as mongoose from 'mongoose';
import { AggregatePaginateModel, model } from 'mongoose';
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;


const Utr = new Schema(
	{
		key: { type: String,default:"" },
		url: { type: String,default:"" }
    },
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
);

mongoose.plugin(aggregatePaginate);

export default model<any, AggregatePaginateModel<any>>('utr', Utr);
