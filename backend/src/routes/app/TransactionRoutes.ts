import { Router } from "express";

import Authentication from "../../Middlewares/Authentication";
import { WalletController } from "../../controllers/App/WalletController";
import TransactioValidation from "../../validators/app/TransactionValidation";
import { TransactionController } from "../../controllers/App/TransactionController";

class TransactionRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
  }

  public post() {
    this.router.post(
      "/get-transactions",
      Authentication.user,
      TransactioValidation.transactionGetValidation,
      TransactionController.getTransaction,
    );
    this.router.post(
      "/request/withdrawal",
      Authentication.user,
      TransactioValidation.withdrawaltValidation,
      TransactionController.addWithdrawal,
    );



  }

  public get() {
  }
}

export default new TransactionRoute().router;