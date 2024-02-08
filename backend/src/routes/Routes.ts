import { Router } from 'express';

import CommonRoutes from './CommonRoutes';

import AdminSettingsRouter from './admin/AdminSettingsRouter';
import AuthRouter from './admin/AuthRouter';
import DashboardRoutes from './admin/DashboardRoutes';
import EmailTemplateRouter from './admin/EmailTemplateRouter';
import Transaction from './admin/TransactionRoutes';
import UserInfoRouter from './admin/UserInfoRouter';
import Withdrawal from './admin/WithdrawalManagementRouter';

import AuthRoutes from './app/AuthRoutes';
import GameRoutes from './app/GameRoutes';
import ReferralRoutes from './app/ReferralRoutes';
import SettingRoutes from './app/SettingRoutes';
import TransactionRoutes from './app/TransactionRoutes';
import WalletRoutes from './app/WalletRoutes';
import ChannelRouter from './admin/ChannelRouter';
import ChannelRoutes from './app/ChannelRoutes';

class Routes {
	public router: Router;
	constructor() {
		this.router = Router();
		this.app();
		this.admin();
		this.common();
	}

	app() {
		this.router.use('/app/auth', AuthRoutes);
		this.router.use('/app/wallet', WalletRoutes);
		this.router.use('/app/game', GameRoutes);
		this.router.use('/app/transactions', TransactionRoutes);
		this.router.use('/app/referral', ReferralRoutes);
		this.router.use('/app/setting', SettingRoutes);
		this.router.use('/app/channel', ChannelRoutes);
	}

	admin() {
		this.router.use('/admin/auth', AuthRouter);
		this.router.use('/admin/email-template', EmailTemplateRouter);
		this.router.use('/admin/setting', AdminSettingsRouter);
		this.router.use('/admin/user-info-router', UserInfoRouter);
		this.router.use('/admin/withdrawal', Withdrawal);
		this.router.use('/admin/transaction', Transaction);
		this.router.use('/admin/dashboard', DashboardRoutes);
		this.router.use('/admin/channel', ChannelRouter);
	}

	common() {
		this.router.use('/common', CommonRoutes);
	}
}
export default new Routes().router;
