import { Router } from "express";
import Authentication from "../../Middlewares/Authentication";
import { AdminInfController } from "../../controllers/Admin/AdminInfoController";

class AdminInfoRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
  }

  public post() {
    this.router.post("/update", Authentication.admin, AdminInfController.updateDetails);
    
  }
  public get() {
    this.router.get(
        "/get",
        Authentication.admin,
        AdminInfController.getDetails
      );
  }
}

export default new AdminInfoRouter().router;
