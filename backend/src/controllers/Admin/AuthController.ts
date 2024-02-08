const express = require('express');

import Auth from '../../Utils/Auth';
import { USER_TYPE } from '../../constants/user-type.enum';
import MailHelper from '../../helpers/MailHelper';
import _RS from '../../helpers/ResponseHelper';
import AppSetting from '../../models/AppSetting';
import EmailTemplate from '../../models/EmailTemplate';
import User from '../../models/User';

const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
export class AuthController {
	static async login(req, res, next) {
		const startTime = new Date().getTime();
		const { email, password } = req.body;
		try {
			let isUserExist = await User.findOne({
				email: email,
				type: { $in: [USER_TYPE.admin] },
			});

			if (!isUserExist) {
				return _RS.notFound(
					res,
					'NOTFOUND',
					"Email address doesn't exists with us",
					isUserExist,
					startTime
				);
			}

			const isPasswordValid = await Auth.comparePassword(
				password,
				isUserExist.password
			);

			if (!isPasswordValid) {
				return _RS.badRequest(
					res,
					'BAD REQUEST',
					'Invalid password',
					{},
					startTime
				);
			}

			const payload = {
				id: isUserExist._id,
				email: isUserExist.email,
				type: isUserExist.type,
			};

			const token = await Auth.getToken(payload, '1d', next);
			return _RS.ok(
				res,
				'SUCCESS',
				'Welcome! Login Successfully',
				{ user: isUserExist, token },
				startTime
			);
		} catch (err) {
			next(err);
		}
	}

	static async signUp(req, res, next) {
		const startTime = new Date().getTime();
		const { email, password, name, country_code, mobile_number } = req.body;
		try {
			let user = await User.findOne({
				// $and: [{ email: email }, { type: "ServiceProvider" }],
				$and: [{ email: email }],
			});
			if (!user) {
				user = await User.create({
					email: 'serviceProvider@yopmail.com',
					password: await Auth.encryptPassword('Test@123'),
					name: 'Sub Admin',
					country_code: '91',
					type: 'Admin',
					mobile_number: '9632587412',
				});
				return _RS.created(res, 'CREATED', 'SignUp Sucessfully');
			}
			return _RS.conflict(
				res,
				'CONFLICT',
				'User already exist with this email',
				user,
				startTime
			);
		} catch (err) {
			next(err);
		}
	}

	static async getProfile(req, res, next) {
		const startTime = new Date().getTime();
		try {
			let getAdmin = await User.findOne({
				_id: req.user.id,
			});

			if (!getAdmin) {
				return _RS.notFound(
					res,
					'NOTFOUND',
					'User not exist, go to signup page',
					getAdmin,
					startTime
				);
			}
			return _RS.ok(
				res,
				'SUCCESS',
				'Get Profile Successfully',
				getAdmin,
				startTime
			);
		} catch (err) {
			next(err);
		}
	}

	static async changePassword(req, res, next) {
		const startTime = new Date().getTime();
		const { old_password, new_password } = req.body;
		try {
			const admin: any = await User.findById(req.user.id);

			const isPasswordCurrentCorrect = await Auth.comparePassword(
				old_password,
				admin.password
			);

			if (!isPasswordCurrentCorrect) {
				return _RS.badRequest(
					res,
					'BAD REQUEST',
					'Old password does not match',
					{},
					startTime
				);
				// return next(
				//   new AppError("Old password does not match", RESPONSE.HTTP_BAD_REQUEST)
				// );
			}
			const isSamePassword = await Auth.comparePassword(
				new_password,
				admin.password
			);

			if (isSamePassword) {
				return _RS.badRequest(
					res,
					'BAD REQUEST',
					'New password cannot be the same as the old password',
					{},
					startTime
				);
			}

			const encryptedPassword = await Auth.encryptPassword(new_password);

			admin.password = encryptedPassword;

			await admin.save();

			return _RS.ok(
				res,
				'SUCCESS',
				'New Password Set Successfully',
				{},
				startTime
			);
			// res.status(RESPONSE.HTTP_OK).json({
			//   status: RESPONSE.HTTP_OK,

			//   message: "password changed successfully",

			//   data: {},
			// });
		} catch (err) {
			next(err);
		}
	}

	static async updateProfile(req, res, next) {
		const startTime = new Date().getTime();
		const { email, name } = req.body;
		// const image = req.file.filename
		try {
			let getAdmin = await User.findOne({
				_id: req.user.id,
			});

			if (!getAdmin) {
				return _RS.notFound(
					res,
					'NOTFOUND',
					'User not exist , go to signup page',
					getAdmin,
					new Date().getTime()
				);
			}

			(getAdmin.name = name ? name : getAdmin.name),
				(getAdmin.email = email ? email : getAdmin.email),
				// (getAdmin.image = image ? image : getAdmin.image),
				getAdmin.save();
			return _RS.ok(
				res,
				'SUCCESS',
				'Update Profile Successfully',
				getAdmin,
				startTime
			);
		} catch (error) {
			next(error);
		}
	}

	static async forgotPassword(req, res, next) {
		const email = req.body.email;

		try {
			let admin = await User.findOne({
				email,
				type: { $in: [USER_TYPE.admin] },
			});

			if (!admin) {
				let msg = 'Email address is not exists with us. Please check again';
				return _RS.notFound(res, 'SUCCESS', msg, admin, new Date().getTime());
			}

			const otp = await Auth.generateOtp();

			admin.otp = otp.otp;

			const savedAdmin = await admin.save();

			var emailTemplate = await EmailTemplate.findOne({
				slug: 'forgot-password',
			});

			var replacedHTML = emailTemplate.description;
			replacedHTML = replacedHTML.replace('[NAME]', admin.name || '');
			replacedHTML = replacedHTML.replace('[OTP]', admin.otp || '');

			await MailHelper.sendMail(admin.email, emailTemplate.title, replacedHTML);

			return _RS.ok(
				res,
				'SUCCESS',
				'OTP has been sent to your email, please check your inbox',
				{},
				new Date().getTime()
			);
		} catch (error) {
			next(error);
		}
	}

	static async verifyOtp(req, res, next) {
		const email = req.body.email;
		const otp = req.body.otp;
		try {
			let admin = await User.findOne({
				email: email,
				type: { $in: [USER_TYPE.admin] },
			});
			if (!admin) {
				return _RS.notFound(
					res,
					'NOTFOUND',
					'not found',
					{},
					new Date().getTime()
				);
			}

			if (admin.otp != otp) {
				return _RS.badRequest(
					res,
					'BAD REQUEST',
					'Invalid OTP',
					{},
					new Date().getTime()
				);
			}

			admin.otp = null;
			admin.otp_expiry_time = null;
			admin.save();
			return _RS.ok(
				res,
				'SUCCESS',
				'Please check mail id , send otp on mail',
				{},
				new Date().getTime()
			);
		} catch (error) {
			next(error);
		}
	}

	static async resetPassword(req, res, next) {
		const { email, password } = req.body;
		try {
			let user = await User.findOne({
				email: email,
				type: { $in: [USER_TYPE.admin] },
			});

			if (!user) {
				let msg = 'User not found';
				return _RS.notFound(res, 'notFound', msg, {}, new Date().getTime());
			}

			user.password = await Auth.encryptPassword(password);
			await user.save();

			let msg = 'Password changed successfully.';
			return _RS.ok(res, 'SUCCESS', msg, {}, new Date().getTime());
		} catch (error) {
			next(error);
		}
	}

	static async updateAppSetting(req, res, next) {
		const startTime = new Date().getTime();
		const {
			app_store_url,
			play_store_url,
			android_version,
			ios_version,
			android_share_content,
			ios_share_content,
		} = req.body;
		try {
			let getSetting = await AppSetting.findById('64e5d2fa6f079edbe3800654');

			if (!getSetting) {
				return _RS.notFound(
					res,
					'NOTFOUND',
					'Setting not found',
					getSetting,
					startTime
				);
			}

			(getSetting.app_store_url = app_store_url
				? app_store_url
				: getSetting.app_store_url),
				(getSetting.play_store_url = play_store_url
					? play_store_url
					: getSetting.play_store_url),
				(getSetting.android_version = android_version
					? android_version
					: getSetting.android_version),
				(getSetting.ios_version = ios_version
					? ios_version
					: getSetting.ios_version),
				(getSetting.android_share_content = android_share_content
					? android_share_content
					: getSetting.android_share_content),
				(getSetting.ios_share_content = ios_share_content
					? ios_share_content
					: getSetting.ios_share_content),
				getSetting.save();

			return _RS.ok(
				res,
				'SUCCESS',
				'App setting has been successfully',
				getSetting,
				startTime
			);
		} catch (err) {
			next(err);
		}
	}
}
