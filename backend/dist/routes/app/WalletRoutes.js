"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authentication_1 = require("../../Middlewares/Authentication");
// import { HomeController } from "../../controllers/App/HomeController";
const WalletValidation_1 = require("../../validators/app/WalletValidation");
const WalletController_1 = require("../../controllers/App/WalletController");
class WalletRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
    }
    post() {
        // this.router.post(
        //   "/update/Wallet-Balance",
        //   Authentication.user,
        //   WalletValidation.BalanceaddValidation,
        //   WalletController.addbalance,
        // );
        this.router.post("/request/balance-via-third-party", Authentication_1.default.user, WalletValidation_1.default.BalanceaddValidation, WalletController_1.WalletController.requestBalanceViaThirdParty);
    }
    get() {
        this.router.get("/get/wallet-balance", Authentication_1.default.user, WalletController_1.WalletController.getBalance);
        this.router.get("/get/winning-balance", Authentication_1.default.user, WalletController_1.WalletController.getWinningWalletBalance);
        this.router.get("/add/balance-via-third-party", 
        // Authentication.user,
        // WalletValidation.BalanceaddValidation,
        WalletController_1.WalletController.addBalanceViaThirdParty);
    }
}
exports.default = new WalletRoutes().router;
