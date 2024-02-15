"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonController = void 0;
const FileUpload_1 = require("../helpers/FileUpload");
const ResponseHelper_1 = require("../helpers/ResponseHelper");
const AppSetting_1 = require("../models/AppSetting");
// import Banner from "../models/Banner";
// import CarBrand from "../models/CarBrand";
// import CarModel from "../models/CarModel";
// import Category from "../models/Category";
const Content_1 = require("../models/Content");
// import Product from "../models/Product";
// import Service from "../models/Service";
const User_1 = require("../models/User");
// import Wishlist from "../models/Wishlist";
// import CarFuel from "../models/CarFuel";
// import { BANNER_TYPE } from "../constants/banner-type.enum";
const Country_1 = require("../models/Country");
const State_1 = require("../models/State");
const City_1 = require("../models/City");
const GoogleMapHelper_1 = require("../helpers/GoogleMapHelper");
// import Tutorial from "../models/Tutorial";
class CommonController {
    /**
     * @api {post} /api/common/image-upload Image Upload
     * @apiVersion 1.0.0
     * @apiName Image Upload
     * @apiGroup Masters
     * @apiParam {File} image Image.
     * @apiParam {String} type Type (Ex.Profile, Type can be which image you are uploading).
     */
    static uploadImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const { image } = req.body.files;
                const { type } = req.body;
                let path = '/' + type;
                const upload = yield FileUpload_1.FileUpload.uploadInS3(image, path);
                return ResponseHelper_1.default.api(res, true, 'Image Uploaded Successfully', { upload }, startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    /**
     * @api {get} /api/common/tutorial Tutorial
     * @apiVersion 1.0.0
     * @apiName Tutorial
     * @apiGroup Masters
     */
    static tutorial(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                // const getTutorial: any = await Tutorial.find({ is_active: true });
                // console.log(getTutorial, "-----------------------------et tut");
                const response = {
                    Authentication: CommonController.getSortedTutorials(
                    // getTutorial,
                    [], 'Authentication'),
                    // Product: CommonController.getSortedTutorials(getTutorial, "Product"),
                    // Service: CommonController.getSortedTutorials(getTutorial, "Service"),
                };
                console.log(response, '--------------------response');
                return ResponseHelper_1.default.api(res, true, 'Tutorial get successfully', response, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getSortedTutorials(tutorials, category) {
        const filteredTutorials = tutorials.filter((tutorial) => tutorial.screen === category);
        return filteredTutorials.sort((a, b) => a.step - b.step);
    }
    /**
     * @api {post} /api/common/pdf-upload Pdf Upload
     * @apiVersion 1.0.0
     * @apiName Pdf Upload
     * @apiGroup Masters
     * @apiParam {File} image Image.
     * @apiParam {String} type Type (Ex.Profile, Type can be which file you are uploading).
     */
    static uploadDocument(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const { image } = req.body.files;
                const { type } = req.body;
                let path = '/' + type;
                // console.log(image, "---------- image");
                const upload = yield FileUpload_1.FileUpload.uploadPdfInS3(image, path);
                if (upload) {
                    return ResponseHelper_1.default.api(res, true, 'Pdf Uploaded Successfully', { upload }, startTime);
                }
                else {
                    return ResponseHelper_1.default.api(res, false, 'Failed to upload PDF', null, startTime);
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
    /**
     * @api {get} /api/common/app-setting App Setting
     * @apiVersion 1.0.0
     * @apiName App Setting
     * @apiGroup Masters
     */
    static appSetting(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const getAppSetting = yield AppSetting_1.default.findById('64e5d2fa6f079edbe3800654');
                return ResponseHelper_1.default.api(res, true, 'App setting get successfully', getAppSetting, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @api {get} /api/common/service-category/:category_id Service List
     * @apiVersion 1.0.0
     * @apiName Service List
     * @apiGroup Masters
     */
    static serviceCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                // const getServiceCategory = await Service.find({
                //   is_active: true,
                //   category_id: req.params.category_id,
                // }).sort({ name: 1 }); //.sort({ created_at: -1 });
                return ResponseHelper_1.default.api(res, true, 'Service list get successfully', 
                // getServiceCategory,
                '', startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static product(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const categoryId = req.params.category_id;
                let data = { is_active: true };
                if (!!categoryId) {
                    data = {
                        is_active: true,
                        category_id: categoryId,
                    };
                }
                // const getProduct = await Product.find(data)
                //   .sort({ name: 1 })
                //   .select("name thumbnail image category_id");
                // console.log(getProduct, "----------");
                return ResponseHelper_1.default.api(res, true, 'Product list get successfully', 
                // getProduct,
                '', startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @api {get} /api/common/brand/:category_id? Brand List
     * @apiVersion 1.0.0
     * @apiName Brand List
     * @apiGroup Masters
     */
    static brand(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                let filter = { is_active: true };
                if (req.params.category_id) {
                    filter = Object.assign(Object.assign({}, filter), { category_id: req.params.category_id });
                }
                // const getBrand = await CarBrand.find(filter).sort({
                //   name: 1,
                // });
                return ResponseHelper_1.default.api(res, true, 'Brand list get successfully', 
                // getBrand,
                '', startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @api {get} /api/common/brand/:category_id? Brand List
     * @apiVersion 1.0.0
     * @apiName Brand List
     * @apiGroup Masters
     */
    static model(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                let filter = { is_active: true };
                if (req.params.brand_id) {
                    filter = Object.assign(Object.assign({}, filter), { model_id: req.params.brand_id });
                }
                // const getBrand = await CarModel.find(filter).sort({
                //   name: 1,
                // });
                return ResponseHelper_1.default.api(res, true, 'Brand list get successfully', 
                // getBrand,
                '', startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @api {get} /api/common/category/:type? Category List
     * @apiVersion 1.0.0
     * @apiName Category List
     * @apiGroup Masters
     * @apiParam [type] Type("service, product","vehicle")
     */
    static category(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const type = req.params.type;
                console.log(req.params.type, 'type');
                // const getCategory = await Category.find({
                //   is_active: true,
                //   type: type,
                // }).sort({ created_at: -1 });
                // console.log("category", getCategory);
                return ResponseHelper_1.default.api(res, true, 'Category list get successfully', 
                // getCategory,
                '', startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @api {get} /api/common/banner/:type? Banner List
     * @apiVersion 1.0.0
     * @apiName Banner List
     * @apiGroup Masters
     * @apiParam [type] Type("service, serviceCategory, product, productCategory")
     */
    static banner(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const banner_for = req.params.banner_for;
                const type = req.params.type;
                // const getBanner = await Banner.find({
                //   is_active: true,
                //   type: type ? type : BANNER_TYPE.service,
                // }).sort({ created_at: -1 });
                return ResponseHelper_1.default.api(res, true, 'Banner list get successfully', 
                // getBanner,
                '', startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @api {get} /api/common/content/slug Content List
     * @apiVersion 1.0.0
     * @apiName Content
     * @apiGroup Masters
     * @apiParam {String} slug Slug (Pass slug in the URL - terms-and-conditions, how-it-works, about-us, privacy-policy, refund-policy).
     */
    static content(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            const slug = req.params.slug;
            try {
                let getContent = {};
                if (slug) {
                    getContent = yield Content_1.default.findOne({ slug: slug });
                }
                return ResponseHelper_1.default.api(res, true, 'Content list get successfully', getContent, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @api {get} /api/common/brand/:category_id Car Brand List
     * @apiVersion 1.0.0
     * @apiName Car Brand List
     * @apiGroup Vehicle Master
     */
    static carBrand(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const categoryId = req.params.category_id;
                // const getCarBrand = await CarBrand.find({
                //   is_active: true,
                //   category_id: categoryId,
                // }).sort({ name: 1 });
                return ResponseHelper_1.default.api(res, true, 'Car brand list get successfully', 
                // getCarBrand,
                '', startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    /**
     * @api {get} /api/common/fuel-type Car Fuel List
     * @apiVersion 1.0.0
     * @apiName Car Fuel List
     * @apiGroup Vehicle Master
     */
    static carFuel(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                // const getCarFuel = await CarFuel.find({ is_active: true }).sort({
                //   created_at: -1,
                // });
                return ResponseHelper_1.default.api(res, true, 'Car fuel list get successfully', 
                // getCarFuel,
                '', startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    /**
     * @api {get} /api/common/model/:brand_id Car Model List
     * @apiVersion 1.0.0
     * @apiName Car Model List
     * @apiGroup Vehicle Master
     */
    static carModel(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                let filter = { is_active: true };
                if (req.params.brand_id) {
                    filter = Object.assign(Object.assign({}, filter), { brand_id: req.params.brand_id });
                }
                // const getCarModel = await CarModel.find(filter).sort({ created_at: -1 });
                return ResponseHelper_1.default.api(res, true, 'Car model list get successfully', 
                // getCarModel,
                '', startTime);
            }
            catch (err) {
                next(err);
            }
        });
    }
    /**
     * @api {post} /api/common/country-list Country List
     * @apiVersion 1.0.0
     * @apiName Country List
     * @apiGroup Masters
     */
    static countryList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                let list = yield Country_1.default.find().sort({ name: 1 });
                return ResponseHelper_1.default.api(res, true, 'Country list has been get successfully', list, startTime);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    /**
     * @api {post} /api/common/state-list State List
     * @apiVersion 1.0.0
     * @apiName State List
     * @apiGroup Masters
     * @apiParam {String} country_id Country ID.
     */
    static stateList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const { country_id } = req.body;
                let list = yield State_1.default.find({ country_id: country_id }).sort({ name: 1 });
                return ResponseHelper_1.default.api(res, true, 'State list has been get successfully', list, startTime);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    /**
     * @api {post} /api/common/city-list City List
     * @apiVersion 1.0.0
     * @apiName City List
     * @apiGroup Masters
     * @apiParam {String} country_id Country ID.
     * @apiParam {String} state_id State ID.
     */
    static cityList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const { state_id, country_id } = req.body;
                let list = yield City_1.default.find({
                    country_id: country_id,
                    state_id: state_id,
                }).sort({ name: 1 });
                return ResponseHelper_1.default.api(res, true, 'City list has been get successfully', list, startTime);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    /**
     * @api {post} /api/common/distance Distance Bw Two Points
     * @apiVersion 1.0.0
     * @apiName Distance Bw Two Points
     * @apiGroup Masters
     * @apiParam {Number} source_latitude Source Latitude.
     * @apiParam {Number} source_longitude Source Longitude.
     * @apiParam {Number} destination_latitude Destination Latitude.
     * @apiParam {Number} destination_longitude Destination Longitude.
     * @apiParam {Optional} travel_mode Travel Mode ("driving", "walking", "transit", "bicycling")
     */
    static getDistance(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const { source_latitude, source_longitude, destination_latitude, destination_longitude, travel_mode, } = req.body;
                const source = `${source_latitude}` + ',' + `${source_longitude}`;
                const destination = `${destination_latitude}` + ',' + `${destination_longitude}`;
                const travelMode = !!travel_mode ? travel_mode : 'driving';
                const result = yield GoogleMapHelper_1.default.calculateTravelTime(source, destination, travelMode);
                if (!result) {
                    return ResponseHelper_1.default.api(res, false, 'Data Get Failed, Latitude and Longitude are not valid', {}, startTime);
                }
                return ResponseHelper_1.default.api(res, true, 'Data Get Successfully', result, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /** ============================================================================================================================================== */
    /** ============================================ Auth Function That Use User Token =============================================================== */
    /** ============================================================================================================================================== */
    /**
     * @api {get} /api/common/service-provider ServiceProvider List
     * @apiVersion 1.0.0
     * @apiName ServiceProvider List
     * @apiHeader {String} Authorization Pass jwt token.
     * @apiGroup Auth Masters
     */
    static serviceProvider(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const [serviceProvider] = yield Promise.all([
                    User_1.default.find({ is_active: true, type: 'ServiceProvider' })
                        .sort({ name: 1 })
                        .lean(),
                ]);
                return ResponseHelper_1.default.api(res, true, 'Service provider list get successfully', serviceProvider, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @api {get} /api/common/customer Customer List
     * @apiVersion 1.0.0
     * @apiName Customer List
     * @apiHeader {String} Authorization Pass jwt token.
     * @apiGroup Auth Masters
     */
    static customer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                const [customer] = yield Promise.all([
                    User_1.default.find({ is_active: true, type: 'Customer' })
                        .sort({ name: 1 })
                        .lean(),
                ]);
                return ResponseHelper_1.default.api(res, true, 'Customer list get successfully', customer, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.CommonController = CommonController;
