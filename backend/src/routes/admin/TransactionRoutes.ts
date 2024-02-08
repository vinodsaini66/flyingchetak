import { Router } from "express";
import Authentication from "../../Middlewares/Authentication";
import { TransactionController } from "../../controllers/Admin/TransactionController";

class AdminInfoRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
  }

  public post() {
    this.router.get(
      "/get/by-user-id/:id",
      Authentication.admin,
      TransactionController.getTransactionByUserId
    );
  }
  public get() {
      this.router.get(
        "/get",
        Authentication.admin,
        TransactionController.getTransaction
      );
      

  }
}

export default new AdminInfoRouter().router;
