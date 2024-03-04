"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authentication_1 = require("../../Middlewares/Authentication");
const UserinfoController_1 = require("../../controllers/Admin/UserinfoController");
class UserInfoRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
    }
    post() {
        this.router.post("/add-edit", Authentication_1.default.admin, UserinfoController_1.UserInfoController.addEdit);
    }
    get() {
        this.router.get('/list', Authentication_1.default.admin, UserinfoController_1.UserInfoController.list);
        this.router.get('/status/:id', Authentication_1.default.admin, UserinfoController_1.UserInfoController.statusChange);
        this.router.get('/no-of-user', Authentication_1.default.admin, UserinfoController_1.UserInfoController.totalUser);
        this.router.get('/getuser/view/:id', Authentication_1.default.admin, UserinfoController_1.UserInfoController.viewUser);
        this.router.get("/withdrawal/change-status/:id", Authentication_1.default.admin, UserinfoController_1.UserInfoController.withdrawalStatusChange);
    }
}
exports.default = new UserInfoRouter().router;
