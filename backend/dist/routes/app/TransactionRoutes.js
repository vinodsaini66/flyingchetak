"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authentication_1 = require("../../Middlewares/Authentication");
const TransactionValidation_1 = require("../../validators/app/TransactionValidation");
const TransactionController_1 = require("../../controllers/App/TransactionController");
class TransactionRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
    }
    post() {
        this.router.post("/get-transactions", Authentication_1.default.user, TransactionValidation_1.default.transactionGetValidation, TransactionController_1.TransactionController.getTransaction);
        this.router.post("/request/withdrawal", Authentication_1.default.user, TransactionValidation_1.default.withdrawaltValidation, TransactionController_1.TransactionController.addWithdrawal);
    }
    get() {
    }
}
exports.default = new TransactionRoute().router;
