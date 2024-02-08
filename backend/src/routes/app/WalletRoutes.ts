import { Router } from "express";

import Authentication from "../../Middlewares/Authentication";
import { AuthController } from "../../controllers/App/AuthController";
// import { HomeController } from "../../controllers/App/HomeController";
import WalletValidation from "../../validators/app/WalletValidation";
import { WalletController } from "../../controllers/App/WalletController";

class WalletRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
  }

  public post() {
   
    // this.router.post(
    //   "/update/Wallet-Balance",
    //   Authentication.user,
    //   WalletValidation.BalanceaddValidation,
    //   WalletController.addbalance,
    // );
   
    this.router.post(
      "/request/balance-via-third-party",
      Authentication.user,
      WalletValidation.BalanceaddValidation,
      WalletController.requestBalanceViaThirdParty,
    );
    

  }

  public get() {
    this.router.get(
      "/get/wallet-balance",
      Authentication.user,
      WalletController.getBalance,
    );
    this.router.get(
      "/get/winning-balance",
      Authentication.user,
      WalletController.getWinningWalletBalance,
    );
    this.router.get(
      "/add/balance-via-third-party",
      // Authentication.user,
      // WalletValidation.BalanceaddValidation,
      WalletController.addBalanceViaThirdParty,
    );
  
  }
}

export default new WalletRoutes().router;