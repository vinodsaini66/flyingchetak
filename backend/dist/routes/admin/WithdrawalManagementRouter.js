"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authentication_1 = require("../../Middlewares/Authentication");
const WithdawalController_1 = require("../../controllers/Admin/WithdawalController");
class Withdrawal {
    constructor() {
        this.router = (0, express_1.Router)();
        this.delete();
        this.post();
        this.get();
    }
    delete() {
    }
    post() {
        this.router.post('/change/status', Authentication_1.default.admin, WithdawalController_1.WithdrawalController._changeStatus);
    }
    get() {
        this.router.get('/get', Authentication_1.default.admin, WithdawalController_1.WithdrawalController.get);
    }
}
exports.default = new Withdrawal().router;
