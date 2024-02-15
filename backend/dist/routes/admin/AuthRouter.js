"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../../controllers/Admin/AuthController");
const Authentication_1 = require("../../Middlewares/Authentication");
class AuthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.delete();
        this.post();
        this.get();
    }
    delete() {
        // this.router.delete(
        //   "/delete/entire", Authentication.admin, AuthController.cleanupData
        // )
    }
    post() {
        this.router.post('/login', AuthController_1.AuthController.login);
        this.router.post('/sign-up', AuthController_1.AuthController.signUp);
        this.router.post('/change-password', Authentication_1.default.admin, AuthController_1.AuthController.changePassword);
        this.router.post('/update-profile', Authentication_1.default.admin, AuthController_1.AuthController.updateProfile);
        this.router.post('/forgot-password', AuthController_1.AuthController.forgotPassword);
        this.router.post('/reset-password', AuthController_1.AuthController.resetPassword);
        this.router.post('/verify-otp', AuthController_1.AuthController.verifyOtp);
        this.router.post('/update-app-setting', Authentication_1.default.admin, AuthController_1.AuthController.updateAppSetting);
        // this.router.post("/clean-up", Authentication.admin, AuthController.cleanupData)
    }
    get() {
        this.router.get('/get-profile', Authentication_1.default.admin, AuthController_1.AuthController.getProfile);
    }
}
exports.default = new AuthRouter().router;
