/// <reference types="mongoose-aggregate-paginate-v2" />
import * as mongoose from 'mongoose';
export declare const Transaction_Modes: {
    USER: string;
    ADMIN: string;
    REFERRAL: string;
};
export declare const Transaction_Types: {
    DEBIT: string;
    CREDIT: string;
};
export declare const Status_Types: {
    PENDING: string;
    SUCCESS: string;
    FAILED: string;
    REJECT: string;
};
declare const _default: mongoose.AggregatePaginateModel<any>;
export default _default;
