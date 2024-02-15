/// <reference types="mongoose-aggregate-paginate-v2" />
import * as mongoose from 'mongoose';
export declare const BetStatus: {
    ACTIVE: string;
    PLACED: string;
    COMPLETED: string;
    PENDING: string;
};
declare const _default: mongoose.AggregatePaginateModel<any>;
export default _default;
