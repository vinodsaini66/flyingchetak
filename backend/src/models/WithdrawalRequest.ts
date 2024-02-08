import * as mongoose from 'mongoose';
import { model, AggregatePaginateModel } from 'mongoose';
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const Schema = mongoose.Schema;

export const WITHDRAW_STATUS = {
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected'
}
const WithdrawalRequestSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        amount: {
            type: Number,
            default: 0,
            required: true
        },
        status: {
            type: String,
            enum: [WITHDRAW_STATUS.pending, WITHDRAW_STATUS.approved, WITHDRAW_STATUS.rejected],
            default: 'pending', //pending ,approved,rejected
            required: true
        },
    }, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

WithdrawalRequestSchema.plugin(aggregatePaginate)

const WithdrawalRequest = model<any, AggregatePaginateModel<any>>("WithdrawalRequest", WithdrawalRequestSchema)

export default WithdrawalRequest;