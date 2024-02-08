import { USER_TYPE } from '../../constants/user-type.enum';

import Auth from '../../Utils/Auth';
import Helper from '../../helpers/Helper';
import MailHelper from '../../helpers/MailHelper';
import _RS from '../../helpers/ResponseHelper';
import User, { LOGIN_TYPES } from '../../models/User';
import UserSetting from '../../models/UserSetting';
// import { UserService } from "../../baseServices/userService";
import Authentication from '../../Middlewares/Authentication';
import EmailTemplate from '../../models/EmailTemplate';
import Wallet from '../../models/WalletSettings';
import History from '../../models/HistorySetting';
import moment = require('moment');
import AdminSetting from '../../models/AdminSetting';
import TransactionSetting from '../../models/TransactionSetting';
import WinningWallet from '../../models/WinningWallet';
const { ObjectId } = require('mongodb');

export class AuthController {
	/**
	 * @api {post} /api/app/auth/login Login
	 * @apiVersion 1.0.0
	 * @apiName Login
	 * @apiGroup Auth
	 * @apiParam {String} country_code Country Code.
	 * @apiParam {String} mobile_number Mobile Number.
	 * @apiParam {String} password Password .
	 * @apiParam {String} type User Type ("Customer, ServiceProvider").
	 * @apiParam {String} device_token Device Token.
	 * @apiParam {String} device_type Device Type.
	 * @apiParam {String} latitude Latitude.
	 * @apiParam {String} longitude Longitude.
	 */

	static async login(req, res, next) {
		const startTime = new Date().getTime();
		const {
			country_code,
			mobile_number,
			password,
			type,
			device_token,
			device_type,
			latitude,
			longitude,
		} = req.body;
		try {
			let existingUser = await User.findOne({
				mobile_number: mobile_number,
				type: "Customer",
				is_delete: false,
			});
			if (!existingUser) {
				return _RS.api(
					res,
					false,
					'User not exist, Please check the credentials',
					{},
					startTime
				);
			}

			if (!existingUser.is_active) {
				return _RS.api(
					res,
					false,
					'Account Deactivated, Please contact to admin',
					{},
					startTime
				);
			}

			// if (!existingUser.is_otp_verify && type == "Customer") {
			//   existingUser.otp = (await Auth.generateOtp()).otp;
			//   existingUser.save();
			//   return _RS.api(
			//     res,
			//     true,
			//     "OTP verification is pending",
			//     { is_otp_verify: existingUser.is_otp_verify },
			//     startTime
			//   );
			// }

			// if (!existingUser.is_verify && type != "Customer") {
			//   return _RS.api(
			//     res,
			//     true,
			//     "Please wait.. We are verifying your account",
			//     {},
			//     startTime
			//   );
			// }

			const isPasswordValid = await Auth.comparePassword(
				password,
				existingUser.password
			);

			if (!isPasswordValid) {
				return _RS.api(
					res,
					false,
					'Invalid password, Please check the password',
					{},
					startTime
				);
			}

			const payload = {
				_id: existingUser._id,
				country_code: existingUser.country_code,
				mobile_number: existingUser.mobile_number,
				type: existingUser.type,
			};

			existingUser.device_token = device_token;
			existingUser.device_type = device_type;
			existingUser.latitude = latitude;
			existingUser.longitude = longitude;
			existingUser.save();

			const token = await Auth.getToken(payload, '30d', next);
			const historyTime = moment(startTime).format('MMMM Do YYYY, h:mm:ss a')
			let historypayload = {
				userId:existingUser._id,
				type:"Login",
				status:"Success",
				message:`Your account has been login at ${historyTime}`
			}
			let createhistory = await History.create(historypayload)
			return _RS.api(
				res,
				true,
				'Welcome! Login Successful',
				{ token: token },
				startTime
			);
		} catch (err) {
			next(err);
		}
	}

	/**
   * @api {post} /api/app/auth/sign-up SignUp
   * @apiVersion 1.0.0
   * @apiName SignUp
   * @apiGroup Auth
   * @apiParam {String} country_code Country Code.
   * @apiParam {String} mobile_number Mobile Number.
   * @apiParam {String} type User Type ("Customer, ServiceProvider").
   * @apiParamExample {json} Normal-signUp-Request-Example:
   * {"country_code":"968","mobile_number":"9874587458","type":"Customer"}
   * @apiSuccessExample {json} Success-Response:
   * {
    "status": true,
    "message": "OTP has been sent to your mobile number",
    "data": {
        "name": null,
        "role_id": null,
        "permission": [],
        "mobile_number": "9874587458",
        "country_code": "968",
        "email": null,
        "otp": 1234,
        "language": "en",
        "image": null,
        "is_active": true,
        "is_verify": false,
        "is_delete": false,
        "is_otp_verify": false,
        "is_featured": false,
        "type": "Customer",
        "device_token": null,
        "device_type": null,
        "_id": "65000fcc19891b50529f65ff",
        "created_at": "2023-09-12T07:14:20.624Z",
        "updated_at": "2023-09-12T07:14:20.624Z",
        "__v": 0
    },
    "exeTime": 579
}
  */

	static async signUp(req, res, next) {
		console.log('user stay here', req.body);
		const startTime = new Date().getTime();
		const { mobile_number, password, type, country_code,referral_from_id,email,name } = req.body;
		try {
			const getUser = await User.findOne({
				mobile_number: mobile_number,
			});
			if (getUser) {
				return _RS.api(res, false, 'User Already Exist', {}, startTime);
			} else {
				const characters = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
				let randomString = '';
			  
				for (let i = 0; i < 8; i++) {
				  const randomIndex = Math.floor(Math.random() * characters.length);
				  randomString += characters.charAt(randomIndex);
				}
				const userpassword = await Auth.encryptPassword(password);
				const payload = {
					country_code: country_code,
					mobile_number: mobile_number,
					type: type,
					password: userpassword,
					referral_from_id:referral_from_id,
					referral_id:randomString,
					email:email,
					name:name,
					login_type: LOGIN_TYPES[0],
				};
				
				if(referral_from_id && referral_from_id != ""){
					let getUserByReferral = await User.findOne({
						referral_id:referral_from_id
					});
					console.log("referral_id============>>>>>>>>>>>.",referral_from_id,getUserByReferral)
					if(getUserByReferral){
						let getAdminReferralBonus = await AdminSetting.findOne()
						let updateWallet = await Wallet.updateOne({userId:getUserByReferral._id},{$inc:{balance:getAdminReferralBonus.referral_bonus}})
						let txnRefId = 'CHETAK' + new Date().getTime();
						let add = {
							payee:getUserByReferral._id,
							receiver:getUserByReferral._id,
							amount:Number(getAdminReferralBonus.referral_bonus),
							transaction_mode:"Referral",
							transaction_type:"Credit",
							// wallet_id:previousBalance._id,
							transaction_id:txnRefId,
							status:"Approved"
						  }
						let transactions = await TransactionSetting.create(add)
					}
					else{
						return _RS.api(
							res,
							false,
							'Invite Code Is Invalid',
							{},
							startTime
						);
					}
	
				}
				let user = await User.create(payload);
				const walletPayload = {
					userId:user._id,
					balance:0
				}
				let createWallet = await Wallet.create(walletPayload)
				const historyTime = moment(startTime).format('MMMM Do YYYY, h:mm:ss a')
				let historypayload = {
				userId:user._id,
				type:"Register",
				status:"Success",
				message:`Your account has been register at ${historyTime}`
				}
				let winningObj = {
					userId:user._id,
					amount:0
				}
				let createhistory = await History.create(historypayload)
				let winning_wallet = await WinningWallet.create(winningObj)
			
				const tokenpayload = {
					_id: user._id,
					country_code: user.country_code,
					mobile_number: user.mobile_number,
					type: user.type,
				};
				const token = await Auth.getToken(tokenpayload, "30d", next);
				return _RS.api(
					res,
					true,
					'User successfully register',
					{ token: token },
					startTime
				);
			}
		} catch (error) {
			next(error);
		}
	}

	static async bankInfo(req,res,next){
		const startTime = new Date().getTime();
		let {
			_id
		} = req.user
		const userId =  new ObjectId(_id)
		try{
			let update = await User.updateOne({_id:userId},{$set:{bank_info:req.body}})
		console.log("req.body=============>>>>>>>>>>.",update)

			if(update){
				return _RS.api(
					res,
					true,
					'Bank Info Added successfully',
					{ },
					startTime
				);
			}
			else{
				return _RS.api(
					res,
					false,
					'Some error occurs',
					{},
					startTime
				);
			}

		}catch(error){
				next(error)
		}
	}
    static async getHistory(req,res,next){
		const startTime = new Date().getTime();
		let {
			_id
		} = req.user
		const userId =  new ObjectId(_id)
		try{
			let get = await History.find({userId})
			if(get){
				return _RS.api(
					res,
					true,
					'History found successfully',
					{ history: get },
					startTime
				);
			}
			else{
				return _RS.api(
					res,
					false,
					'Some error occurs',
					{},
					startTime
				);
			}

		}catch(error){
				next(error)
		}
	}
	/**
	 * @api {post} /api/app/auth/forgot-password Forgot Password
	 * @apiVersion 1.0.0
	 * @apiName Forgot Password
	 * @apiGroup Auth
	 * @apiParam {String} country_code Country Code.
	 * @apiParam {String} mobile_number Mobile Number.
	 * @apiParam {String} type User Type ("Customer, ServiceProvider").
	 */

	static async forgotPassword(req, res, next) {
		const startTime = new Date().getTime();
		const { country_code, mobile_number, type } = req.body;
		try {
			const getData = await User.findOne({
				country_code: country_code,
				mobile_number: mobile_number,
				type,
				is_delete: false,
			});
			if (!getData) {
				return _RS.api(
					res,
					false,
					'User not exist with this mobile number',
					{},
					startTime
				);
			} else {
				const otp = await Auth.generateOtp();

				getData.otp = (await Auth.generateOtp()).otp; // otp?.otp
				await getData.save();
				return _RS.api(
					res,
					true,
					'OTP has been sent to your mobile number',
					{},
					startTime
				);
			}
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @api {post} /api/app/auth/verify-otp Verify OTP
	 * @apiVersion 1.0.0
	 * @apiName Verify OTP
	 * @apiGroup Auth
	 * @apiParam {String} country_code Country Code.
	 * @apiParam {String} mobile_number Mobile Number.
	 * @apiParam {String} type User Type ("Customer, ServiceProvider").
	 * @apiParam {String} otp OTP.
	 */

	static async verifyOTP(req, res, next) {
		const startTime = new Date().getTime();
		const { country_code, mobile_number, type } = req.body;
		try {
			let user = await User.findOne({
				country_code: country_code,
				mobile_number: mobile_number,
				type,
			});

			if (!!user && user?.is_delete === true) {
				return _RS.api(res, false, 'Deleted Account', {}, startTime);
			}

			if (user) {
				if (user.is_otp_verify) {
					return _RS.api(
						res,
						false,
						'User mobile number is already exists',
						{},
						startTime
					);
				}
				const otp = (await Auth.generateOtp()).otp;
				user.otp = otp;
				await user.save();

				const to = user.country_code + user.mobile_number;
				const body = `Welcome Customer, Your OTP is ${otp}.`;
				await Helper.sendSMS(to, body);

				return _RS.api(
					res,
					true,
					'OTP has been sent to your mobile number',
					user,
					startTime
				);
			}

			user = await User.create({
				country_code,
				mobile_number,
				type,
				otp: 1234,
				login_type: LOGIN_TYPES[0],
			});

			return _RS.api(
				res,
				true,
				'OTP has been sent to your mobile number',
				user,
				startTime
			);
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @api {post} /api/app/auth/reset-password Reset Password
	 * @apiVersion 1.0.0
	 * @apiName Reset Password
	 * @apiGroup Auth
	 * @apiHeader {String} Authorization Pass jwt token.
	 * @apiParam {String} password Password.
	 */

	static async resetPassword(req, res, next) {
		const startTime = new Date().getTime();
		const { password } = req.body;
		try {
			const getUser = await User.findOne({
				_id: req.user.id,
				is_delete: false,
			});

			if (!getUser) {
				return _RS.api(
					res,
					false,
					'User not exist with this mobile number',
					{},
					startTime
				);
			}

			const newPassword = await Auth.encryptPassword(password);
			getUser.password = newPassword;
			getUser.otp = null;
			getUser.save();
			return _RS.api(
				res,
				true,
				'Password has been updated changed successfully',
				{},
				startTime
			);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @api {post} /api/app/auth/change-password Change Password
	 * @apiVersion 1.0.0
	 * @apiName Change Password
	 * @apiHeader {String} Authorization Pass jwt token.
	 * @apiGroup Auth
	 * @apiParam {String} old_password Old Password.
	 * @apiParam {Boolean} onboarding True on Registration (true, false).
	 * @apiParam {String} password Password.
	 */

	static async changePassword(req, res, next) {
		const startTime = new Date().getTime();
		const { old_password, password, onboarding } = req.body;

		try {
			const user = await User.findOne({ _id: req.user.id });

			if (!user) {
				return _RS.api(res, false, 'UserNotFound', {}, startTime);
			}

			if (!!old_password && !onboarding) {
				const isPasswordValid = await Auth.comparePassword(
					old_password,
					user.password
				);

				if (!isPasswordValid) {
					return _RS.api(res, false, 'INCORRECT PASSWORD', {}, startTime);
				}
			}

			const newPassword = await Auth.encryptPassword(password);
			const isPasswordSameAsOld = await Auth.comparePassword(
				newPassword,
				user.password
			);

			if (isPasswordSameAsOld || old_password === password) {
				return _RS.api(
					res,
					false,
					'New Password Can not be same as one previously used, Please use a different one.',
					{},
					startTime
				);
			}

			user.password = newPassword;
			user.otp = null;
			await user.save();

			return _RS.api(res, true, 'PasswordChanged', {}, startTime);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @api {post} /api/app/auth/delete-account Delete Account
	 * @apiVersion 1.0.0
	 * @apiHeader {String} Authorization Pass jwt token.
	 * @apiName Delete Account
	 * @apiGroup Auth
	 */

	static async deleteAccount(req, res, next) {
		const startTime = new Date().getTime();

		try {
			const userId = req.user.id;
			const userProfile = await User.findOne({ _id: userId });
			if (!userProfile) {
				return _RS.api(res, false, 'UserNotFound', {}, startTime);
			}

			userProfile.is_delete = true;
			userProfile.is_active = false;
			userProfile.save();

			return _RS.api(res, true, 'Account Deleted Successfully', {}, startTime);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @api {get} /api/app/auth/get/setting Get Setting
	 * @apiVersion 1.0.0
	 * @apiHeader {String} Authorization Pass jwt token.
	 * @apiName Get Setting
	 * @apiGroup Auth
	 */

	static async getSetting(req, res, next) {
		try {
			const startTime = new Date().getTime();
			const userId = req.user.id;

			const userSetting = await UserSetting.findOne({ user_id: userId });

			return _RS.api(
				res,
				true,
				'Setting Get Successfully',
				userSetting
					? userSetting
					: {
							all_notifications: true,
							new_offer_notifications: true,
							order_status_notifications: true,
							setup_device_pin: false,
					  },
				startTime
			);
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @api {post} /api/app/auth/setting Update Setting
	 * @apiVersion 1.0.0
	 * @apiHeader {String} Authorization Pass jwt token.
	 * @apiName Update Setting
	 * @apiGroup Auth
	 * @apiParam {Boolean} all_notification Notification (true, false).
	 * @apiParam {Boolean} new_offer_notification New Offer Notification (true, false).
	 * @apiParam {Boolean} order_status_notification Order Status Change Notification (true, false).
	 * @apiParam {Boolean} setup_device_pin Setup Device Pin (true, false).
	 * @apiParam {Number} device_pin Device Pin.
	 */

	static async setting(req, res, next) {
		try {
			const startTime = new Date().getTime();
			const userId = req.user.id;

			const user = await User.findById(userId);

			const {
				all_notification,
				new_offer_notification,
				order_status_notification,
				setup_device_pin,
				device_pin,
			} = req.body;

			if (!user) {
				return _RS.api(res, false, 'UserNotFound', {}, startTime);
			}

			const userSetting = await UserSetting.findOne({
				user_id: userId,
				user_type: USER_TYPE.customer,
			});

			const data = {
				user_id: userId,
				user_type: USER_TYPE.customer,
				all_notifications: all_notification,
				new_offer_notifications: new_offer_notification,
				order_status_notifications: order_status_notification,
				setup_device_pin: setup_device_pin,
				device_pin: !!device_pin ? device_pin : null,
			};

			if (!userSetting) {
				const newUserSetting = await new UserSetting(data).save();

				return _RS.api(
					res,
					true,
					'Settings Added Successfully',
					newUserSetting,
					startTime
				);
			}

			userSetting.all_notifications = all_notification;
			userSetting.new_offer_notifications = new_offer_notification;
			userSetting.order_status_notifications = order_status_notification;
			userSetting.setup_device_pin = setup_device_pin;
			userSetting.device_pin = !!device_pin ? device_pin : null;
			await userSetting.save();

			return _RS.api(
				res,
				true,
				'Settings Updated Successfully',
				userSetting,
				startTime
			);
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @api {get} /api/app/auth/get-profile Get Profile
	 * @apiVersion 1.0.0
	 * @apiName Get Profile
	 * @apiHeader {String} Authorization Pass jwt token.
	 * @apiGroup Auth
	 */

	static async getProfile(req, res, next) {
		try {
			const startTime = new Date().getTime();
			const getUser = await User.findOne({ _id: req.user.id });
			if (!getUser) {
				return _RS.api(res, false, 'User Not Found', {}, startTime);
			}

			return _RS.api(res, true, 'Profile Get', getUser, startTime);
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @api {post} /api/app/auth/update-profile Update Profile
	 * @apiVersion 1.0.0
	 * @apiName Update Profile
	 * @apiHeader {String} Authorization Pass jwt token.
	 * @apiGroup Auth
	 * @apiParam {String} name Name.
	 * @apiParam {Number} country_code Country Code.
	 * @apiParam {Number} mobile_number Mobile Number.
	 * @apiParam {String} email Email.
	 * @apiParam {String} gender Gender (Male, Female).
	 * @apiParam {String} dob DOB (1997-07-12).
	 * @apiParam {String} image Image.
	 * @apiParam {Number} latitude Latitude.
	 * @apiParam {Number} longitude Longitude.
	 * @apiParam {String} address Address.
	 */

	static async updateProfile(req, res, next) {
		try {
			const startTime = new Date().getTime();
			const {
				name,
				gender,
				dob,
				language,
				latitude,
				longitude,
				address,
				country_code,
				mobile_number,
				email,
			} = req.body;
			// const image = req.file.filename

			const user = await User.findOne({ _id: req.user.id });
			if (!user) {
				return _RS.api(res, false, 'UserNotFound', {}, startTime);
			} // Replace with the mobile number or email you're checking

				let userExistWithThisMailOrMobileNumber = await User.find({
					$or: [
						{ mobile_number: mobile_number },
						{ email: email }
					]
					});
				if(userExistWithThisMailOrMobileNumber.length>0){
					return _RS.api(
						res,
						false,
						'Email or Mobile Number Already Exist',
						{},
						startTime
					);
				}

			user.name = name ? name : user.name;
			user.gender = gender ? gender : user.gender;
			user.language = language ? language : user.language;
			// user.image = image ? image : user.image;
			user.email = email ? email : user.email;
			user.mobile_number = mobile_number ? mobile_number : user.mobile_number;
			user.dob = dob;
			// user.image = image ? image:user.image;
			user.latitude = latitude ? latitude : user.latitude;
			user.longitude = longitude ? longitude : user.longitude;
			user.address = address ? address : user.address;

			await user.save();
			return _RS.api(
				res,
				true,
				'Profile Update Successfully',
				{ ...user._doc, update_email: true, update_mobile: false },
				startTime
			);		

		} catch (err) {
			next(err);
		}
	}

	/**
	 * @api {post} /api/app/auth/social-signup Social Signup
	 * @apiVersion 1.0.0
	 * @apiName social-sign-up
	 * @apiGroup Auth-Social
	 * @apiParam {String} country_code Country Code.
	 * @apiParam {String} mobile_number Mobile Number.
	 * @apiParam {String} email Email.
	 * @apiParam {String} name Name.
	 * @apiParam {String} login_type Login Type ("Email,Google,Facebook,Apple").
	 * @apiParam {String} social_id Social ID.
	 * @apiParam {String} device_token Device Token.
	 * @apiParam {String} device_type Device Type.
	 * @apiParam {String} social_image Social Image.
	 */

	static async socialSignUp(req, res, next) {
		const startTime = new Date().getTime();
		const {
			login_type,
			social_id,
			social_token,
			country_code,
			mobile_number,
			email,
			name,
			device_token,
			device_type,
			social_image,
		} = req.body;
		try {
			const existingUser = await User.findOne({ social_id: social_id });
			console.log('apple login', '---', existingUser);
			if (!!existingUser && login_type === 'Apple') {
				const payload = {
					_id: existingUser._id,
					email: existingUser.email,
					country_code: existingUser.country_code,
					mobile_number: existingUser.mobile_number,
					login_type: login_type,
					type: 'Customer',
				};

				const token = await Auth.getToken(payload, '30d', next);
				existingUser.device_token = device_token;
				existingUser.device_type = device_type;
				existingUser.social_id = social_id;
				await existingUser.save();

				return _RS.api(
					res,
					true,
					'Login success with ' + login_type,
					{ user: existingUser, token },
					startTime
				);
			}

			let getUserData: any = {
				type: USER_TYPE.customer,
			};

			if (!!email) {
				getUserData = {
					...getUserData,
					email: email,
				};
			}

			if (!!social_id) {
				getUserData = {
					...getUserData,
					social_id: social_id,
				};
			}

			const getUser = await User.findOne(getUserData);

			if (getUser) {
				const payload = {
					_id: getUser._id,
					email: getUser.email,
					country_code: getUser.country_code,
					mobile_number: getUser.mobile_number,
					login_type: login_type,
					type: 'Customer',
				};
				const token = await Auth.getToken(payload, '30d', next);
				getUser.device_token = device_token ? device_token : null;
				getUser.login_type = login_type ? login_type : getUser.login_type;
				getUser.image = social_image ? social_image : getUser.image;
				getUser.social_image = social_image;
				await getUser.save();

				return _RS.api(
					res,
					true,
					'Login success with ' + login_type,
					{ user: getUser, token },
					startTime
				);
			} else {
				const password = await Helper.generatePassword(8, {
					digits: true,
					lowercase: true,
					uppercase: true,
					symbols: true,
				});

				const user = await new User({
					name: name,
					email: email,
					login_type: login_type,
					social_id: social_id,
					social_token: social_token,
					country_code: country_code,
					mobile_number: mobile_number,
					device_token: device_token,
					device_type: device_type,
					password: await Auth.encryptPassword('Test@123'),
					type: 'Customer',
					is_otp_verify: true,
					image: social_image,
					social_image: social_image,
				}).save();

				const payload = {
					_id: user._id,
					email: user.email,
					country_code: user.country_code,
					mobile_number: user.mobile_number,
					type: user.type,
				};
				const token = await Auth.getToken(payload, '30d', next);

				const userData = await User.findOne({ _id: user._id });

				// Send Notification Start

				const notificationData = {
					type: 'social-register',
				};

				const notiTitle =
					'Welcome! You have successfully joined with ' + login_type;
				const notiDesription = 'A warm welcome on becoming part of our team';
				Helper.sendNotification(
					user.id,
					user.id,
					notiTitle,
					notiDesription,
					notificationData
				);
				// Send Notification End

				return _RS.api(
					res,
					true,
					'Signup success with ' + login_type,
					{ user: userData, token },
					startTime
				);
			}
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @api {post} /api/app/auth/verify/profile/change Verify Profile Change
	 * @apiVersion 1.0.0
	 * @apiName Verify Profile Change
	 * @apiGroup Auth
	 * @apiHeader {String} Authorization Pass jwt token.
	 * @apiParam {String} country_code Country Code.
	 * @apiParam {String} mobile_number Mobile Number.
	 * @apiParam {String} email email if want to update email .
	 * @apiParam {String} type (email,mobile).
	 * @apiParam {String} otp OTP.
	 */

	static async verifyEmailOrPhoneUpdate(req, res, next) {
		const startTime = new Date().getTime();

		const userId = req.user.id;

		const { country_code, mobile_number, otp, type, email } = req.body;

		try {
			const getUser = await User.findOne({
				_id: userId,
			});

			if (!getUser) {
				return _RS.api(res, false, 'User not exist with us', {}, startTime);
			} else {
				if (
					!!otp &&
					getUser.otp &&
					otp.toString() === getUser.otp?.toString()
				) {
					getUser.otp = null;

					if (type === 'email') {
						getUser.email = email ? email : getUser.email;
					}
					if (type === 'mobile') {
						getUser.mobile_number = mobile_number
							? +mobile_number
							: +getUser.mobile_number;
						getUser.country_code = +country_code
							? +country_code
							: +getUser.country_code;
					}

					await getUser.save();
					return _RS.api(
						res,
						true,
						'OTP has been verified successfully',
						getUser,
						startTime
					);
				} else {
					return _RS.api(
						res,
						false,
						'Invalid OTP, Please enter correct OTP',
						{},
						startTime
					);
				}
			}
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @api {post} /api/app/auth/profile/otp/resend Resend OTP For Profile Change
	 * @apiVersion 1.0.0
	 * @apiName Resend OTP For Profile Change
	 * @apiGroup Auth
	 * @apiHeader {String} Authorization Pass jwt token.
	 * @apiParam {String} mobile_number The mobile number (if mobile is updated).
	 * @apiParam {String} country_code The country code (if mobile is updated).
	 * @apiParam {String} email The email address (if email is updated)
	 */

	static async resentOtpOnPhoneOrEmailUpdate(req, res, next) {
		try {
			const { mobile_number, country_code, email } = req.body;

			const startTime = new Date().getTime();
			const userId = req.user.id;
			const type = req.params.type; //email or mobile
			const user = await User.findById(userId);

			const newOtp = (await Auth.generateOtp()).otp;

			user.otp = newOtp;
			user.otp_sent_on = new Date().getTime();
			await user.save();

			if (!!email) {
				// send email
				var emailTemplate = await EmailTemplate.findOne({
					slug: 'email-update-otp',
				});

				var replacedHTML = emailTemplate.description;
				replacedHTML = replacedHTML
					.replace('[NAME]', user.name || '')
					.replace('[OTP]', newOtp);

				const sentEmail = await MailHelper.sendMail(
					user.email,
					emailTemplate.title,
					replacedHTML
				);
			}

			if (mobile_number && country_code) {
				const to = country_code + mobile_number;
				const body = `Your New Otp is, ${user.otp}`;
				await Helper.sendSMS(to, body);
			}

			return _RS.api(res, true, 'Otp Resend Successfully', {}, startTime);
		} catch (error) {
			next(error);
		}
	}
}
