import { NextFunction } from "express";
import { ReqInterface, ResInterface } from "../../interfaces/RequestInterface";
declare class TransactioValidation {
    static transactionGetValidation(req: ReqInterface, res: ResInterface, next: NextFunction): Promise<void>;
    static withdrawaltValidation(req: ReqInterface, res: ResInterface, next: NextFunction): Promise<void>;
}
export default TransactioValidation;
