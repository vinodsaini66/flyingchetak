"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SettingController_1 = require("../../controllers/Admin/SettingController");
class SettingRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
    }
    post() {
    }
    get() {
        this.router.get("/request/data", 
        // Authentication.user,
        // TransactioValidation.withdrawaltValidation,
        SettingController_1.AdminSettingController.get);
    }
}
exports.default = new SettingRoutes().router;
