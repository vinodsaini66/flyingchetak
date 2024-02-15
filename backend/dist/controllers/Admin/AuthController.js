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
const express = require('express');
const Auth_1 = require("../../Utils/Auth");
const user_type_enum_1 = require("../../constants/user-type.enum");
const MailHelper_1 = require("../../helpers/MailHelper");
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const AppSetting_1 = require("../../models/AppSetting");
const EmailTemplate_1 = require("../../models/EmailTemplate");
const User_1 = require("../../models/User");
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
class AuthController {
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { email, password } = req.body;
            try {
                let isUserExist = yield User_1.default.findOne({
                    email: email,
                    type: { $in: [user_type_enum_1.USER_TYPE.admin] },
                });
                if (!isUserExist) {
                    return ResponseHelper_1.default.notFound(res, 'NOTFOUND', "Email address doesn't exists with us", isUserExist, startTime);
                }
                const isPasswordValid = yield Auth_1.default.comparePassword(password, isUserExist.password);
                if (!isPasswordValid) {
                    return ResponseHelper_1.default.badRequest(res, 'BAD REQUEST', 'Invalid password', {}, startTime);
                }
                const payload = {
                    id: isUserExist._id,
                    email: isUserExist.email,
                    type: isUserExist.type,
                };
                const token = yield Auth_1.default.getToken(payload, '1d', next);
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'Welcome! Login Successfully', { user: isUserExist, token }, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { email, password, name, country_code, mobile_number } = req.body;
            try {
                let user = yield User_1.default.findOne({
                    // $and: [{ email: email }, { type: "ServiceProvider" }],
                    $and: [{ email: email }],
                });
                if (!user) {
                    user = yield User_1.default.create({
                        email: 'serviceProvider@yopmail.com',
                        password: yield Auth_1.default.encryptPassword('Test@123'),
                        name: 'Sub Admin',
                        country_code: '91',
                        type: 'Admin',
                        mobile_number: '9632587412',
                    });
                    return ResponseHelper_1.default.created(res, 'CREATED', 'SignUp Sucessfully');
                }
                return ResponseHelper_1.default.conflict(res, 'CONFLICT', 'User already exist with this email', user, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                let getAdmin = yield User_1.default.findOne({
                    _id: req.user.id,
                });
                if (!getAdmin) {
                    return ResponseHelper_1.default.notFound(res, 'NOTFOUND', 'User not exist, go to signup page', getAdmin, startTime);
                }
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'Get Profile Successfully', getAdmin, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { old_password, new_password } = req.body;
            try {
                const admin = yield User_1.default.findById(req.user.id);
                const isPasswordCurrentCorrect = yield Auth_1.default.comparePassword(old_password, admin.password);
                if (!isPasswordCurrentCorrect) {
                    return ResponseHelper_1.default.badRequest(res, 'BAD REQUEST', 'Old password does not match', {}, startTime);
                    // return next(
                    //   new AppError("Old password does not match", RESPONSE.HTTP_BAD_REQUEST)
                    // );
                }
                const isSamePassword = yield Auth_1.default.comparePassword(new_password, admin.password);
                if (isSamePassword) {
                    return ResponseHelper_1.default.badRequest(res, 'BAD REQUEST', 'New password cannot be the same as the old password', {}, startTime);
                }
                const encryptedPassword = yield Auth_1.default.encryptPassword(new_password);
                admin.password = encryptedPassword;
                yield admin.save();
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'New Password Set Successfully', {}, startTime);
                // res.status(RESPONSE.HTTP_OK).json({
                //   status: RESPONSE.HTTP_OK,
                //   message: "password changed successfully",
                //   data: {},
                // });
            }
            catch (err) {
                next(err);
            }
        });
    }
    static updateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { email, name } = req.body;
            // const image = req.file.filename
            try {
                let getAdmin = yield User_1.default.findOne({
                    _id: req.user.id,
                });
                if (!getAdmin) {
                    return ResponseHelper_1.default.notFound(res, 'NOTFOUND', 'User not exist , go to signup page', getAdmin, new Date().getTime());
                }
                (getAdmin.name = name ? name : getAdmin.name),
                    (getAdmin.email = email ? email : getAdmin.email),
                    // (getAdmin.image = image ? image : getAdmin.image),
                    getAdmin.save();
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'Update Profile Successfully', getAdmin, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            try {
                let admin = yield User_1.default.findOne({
                    email,
                    type: { $in: [user_type_enum_1.USER_TYPE.admin] },
                });
                if (!admin) {
                    let msg = 'Email address is not exists with us. Please check again';
                    return ResponseHelper_1.default.notFound(res, 'SUCCESS', msg, admin, new Date().getTime());
                }
                const otp = yield Auth_1.default.generateOtp();
                admin.otp = otp.otp;
                const savedAdmin = yield admin.save();
                var emailTemplate = yield EmailTemplate_1.default.findOne({
                    slug: 'forgot-password',
                });
                var replacedHTML = emailTemplate.description;
                replacedHTML = replacedHTML.replace('[NAME]', admin.name || '');
                replacedHTML = replacedHTML.replace('[OTP]', admin.otp || '');
                yield MailHelper_1.default.sendMail(admin.email, emailTemplate.title, replacedHTML);
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'OTP has been sent to your email, please check your inbox', {}, new Date().getTime());
            }
            catch (error) {
                next(error);
            }
        });
    }
    static verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const otp = req.body.otp;
            try {
                let admin = yield User_1.default.findOne({
                    email: email,
                    type: { $in: [user_type_enum_1.USER_TYPE.admin] },
                });
                if (!admin) {
                    return ResponseHelper_1.default.notFound(res, 'NOTFOUND', 'not found', {}, new Date().getTime());
                }
                if (admin.otp != otp) {
                    return ResponseHelper_1.default.badRequest(res, 'BAD REQUEST', 'Invalid OTP', {}, new Date().getTime());
                }
                admin.otp = null;
                admin.otp_expiry_time = null;
                admin.save();
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'Please check mail id , send otp on mail', {}, new Date().getTime());
            }
            catch (error) {
                next(error);
            }
        });
    }
    static resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                let user = yield User_1.default.findOne({
                    email: email,
                    type: { $in: [user_type_enum_1.USER_TYPE.admin] },
                });
                if (!user) {
                    let msg = 'User not found';
                    return ResponseHelper_1.default.notFound(res, 'notFound', msg, {}, new Date().getTime());
                }
                user.password = yield Auth_1.default.encryptPassword(password);
                yield user.save();
                let msg = 'Password changed successfully.';
                return ResponseHelper_1.default.ok(res, 'SUCCESS', msg, {}, new Date().getTime());
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateAppSetting(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const { app_store_url, play_store_url, android_version, ios_version, android_share_content, ios_share_content, } = req.body;
            try {
                let getSetting = yield AppSetting_1.default.findById('64e5d2fa6f079edbe3800654');
                if (!getSetting) {
                    return ResponseHelper_1.default.notFound(res, 'NOTFOUND', 'Setting not found', getSetting, startTime);
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
                return ResponseHelper_1.default.ok(res, 'SUCCESS', 'App setting has been successfully', getSetting, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.AuthController = AuthController;
