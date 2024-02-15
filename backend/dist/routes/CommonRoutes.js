"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FileUploadMiddleware_1 = require("../Middlewares/FileUploadMiddleware");
const CommonController_1 = require("../controllers/CommonController");
class CommonRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
    }
    post() {
        this.router.post('/image-upload', FileUploadMiddleware_1.default.upload, CommonController_1.CommonController.uploadImage);
        this.router.post('/pdf-upload', FileUploadMiddleware_1.default.upload, CommonController_1.CommonController.uploadDocument);
    }
    get() {
        this.router.get('/app-setting', CommonController_1.CommonController.appSetting);
        this.router.post('/country-list', CommonController_1.CommonController.countryList);
        this.router.post('/state-list', CommonController_1.CommonController.stateList);
        this.router.post('/city-list', CommonController_1.CommonController.cityList);
        this.router.get('/banner/:type?', CommonController_1.CommonController.banner);
        this.router.get('/content/:slug', CommonController_1.CommonController.content);
        this.router.get('/customer', CommonController_1.CommonController.customer);
        // this.router.
    }
}
exports.default = new CommonRoutes().router;
