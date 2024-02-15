"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authentication_1 = require("../../Middlewares/Authentication");
const ReferralController_1 = require("../../controllers/App/ReferralController");
class ReferralRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
    }
    post() {
    }
    get() {
        this.router.get("/request/data", Authentication_1.default.user, 
        // TransactioValidation.withdrawaltValidation,
        ReferralController_1.ReferralController.getPromotionsData);
    }
}
exports.default = new ReferralRoutes().router;
