import { Router } from "express";
import { AdminSettingController } from "../../controllers/Admin/SettingController";
// import { AdminSettingsController } from "../../controllers/Admin/AdminSettingsController";
import Authentication from "../../Middlewares/Authentication";

class AdminSettingRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
  }

  public post() {
    this.router.post(
      "/update",
      Authentication.admin,
      AdminSettingController.update
    );
  }
  public get() {
    this.router.get("/get", Authentication.admin, AdminSettingController.get);
  }
}

export default new AdminSettingRouter().router;
