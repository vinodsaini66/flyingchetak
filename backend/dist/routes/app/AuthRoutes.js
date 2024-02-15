"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authentication_1 = require("../../Middlewares/Authentication");
const AuthController_1 = require("../../controllers/App/AuthController");
// import { HomeController } from "../../controllers/App/HomeController";
const AuthValidation_1 = require("../../validators/app/AuthValidation");
class AuthRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
    }
    post() {
        this.router.post('/login', AuthValidation_1.default.loginValidation, AuthController_1.AuthController.login);
        // Sign-up
        this.router.post('/sign-up', AuthValidation_1.default.signUpValidation, AuthController_1.AuthController.signUp);
        this.router.post('/add/bank', 
        // AuthValidation.signUpValidation,
        Authentication_1.default.user, AuthController_1.AuthController.bankInfo);
        this.router.post('/verify-otp', AuthValidation_1.default.verifyOTPValidation, AuthController_1.AuthController.verifyOTP);
        this.router.post('/reset-password', Authentication_1.default.user, AuthValidation_1.default.resetPasswordValidation, AuthController_1.AuthController.resetPassword);
        this.router.post('/update-profile', Authentication_1.default.user, AuthValidation_1.default.updateProfileValidation, 
        // upload.single('image'),
        // Authentication.userLanguage,
        AuthController_1.AuthController.updateProfile);
        this.router.post('/forgot-password', AuthValidation_1.default.forgotPasswordValidation, AuthController_1.AuthController.forgotPassword);
        this.router.post('/social-signup', 
        // AuthValidation.socialSignupValidation,
        AuthController_1.AuthController.socialSignUp);
        // Auth Routes
        this.router.post('/setting', Authentication_1.default.user, Authentication_1.default.userLanguage, AuthController_1.AuthController.setting);
        this.router.post('/change-password', Authentication_1.default.user, Authentication_1.default.userLanguage, AuthController_1.AuthController.changePassword);
        this.router.post('/delete-account', Authentication_1.default.user, AuthController_1.AuthController.deleteAccount);
        // this.router.post(
        //   "/send-update-otp",
        //   Authentication.user,
        //   AuthController.sendUpdateOTP,
        // );
        this.router.post('/verify/profile/change', Authentication_1.default.user, AuthController_1.AuthController.verifyEmailOrPhoneUpdate);
        this.router.post('/profile/otp/resend', Authentication_1.default.user, AuthController_1.AuthController.resentOtpOnPhoneOrEmailUpdate);
    }
    get() {
        this.router.get('/get/setting', Authentication_1.default.user, Authentication_1.default.userLanguage, AuthController_1.AuthController.getSetting);
        this.router.get('/get-profile', Authentication_1.default.user, Authentication_1.default.userLanguage, AuthController_1.AuthController.getProfile);
        this.router.get('/get/history', Authentication_1.default.user, AuthController_1.AuthController.getHistory
        // Authentication.userLanguage
        // HomeController.dashboard,
        );
    }
}
exports.default = new AuthRoutes().router;
