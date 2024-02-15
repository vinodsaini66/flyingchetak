"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CommonRoutes_1 = require("./CommonRoutes");
const AdminSettingsRouter_1 = require("./admin/AdminSettingsRouter");
const AuthRouter_1 = require("./admin/AuthRouter");
const DashboardRoutes_1 = require("./admin/DashboardRoutes");
const EmailTemplateRouter_1 = require("./admin/EmailTemplateRouter");
const TransactionRoutes_1 = require("./admin/TransactionRoutes");
const UserInfoRouter_1 = require("./admin/UserInfoRouter");
const WithdrawalManagementRouter_1 = require("./admin/WithdrawalManagementRouter");
const AuthRoutes_1 = require("./app/AuthRoutes");
const GameRoutes_1 = require("./app/GameRoutes");
const ReferralRoutes_1 = require("./app/ReferralRoutes");
const SettingRoutes_1 = require("./app/SettingRoutes");
const TransactionRoutes_2 = require("./app/TransactionRoutes");
const WalletRoutes_1 = require("./app/WalletRoutes");
const ChannelRouter_1 = require("./admin/ChannelRouter");
const ChannelRoutes_1 = require("./app/ChannelRoutes");
class Routes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.app();
        this.admin();
        this.common();
    }
    app() {
        this.router.use('/app/auth', AuthRoutes_1.default);
        this.router.use('/app/wallet', WalletRoutes_1.default);
        this.router.use('/app/game', GameRoutes_1.default);
        this.router.use('/app/transactions', TransactionRoutes_2.default);
        this.router.use('/app/referral', ReferralRoutes_1.default);
        this.router.use('/app/setting', SettingRoutes_1.default);
        this.router.use('/app/channel', ChannelRoutes_1.default);
    }
    admin() {
        this.router.use('/admin/auth', AuthRouter_1.default);
        this.router.use('/admin/email-template', EmailTemplateRouter_1.default);
        this.router.use('/admin/setting', AdminSettingsRouter_1.default);
        this.router.use('/admin/user-info-router', UserInfoRouter_1.default);
        this.router.use('/admin/withdrawal', WithdrawalManagementRouter_1.default);
        this.router.use('/admin/transaction', TransactionRoutes_1.default);
        this.router.use('/admin/dashboard', DashboardRoutes_1.default);
        this.router.use('/admin/channel', ChannelRouter_1.default);
    }
    common() {
        this.router.use('/common', CommonRoutes_1.default);
    }
}
exports.default = new Routes().router;
