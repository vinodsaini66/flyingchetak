export declare class CommonController {
    /**
     * @api {post} /api/common/image-upload Image Upload
     * @apiVersion 1.0.0
     * @apiName Image Upload
     * @apiGroup Masters
     * @apiParam {File} image Image.
     * @apiParam {String} type Type (Ex.Profile, Type can be which image you are uploading).
     */
    static uploadImage(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {get} /api/common/tutorial Tutorial
     * @apiVersion 1.0.0
     * @apiName Tutorial
     * @apiGroup Masters
     */
    static tutorial(req: any, res: any, next: any): Promise<void>;
    static getSortedTutorials(tutorials: any[], category: string): any[];
    /**
     * @api {post} /api/common/pdf-upload Pdf Upload
     * @apiVersion 1.0.0
     * @apiName Pdf Upload
     * @apiGroup Masters
     * @apiParam {File} image Image.
     * @apiParam {String} type Type (Ex.Profile, Type can be which file you are uploading).
     */
    static uploadDocument(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {get} /api/common/app-setting App Setting
     * @apiVersion 1.0.0
     * @apiName App Setting
     * @apiGroup Masters
     */
    static appSetting(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {get} /api/common/service-category/:category_id Service List
     * @apiVersion 1.0.0
     * @apiName Service List
     * @apiGroup Masters
     */
    static serviceCategory(req: any, res: any, next: any): Promise<void>;
    static product(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {get} /api/common/brand/:category_id? Brand List
     * @apiVersion 1.0.0
     * @apiName Brand List
     * @apiGroup Masters
     */
    static brand(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {get} /api/common/brand/:category_id? Brand List
     * @apiVersion 1.0.0
     * @apiName Brand List
     * @apiGroup Masters
     */
    static model(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {get} /api/common/category/:type? Category List
     * @apiVersion 1.0.0
     * @apiName Category List
     * @apiGroup Masters
     * @apiParam [type] Type("service, product","vehicle")
     */
    static category(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {get} /api/common/banner/:type? Banner List
     * @apiVersion 1.0.0
     * @apiName Banner List
     * @apiGroup Masters
     * @apiParam [type] Type("service, serviceCategory, product, productCategory")
     */
    static banner(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {get} /api/common/content/slug Content List
     * @apiVersion 1.0.0
     * @apiName Content
     * @apiGroup Masters
     * @apiParam {String} slug Slug (Pass slug in the URL - terms-and-conditions, how-it-works, about-us, privacy-policy, refund-policy).
     */
    static content(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {get} /api/common/brand/:category_id Car Brand List
     * @apiVersion 1.0.0
     * @apiName Car Brand List
     * @apiGroup Vehicle Master
     */
    static carBrand(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {get} /api/common/fuel-type Car Fuel List
     * @apiVersion 1.0.0
     * @apiName Car Fuel List
     * @apiGroup Vehicle Master
     */
    static carFuel(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {get} /api/common/model/:brand_id Car Model List
     * @apiVersion 1.0.0
     * @apiName Car Model List
     * @apiGroup Vehicle Master
     */
    static carModel(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {post} /api/common/country-list Country List
     * @apiVersion 1.0.0
     * @apiName Country List
     * @apiGroup Masters
     */
    static countryList(req: any, res: any, next: any): Promise<any>;
    /**
     * @api {post} /api/common/state-list State List
     * @apiVersion 1.0.0
     * @apiName State List
     * @apiGroup Masters
     * @apiParam {String} country_id Country ID.
     */
    static stateList(req: any, res: any, next: any): Promise<any>;
    /**
     * @api {post} /api/common/city-list City List
     * @apiVersion 1.0.0
     * @apiName City List
     * @apiGroup Masters
     * @apiParam {String} country_id Country ID.
     * @apiParam {String} state_id State ID.
     */
    static cityList(req: any, res: any, next: any): Promise<any>;
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
    static getDistance(req: any, res: any, next: any): Promise<void>;
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
    static serviceProvider(req: any, res: any, next: any): Promise<void>;
    /**
     * @api {get} /api/common/customer Customer List
     * @apiVersion 1.0.0
     * @apiName Customer List
     * @apiHeader {String} Authorization Pass jwt token.
     * @apiGroup Auth Masters
     */
    static customer(req: any, res: any, next: any): Promise<void>;
}
