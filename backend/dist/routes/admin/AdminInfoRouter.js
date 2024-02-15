"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authentication_1 = require("../../Middlewares/Authentication");
const AdminInfoController_1 = require("../../controllers/Admin/AdminInfoController");
class AdminInfoRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
    }
    post() {
        this.router.post("/update", Authentication_1.default.admin, AdminInfoController_1.AdminInfController.updateDetails);
    }
    get() {
        this.router.get("/get", Authentication_1.default.admin, AdminInfoController_1.AdminInfController.getDetails);
    }
}
exports.default = new AdminInfoRouter().router;
