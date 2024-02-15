"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authentication_1 = require("../../Middlewares/Authentication");
const TransactionController_1 = require("../../controllers/Admin/TransactionController");
class AdminInfoRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
    }
    post() {
        this.router.get("/get/by-user-id/:id", Authentication_1.default.admin, TransactionController_1.TransactionController.getTransactionByUserId);
    }
    get() {
        this.router.get("/get", Authentication_1.default.admin, TransactionController_1.TransactionController.getTransaction);
    }
}
exports.default = new AdminInfoRouter().router;
