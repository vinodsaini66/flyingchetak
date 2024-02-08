import * as Joi from "joi";
import { NextFunction } from "express";
import { validate } from "../../helpers/ValidationHelper";
import { ReqInterface, ResInterface } from "../../interfaces/RequestInterface";

class TransactioValidation {
  static async transactionGetValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction,
  ) {
    const schema = Joi.object().keys({
      transaction_type: Joi.string().required(),

    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
  static async withdrawaltValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction,
  ) {
    const schema = Joi.object().keys({
      amount: Joi.number().required().positive(),

    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }

}

export default TransactioValidation;