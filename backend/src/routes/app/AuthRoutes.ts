import { Router } from 'express';

import Authentication from '../../Middlewares/Authentication';
import { AuthController } from '../../controllers/App/AuthController';
// import { HomeController } from "../../controllers/App/HomeController";
import AuthValidation from '../../validators/app/AuthValidation';
import { upload } from '../../Middlewares/MulterMiddleware';

class AuthRoutes {
	public router: Router;

	constructor() {
		this.router = Router();
		this.post();
		this.get();
	}

	public post() {
		this.router.post(
			'/login',
			AuthValidation.loginValidation,
			AuthController.login
		);

		// Sign-up
		this.router.post(
			'/sign-up',
			AuthValidation.signUpValidation,
			AuthController.signUp
		);
		this.router.post(
			'/add/bank',
			// AuthValidation.signUpValidation,
			Authentication.user,
			AuthController.bankInfo
		);
		this.router.post(
			'/verify-otp',
			AuthValidation.verifyOTPValidation,
			AuthController.verifyOTP
		);
		this.router.post(
			'/reset-password',
			Authentication.user,
			AuthValidation.resetPasswordValidation,
			AuthController.resetPassword
		);

		this.router.post(
			'/update-profile',
			Authentication.user,
			AuthValidation.updateProfileValidation,
			// upload.single('image'),
			// Authentication.userLanguage,
			AuthController.updateProfile
		);
		this.router.post(
			'/forgot-password',
			AuthValidation.forgotPasswordValidation,
			AuthController.forgotPassword
		);
		this.router.post(
			'/social-signup',
			// AuthValidation.socialSignupValidation,
			AuthController.socialSignUp
		);

		// Auth Routes
		this.router.post(
			'/setting',
			Authentication.user,
			Authentication.userLanguage,
			AuthController.setting
		);
		this.router.post(
			'/change-password',
			Authentication.user,
			Authentication.userLanguage,
			AuthController.changePassword
		);
		this.router.post(
			'/delete-account',
			Authentication.user,
			AuthController.deleteAccount
		);

		// this.router.post(
		//   "/send-update-otp",
		//   Authentication.user,
		//   AuthController.sendUpdateOTP,
		// );

		this.router.post(
			'/verify/profile/change',
			Authentication.user,
			AuthController.verifyEmailOrPhoneUpdate
		);

		this.router.post(
			'/profile/otp/resend',
			Authentication.user,
			AuthController.resentOtpOnPhoneOrEmailUpdate
		);
	}

	public get() {
		this.router.get(
			'/get/setting',
			Authentication.user,
			Authentication.userLanguage,
			AuthController.getSetting
		);

		this.router.get(
			'/get-profile',
			Authentication.user,
			Authentication.userLanguage,
			AuthController.getProfile
		);
		this.router.get(
			'/get/history',
			Authentication.user,
			AuthController.getHistory
			// Authentication.userLanguage
			// HomeController.dashboard,
		);
	}
}

export default new AuthRoutes().router;
