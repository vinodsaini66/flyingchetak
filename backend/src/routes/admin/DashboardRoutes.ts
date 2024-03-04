import { Router } from "express";
import Authentication from "../../Middlewares/Authentication";
import { DashboardController } from "../../controllers/Admin/DashboardController";

class DashboardRoutes {
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
        "/get",
        Authentication.admin,
        DashboardController.dashboardData
      );
      this.router.get(
        "/box-data/get",
        // Authentication.admin,
        DashboardController.dashboardBoxData
      );
  }
  
}

export default new DashboardRoutes().router;
