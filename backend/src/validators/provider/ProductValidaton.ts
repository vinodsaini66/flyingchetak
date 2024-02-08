import { NextFunction } from "express";
import * as Joi from "joi";
import { validate } from "../../helpers/ValidationHelper";
import { ReqInterface, ResInterface } from "../../interfaces/RequestInterface";

class ProductValidation {
  static async newProductValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction,
  ) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      image: Joi.array().items(Joi.string()).min(1).required(),
      thumbnail: Joi.string().required(),
      description: Joi.string().allow('').optional(),
      category_id: Joi.string().required(),
      brand_id: Joi.string().required(),
      model_id: Joi.string().required(),
      basic_price: Joi.number().required(),
      admin_commission: Joi.number().required(),
      MRP: Joi.number().required(),
      variants: Joi.array().optional().items(Joi.object().keys({
        basic_price: Joi.number().required(),
        image: Joi.array().items(Joi.string()).min(1).required(),
        description: Joi.string().allow('').optional(),
        thumbnail: Joi.string().required(),
        attribute: Joi.array().items(Joi.object().keys({
          attribute_id: Joi.string().required(),
          value: Joi.string().required(),
          name: Joi.string().required(),
          description: Joi.string().allow('').optional(),
          type: Joi.string().required(),
        })).required(),
      }))
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
}

export default ProductValidation;