"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const user_type_enum_1 = require("../../constants/user-type.enum");
const Auth_1 = require("../../Utils/Auth");
const Helper_1 = require("../../helpers/Helper");
const MailHelper_1 = require("../../helpers/MailHelper");
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const User_1 = require("../../models/User");
const UserSetting_1 = require("../../models/UserSetting");
const EmailTemplate_1 = require("../../models/EmailTemplate");
const WalletSettings_1 = require("../../models/WalletSettings");
const HistorySetting_1 = require("../../models/HistorySetting");
const moment = require("moment");
const WinningWallet_1 = require("../../models/WinningWallet");
const { ObjectId } = require('mongodb');
class AuthController {
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
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { country_code, mobile_number, password, type, device_token, device_type, latitude, longitude, } = req.body;
            try {
                let existingUser = yield User_1.default.findOne({
                    mobile_number: mobile_number,
                    type: "Customer",
                    is_delete: false,
                });
                if (!existingUser) {
                    return ResponseHelper_1.default.api(res, false, 'User not exist, Please check the credentials', {}, startTime);
                }
                if (!existingUser.is_active) {
                    return ResponseHelper_1.default.api(res, false, 'Account Deactivated, Please contact to admin', {}, startTime);
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
                const isPasswordValid = yield Auth_1.default.comparePassword(password, existingUser.password);
                if (!isPasswordValid) {
                    return ResponseHelper_1.default.api(res, false, 'Invalid password, Please check the password', {}, startTime);
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
                const token = yield Auth_1.default.getToken(payload, '30d', next);
                const historyTime = moment(startTime).format('MMMM Do YYYY, h:mm:ss a');
                let historypayload = {
                    userId: existingUser._id,
                    type: "Login",
                    status: "Success",
                    message: `Your account has been login at ${historyTime}`
                };
                let createhistory = yield HistorySetting_1.default.create(historypayload);
                return ResponseHelper_1.default.api(res, true, 'Welcome! Login Successful', { token: token }, startTime);
            }
            catch (err) {
                next(err);
            }
        });
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
    static signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('user stay here', req.body);
            const startTime = new Date().getTime();
            const { mobile_number, password, type, country_code, referral_from_id, email, name } = req.body;
            try {
                const getUser = yield User_1.default.findOne({
                    mobile_number: mobile_number,
                });
                if (getUser) {
                    return ResponseHelper_1.default.api(res, false, 'User Already Exist', {}, startTime);
                }
                else {
                    const characters = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                    let randomString = '';
                    for (let i = 0; i < 8; i++) {
                        const randomIndex = Math.floor(Math.random() * characters.length);
                        randomString += characters.charAt(randomIndex);
                    }
                    const userpassword = yield Auth_1.default.encryptPassword(password);
                    const payload = {
                        country_code: country_code,
                        mobile_number: mobile_number,
                        type: type,
                        password: userpassword,
                        referral_from_id: referral_from_id,
                        referral_id: randomString,
                        email: email,
                        name: name,
                        login_type: User_1.LOGIN_TYPES[0],
                    };
                    if (referral_from_id && referral_from_id != "") {
                        let getUserByReferral = yield User_1.default.findOne({
                            referral_id: referral_from_id
                        });
                        console.log("referral_id============>>>>>>>>>>>.", referral_from_id, getUserByReferral);
                        if (!getUserByReferral) {
                            return ResponseHelper_1.default.api(res, false, 'Invite Code Is Invalid', {}, startTime);
                        }
                    }
                    let user = yield User_1.default.create(payload);
                    const walletPayload = {
                        userId: user._id,
                        balance: 0
                    };
                    let createWallet = yield WalletSettings_1.default.create(walletPayload);
                    const historyTime = moment(startTime).format('MMMM Do YYYY, h:mm:ss a');
                    let historypayload = {
                        userId: user._id,
                        type: "Register",
                        status: "Success",
                        message: `Your account has been register at ${historyTime}`
                    };
                    let winningObj = {
                        userId: user._id,
                        amount: 0
                    };
                    let createhistory = yield HistorySetting_1.default.create(historypayload);
                    let winning_wallet = yield WinningWallet_1.default.create(winningObj);
                    const tokenpayload = {
                        _id: user._id,
                        country_code: user.country_code,
                        mobile_number: user.mobile_number,
                        type: user.type,
                    };
                    const token = yield Auth_1.default.getToken(tokenpayload, "30d", next);
                    return ResponseHelper_1.default.api(res, true, 'User successfully register', { token: token }, startTime);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    static bankInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            let { _id } = req.user;
            const userId = new ObjectId(_id);
            try {
                let update = yield User_1.default.updateOne({ _id: userId }, { $set: { bank_info: req.body } });
                console.log("req.body=============>>>>>>>>>>.", update);
                if (update) {
                    return ResponseHelper_1.default.api(res, true, 'Bank Info Added successfully', {}, startTime);
                }
                else {
                    return ResponseHelper_1.default.api(res, false, 'Some error occurs', {}, startTime);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            let { _id } = req.user;
            const userId = new ObjectId(_id);
            try {
                let get = yield HistorySetting_1.default.find({ userId });
                if (get) {
                    return ResponseHelper_1.default.api(res, true, 'History found successfully', { history: get }, startTime);
                }
                else {
                    return ResponseHelper_1.default.api(res, false, 'Some error occurs', {}, startTime);
                }
            }
            catch (error) {
                next(error);
            }
        });
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
    static forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { country_code, mobile_number, type } = req.body;
            try {
                const getData = yield User_1.default.findOne({
                    country_code: country_code,
                    mobile_number: mobile_number,
                    type,
                    is_delete: false,
                });
                if (!getData) {
                    return ResponseHelper_1.default.api(res, false, 'User not exist with this mobile number', {}, startTime);
                }
                else {
                    const otp = yield Auth_1.default.generateOtp();
                    getData.otp = (yield Auth_1.default.generateOtp()).otp; // otp?.otp
                    yield getData.save();
                    return ResponseHelper_1.default.api(res, true, 'OTP has been sent to your mobile number', {}, startTime);
                }
            }
            catch (error) {
                next(error);
            }
        });
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
    static verifyOTP(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { country_code, mobile_number, type } = req.body;
            try {
                let user = yield User_1.default.findOne({
                    country_code: country_code,
                    mobile_number: mobile_number,
                    type,
                });
                if (!!user && (user === null || user === void 0 ? void 0 : user.is_delete) === true) {
                    return ResponseHelper_1.default.api(res, false, 'Deleted Account', {}, startTime);
                }
                if (user) {
                    if (user.is_otp_verify) {
                        return ResponseHelper_1.default.api(res, false, 'User mobile number is already exists', {}, startTime);
                    }
                    const otp = (yield Auth_1.default.generateOtp()).otp;
                    user.otp = otp;
                    yield user.save();
                    const to = user.country_code + user.mobile_number;
                    const body = `Welcome Customer, Your OTP is ${otp}.`;
                    yield Helper_1.default.sendSMS(to, body);
                    return ResponseHelper_1.default.api(res, true, 'OTP has been sent to your mobile number', user, startTime);
                }
                user = yield User_1.default.create({
                    country_code,
                    mobile_number,
                    type,
                    otp: 1234,
                    login_type: User_1.LOGIN_TYPES[0],
                });
                return ResponseHelper_1.default.api(res, true, 'OTP has been sent to your mobile number', user, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    /**
     * @api {post} /api/app/auth/reset-password Reset Password
     * @apiVersion 1.0.0
     * @apiName Reset Password
     * @apiGroup Auth
     * @apiHeader {String} Authorization Pass jwt token.
     * @apiParam {String} password Password.
     */
    static resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { password } = req.body;
            try {
                const getUser = yield User_1.default.findOne({
                    _id: req.user.id,
                    is_delete: false,
                });
                if (!getUser) {
                    return ResponseHelper_1.default.api(res, false, 'User not exist with this mobile number', {}, startTime);
                }
                const newPassword = yield Auth_1.default.encryptPassword(password);
                getUser.password = newPassword;
                getUser.otp = null;
                getUser.save();
                return ResponseHelper_1.default.api(res, true, 'Password has been updated changed successfully', {}, startTime);
            }
            catch (error) {
                next(error);
            }
        });
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
    static changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { old_password, password, onboarding } = req.body;
            try {
                const user = yield User_1.default.findOne({ _id: req.user.id });
                if (!user) {
                    return ResponseHelper_1.default.api(res, false, 'UserNotFound', {}, startTime);
                }
                if (!!old_password && !onboarding) {
                    const isPasswordValid = yield Auth_1.default.comparePassword(old_password, user.password);
                    if (!isPasswordValid) {
                        return ResponseHelper_1.default.api(res, false, 'INCORRECT PASSWORD', {}, startTime);
                    }
                }
                const newPassword = yield Auth_1.default.encryptPassword(password);
                const isPasswordSameAsOld = yield Auth_1.default.comparePassword(newPassword, user.password);
                if (isPasswordSameAsOld || old_password === password) {
                    return ResponseHelper_1.default.api(res, false, 'New Password Can not be same as one previously used, Please use a different one.', {}, startTime);
                }
                user.password = newPassword;
                user.otp = null;
                yield user.save();
                return ResponseHelper_1.default.api(res, true, 'PasswordChanged', {}, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @api {post} /api/app/auth/delete-account Delete Account
     * @apiVersion 1.0.0
     * @apiHeader {String} Authorization Pass jwt token.
     * @apiName Delete Account
     * @apiGroup Auth
     */
    static deleteAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const userId = req.user.id;
                const userProfile = yield User_1.default.findOne({ _id: userId });
                if (!userProfile) {
                    return ResponseHelper_1.default.api(res, false, 'UserNotFound', {}, startTime);
                }
                userProfile.is_delete = true;
                userProfile.is_active = false;
                userProfile.save();
                return ResponseHelper_1.default.api(res, true, 'Account Deleted Successfully', {}, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @api {get} /api/app/auth/get/setting Get Setting
     * @apiVersion 1.0.0
     * @apiHeader {String} Authorization Pass jwt token.
     * @apiName Get Setting
     * @apiGroup Auth
     */
    static getSetting(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const userId = req.user.id;
                const userSetting = yield UserSetting_1.default.findOne({ user_id: userId });
                return ResponseHelper_1.default.api(res, true, 'Setting Get Successfully', userSetting
                    ? userSetting
                    : {
                        all_notifications: true,
                        new_offer_notifications: true,
                        order_status_notifications: true,
                        setup_device_pin: false,
                    }, startTime);
            }
            catch (err) {
                next(err);
            }
        });
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
    static setting(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const userId = req.user.id;
                const user = yield User_1.default.findById(userId);
                const { all_notification, new_offer_notification, order_status_notification, setup_device_pin, device_pin, } = req.body;
                if (!user) {
                    return ResponseHelper_1.default.api(res, false, 'UserNotFound', {}, startTime);
                }
                const userSetting = yield UserSetting_1.default.findOne({
                    user_id: userId,
                    user_type: user_type_enum_1.USER_TYPE.customer,
                });
                const data = {
                    user_id: userId,
                    user_type: user_type_enum_1.USER_TYPE.customer,
                    all_notifications: all_notification,
                    new_offer_notifications: new_offer_notification,
                    order_status_notifications: order_status_notification,
                    setup_device_pin: setup_device_pin,
                    device_pin: !!device_pin ? device_pin : null,
                };
                if (!userSetting) {
                    const newUserSetting = yield new UserSetting_1.default(data).save();
                    return ResponseHelper_1.default.api(res, true, 'Settings Added Successfully', newUserSetting, startTime);
                }
                userSetting.all_notifications = all_notification;
                userSetting.new_offer_notifications = new_offer_notification;
                userSetting.order_status_notifications = order_status_notification;
                userSetting.setup_device_pin = setup_device_pin;
                userSetting.device_pin = !!device_pin ? device_pin : null;
                yield userSetting.save();
                return ResponseHelper_1.default.api(res, true, 'Settings Updated Successfully', userSetting, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    /**
     * @api {get} /api/app/auth/get-profile Get Profile
     * @apiVersion 1.0.0
     * @apiName Get Profile
     * @apiHeader {String} Authorization Pass jwt token.
     * @apiGroup Auth
     */
    static getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const getUser = yield User_1.default.findOne({ _id: req.user.id });
                if (!getUser) {
                    return ResponseHelper_1.default.api(res, false, 'User Not Found', {}, startTime);
                }
                return ResponseHelper_1.default.api(res, true, 'Profile Get', getUser, startTime);
            }
            catch (err) {
                next(err);
            }
        });
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
    static updateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const { name, gender, dob, language, latitude, longitude, address, country_code, mobile_number, email, } = req.body;
                const user = yield User_1.default.findOne({ _id: req.user.id });
                if (!user) {
                    return ResponseHelper_1.default.api(res, false, 'UserNotFound', {}, startTime);
                } // Replace with the mobile number or email you're checking
                // let userExistWithThisMailOrMobileNumber = await User.find({
                // 	$or: [
                // 		{ mobile_number: mobile_number },
                // 		{ email: email }
                // 	]
                // 	});
                // if(userExistWithThisMailOrMobileNumber.length>0){
                // 	return _RS.api(
                // 		res,
                // 		false,
                // 		'Email or Mobile Number Already Exist',
                // 		{},
                // 		startTime
                // 	);
                // }
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
                yield user.save();
                return ResponseHelper_1.default.api(res, true, 'Profile Update Successfully', Object.assign(Object.assign({}, user._doc), { update_email: true, update_mobile: false }), startTime);
            }
            catch (err) {
                next(err);
            }
        });
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
    static socialSignUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { login_type, social_id, social_token, country_code, mobile_number, email, name, device_token, device_type, social_image, } = req.body;
            try {
                const existingUser = yield User_1.default.findOne({ social_id: social_id });
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
                    const token = yield Auth_1.default.getToken(payload, '30d', next);
                    existingUser.device_token = device_token;
                    existingUser.device_type = device_type;
                    existingUser.social_id = social_id;
                    yield existingUser.save();
                    return ResponseHelper_1.default.api(res, true, 'Login success with ' + login_type, { user: existingUser, token }, startTime);
                }
                let getUserData = {
                    type: user_type_enum_1.USER_TYPE.customer,
                };
                if (!!email) {
                    getUserData = Object.assign(Object.assign({}, getUserData), { email: email });
                }
                if (!!social_id) {
                    getUserData = Object.assign(Object.assign({}, getUserData), { social_id: social_id });
                }
                const getUser = yield User_1.default.findOne(getUserData);
                if (getUser) {
                    const payload = {
                        _id: getUser._id,
                        email: getUser.email,
                        country_code: getUser.country_code,
                        mobile_number: getUser.mobile_number,
                        login_type: login_type,
                        type: 'Customer',
                    };
                    const token = yield Auth_1.default.getToken(payload, '30d', next);
                    getUser.device_token = device_token ? device_token : null;
                    getUser.login_type = login_type ? login_type : getUser.login_type;
                    getUser.image = social_image ? social_image : getUser.image;
                    getUser.social_image = social_image;
                    yield getUser.save();
                    return ResponseHelper_1.default.api(res, true, 'Login success with ' + login_type, { user: getUser, token }, startTime);
                }
                else {
                    const password = yield Helper_1.default.generatePassword(8, {
                        digits: true,
                        lowercase: true,
                        uppercase: true,
                        symbols: true,
                    });
                    const user = yield new User_1.default({
                        name: name,
                        email: email,
                        login_type: login_type,
                        social_id: social_id,
                        social_token: social_token,
                        country_code: country_code,
                        mobile_number: mobile_number,
                        device_token: device_token,
                        device_type: device_type,
                        password: yield Auth_1.default.encryptPassword('Test@123'),
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
                    const token = yield Auth_1.default.getToken(payload, '30d', next);
                    const userData = yield User_1.default.findOne({ _id: user._id });
                    // Send Notification Start
                    const notificationData = {
                        type: 'social-register',
                    };
                    const notiTitle = 'Welcome! You have successfully joined with ' + login_type;
                    const notiDesription = 'A warm welcome on becoming part of our team';
                    Helper_1.default.sendNotification(user.id, user.id, notiTitle, notiDesription, notificationData);
                    // Send Notification End
                    return ResponseHelper_1.default.api(res, true, 'Signup success with ' + login_type, { user: userData, token }, startTime);
                }
            }
            catch (error) {
                next(error);
            }
        });
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
    static verifyEmailOrPhoneUpdate(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const userId = req.user.id;
            const { country_code, mobile_number, otp, type, email } = req.body;
            try {
                const getUser = yield User_1.default.findOne({
                    _id: userId,
                });
                if (!getUser) {
                    return ResponseHelper_1.default.api(res, false, 'User not exist with us', {}, startTime);
                }
                else {
                    if (!!otp &&
                        getUser.otp &&
                        otp.toString() === ((_a = getUser.otp) === null || _a === void 0 ? void 0 : _a.toString())) {
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
                        yield getUser.save();
                        return ResponseHelper_1.default.api(res, true, 'OTP has been verified successfully', getUser, startTime);
                    }
                    else {
                        return ResponseHelper_1.default.api(res, false, 'Invalid OTP, Please enter correct OTP', {}, startTime);
                    }
                }
            }
            catch (error) {
                next(error);
            }
        });
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
    static resentOtpOnPhoneOrEmailUpdate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mobile_number, country_code, email } = req.body;
                const startTime = new Date().getTime();
                const userId = req.user.id;
                const type = req.params.type; //email or mobile
                const user = yield User_1.default.findById(userId);
                const newOtp = (yield Auth_1.default.generateOtp()).otp;
                user.otp = newOtp;
                user.otp_sent_on = new Date().getTime();
                yield user.save();
                if (!!email) {
                    // send email
                    var emailTemplate = yield EmailTemplate_1.default.findOne({
                        slug: 'email-update-otp',
                    });
                    var replacedHTML = emailTemplate.description;
                    replacedHTML = replacedHTML
                        .replace('[NAME]', user.name || '')
                        .replace('[OTP]', newOtp);
                    const sentEmail = yield MailHelper_1.default.sendMail(user.email, emailTemplate.title, replacedHTML);
                }
                if (mobile_number && country_code) {
                    const to = country_code + mobile_number;
                    const body = `Your New Otp is, ${user.otp}`;
                    yield Helper_1.default.sendSMS(to, body);
                }
                return ResponseHelper_1.default.api(res, true, 'Otp Resend Successfully', {}, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
