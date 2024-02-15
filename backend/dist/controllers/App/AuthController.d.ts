export declare class AuthController {
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
    static login(req: any, res: any, next: any): Promise<void>;
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
    static signUp(req: any, res: any, next: any): Promise<void>;
    static bankInfo(req: any, res: any, next: any): Promise<void>;
    static getHistory(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {post} /api/app/auth/forgot-password Forgot Password
     * @apiVersion 1.0.0
     * @apiName Forgot Password
     * @apiGroup Auth
     * @apiParam {String} country_code Country Code.
     * @apiParam {String} mobile_number Mobile Number.
     * @apiParam {String} type User Type ("Customer, ServiceProvider").
     */
    static forgotPassword(req: any, res: any, next: any): Promise<void>;
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
    static verifyOTP(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {post} /api/app/auth/reset-password Reset Password
     * @apiVersion 1.0.0
     * @apiName Reset Password
     * @apiGroup Auth
     * @apiHeader {String} Authorization Pass jwt token.
     * @apiParam {String} password Password.
     */
    static resetPassword(req: any, res: any, next: any): Promise<void>;
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
    static changePassword(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {post} /api/app/auth/delete-account Delete Account
     * @apiVersion 1.0.0
     * @apiHeader {String} Authorization Pass jwt token.
     * @apiName Delete Account
     * @apiGroup Auth
     */
    static deleteAccount(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {get} /api/app/auth/get/setting Get Setting
     * @apiVersion 1.0.0
     * @apiHeader {String} Authorization Pass jwt token.
     * @apiName Get Setting
     * @apiGroup Auth
     */
    static getSetting(req: any, res: any, next: any): Promise<void>;
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
    static setting(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {get} /api/app/auth/get-profile Get Profile
     * @apiVersion 1.0.0
     * @apiName Get Profile
     * @apiHeader {String} Authorization Pass jwt token.
     * @apiGroup Auth
     */
    static getProfile(req: any, res: any, next: any): Promise<void>;
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
    static updateProfile(req: any, res: any, next: any): Promise<void>;
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
    static socialSignUp(req: any, res: any, next: any): Promise<void>;
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
    static verifyEmailOrPhoneUpdate(req: any, res: any, next: any): Promise<void>;
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
    static resentOtpOnPhoneOrEmailUpdate(req: any, res: any, next: any): Promise<void>;
}
