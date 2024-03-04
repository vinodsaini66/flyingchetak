"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authentication_1 = require("../../Middlewares/Authentication");
const DashboardController_1 = require("../../controllers/Admin/DashboardController");
class DashboardRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
    }
    post() {
    }
    get() {
        this.router.get("/get", Authentication_1.default.admin, DashboardController_1.DashboardController.dashboardData);
        this.router.get("/box-data/get", 
        // Authentication.admin,
        DashboardController_1.DashboardController.dashboardBoxData);
    }
}
exports.default = new DashboardRoutes().router;
