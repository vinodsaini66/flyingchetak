"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authentication_1 = require("../../Middlewares/Authentication");
const EmailTemplateController_1 = require("../../controllers/Admin/EmailTemplateController");
class EmailTemplateRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
    }
    post() {
        this.router.post('/add-edit/:id?', Authentication_1.default.admin, EmailTemplateController_1.EmailTemplateController.addEdit);
    }
    get() {
        this.router.get('/list', Authentication_1.default.admin, EmailTemplateController_1.EmailTemplateController.list);
        this.router.get('/status/:id', Authentication_1.default.admin, EmailTemplateController_1.EmailTemplateController.statusChange);
        this.router.get('/view/:id', Authentication_1.default.admin, EmailTemplateController_1.EmailTemplateController.view);
    }
}
exports.default = new EmailTemplateRouter().router;
