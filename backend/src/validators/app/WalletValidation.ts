import * as Joi from "joi";
import { NextFunction } from "express";
import { validate } from "../../helpers/ValidationHelper";
import { ReqInterface, ResInterface } from "../../interfaces/RequestInterface";


class WalletValidation {
  static async BalanceaddValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction,
  ) {
    const schema = Joi.object().keys({
      balance: Joi.number().required().positive(),
      _id: Joi.string().required(),

    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
}

export default WalletValidation;