"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SettingController_1 = require("../../controllers/Admin/SettingController");
// import { AdminSettingsController } from "../../controllers/Admin/AdminSettingsController";
const Authentication_1 = require("../../Middlewares/Authentication");
class AdminSettingRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
    }
    post() {
        this.router.post("/update", Authentication_1.default.admin, SettingController_1.AdminSettingController.update);
    }
    get() {
        this.router.get("/get", Authentication_1.default.admin, SettingController_1.AdminSettingController.get);
    }
}
exports.default = new AdminSettingRouter().router;
