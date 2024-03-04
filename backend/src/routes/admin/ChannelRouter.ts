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
    this.router.post(
      "/add-edit",
      Authentication.admin,
      ChannelController.AddEditUtr
    );
    this.router.post(
      "/utr/check_order_status",
      Authentication.admin,
      ChannelController.CheckStatusViaUtr
    );
  }
  public get() {
      this.router.get(
        "/get",
        Authentication.admin,
        ChannelController.getChannels
      );
      this.router.get(
        "/get-utr",
        Authentication.admin,
        ChannelController.getUtr
      );

  }
}
export default new ChannelRouter().router;
