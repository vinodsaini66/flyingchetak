import { NextFunction } from "express";
import { ReqInterface, ResInterface } from "../../interfaces/RequestInterface";
declare class WalletValidation {
    static BalanceaddValidation(req: ReqInterface, res: ResInterface, next: NextFunction): Promise<void>;
}
export default WalletValidation;
