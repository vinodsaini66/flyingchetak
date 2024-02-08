import * as mongoose from 'mongoose';
import { AggregatePaginateModel, model } from 'mongoose';

import { USER_TYPE } from '../constants/user-type.enum';

const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;

export const LOGIN_TYPES = [
	'Mobile_Number',
	'Email',
	'Google',
	'Facebook',
	'Apple',
];

const User = new Schema(
	{
		name: {
			type: String,
			default: null,
		},
		mobile_number: {
			type: String,
			default: null,
		},
		country_code: {
			type: String,
			default: '+91',
		},
		email: {
			type: String,
			default: null,
		},
		password: {
			type: String,
		},
		otp: {
			type: Number,
			default: null,
		},
		dob: {
			type: String,
		},
		gender: {
			type: String,
			enum: ['Male', 'Female'],
		},
		language: {
			type: String,
			default: 'en',
		},
		image: {
			type: String,
			default: null,
		},
		social_image: {
			type: String,
			default: null,
		},
		is_active: {
			type: Boolean,
			default: true,
		},
		is_verify: {
			type: Boolean,
			default: false,
		},
		bank_info:{
			type:Object,
			default:{}
		},
		is_delete: {
			type: Boolean,
			default: false,
		},
		is_otp_verify: {
			type: Boolean,
			default: false,
		},
		referral_id: {
			type: String,
			default: null,
		},
		referral_from_id: {
			type: String,
			default: null,
		},
		type: {
			type: String,
			enum: [USER_TYPE.admin, USER_TYPE.customer],
			default: null,
		},
		device_token: {
			type: String,
			default: null,
		},
		device_type: {
			type: String,
			default: null,
		},
		otp_sent_on: {
			type: String, // time stamps
			default: null,
		},
		social_id: {
			type: String,
			default: null,
		},

		login_type: { type: String, enum: LOGIN_TYPES, default: LOGIN_TYPES[0] },
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
);

mongoose.plugin(aggregatePaginate);

export default model<any, AggregatePaginateModel<any>>('User', User);
