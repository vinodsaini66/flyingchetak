"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authentication_1 = require("../../Middlewares/Authentication");
const ChannelController_1 = require("../../controllers/Admin/ChannelController");
class ChannelRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
    }
    post() {
        this.router.post("/add", Authentication_1.default.admin, ChannelController_1.ChannelController.AddChannel);
        this.router.post("/remove", Authentication_1.default.admin, ChannelController_1.ChannelController.DeleteChannel);
    }
    get() {
        this.router.get("/get", Authentication_1.default.admin, ChannelController_1.ChannelController.getChannels);
    }
}
exports.default = new ChannelRouter().router;
