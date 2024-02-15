import { NextFunction } from "express";
import { ReqInterface, ResInterface } from "../../interfaces/RequestInterface";
declare class ProductValidation {
    static newProductValidation(req: ReqInterface, res: ResInterface, next: NextFunction): Promise<void>;
}
export default ProductValidation;
