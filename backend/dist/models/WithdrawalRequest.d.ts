/// <reference types="mongoose-aggregate-paginate-v2" />
import * as mongoose from 'mongoose';
export declare const WITHDRAW_STATUS: {
    pending: string;
    approved: string;
    rejected: string;
};
declare const WithdrawalRequest: mongoose.AggregatePaginateModel<any>;
export default WithdrawalRequest;
