import { Router } from "express";
import Authentication from "../../Middlewares/Authentication";
import { ChannelController } from "../../controllers/Admin/ChannelController";

class ChannelRouter {
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
        ChannelController.getChannels
      );

  }
}
export default new ChannelRouter().router;
