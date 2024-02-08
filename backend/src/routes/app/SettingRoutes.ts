import { Router } from "express";

import Authentication from "../../Middlewares/Authentication";
import { AdminSettingController } from "../../controllers/Admin/SettingController";

class SettingRoutes {
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
        // Authentication.user,
        // TransactioValidation.withdrawaltValidation,
        AdminSettingController.get,
      );
  }
}

export default new SettingRoutes().router;