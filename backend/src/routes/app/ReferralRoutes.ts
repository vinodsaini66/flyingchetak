import { Router } from "express";

import Authentication from "../../Middlewares/Authentication";
import { ReferralController } from "../../controllers/App/ReferralController";

class ReferralRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
  }

  public post() {
  }

  public get() {
    this.router.get(
        "/request/data",
        Authentication.user,
        // TransactioValidation.withdrawaltValidation,
        ReferralController.getPromotionsData,
      );
  }
}

export default new ReferralRoutes().router;