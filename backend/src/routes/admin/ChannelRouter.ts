import { Router } from "express";
import Authentication from "../../Middlewares/Authentication";
import { TransactionController } from "../../controllers/Admin/TransactionController";
import { ChannelController } from "../../controllers/Admin/ChannelController";

class ChannelRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
  }

  public post() {
    this.router.post(
      "/add",
      Authentication.admin,
      ChannelController.AddChannel
    );
    this.router.post(
      "/remove",
      Authentication.admin,
      ChannelController.DeleteChannel
    );
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
