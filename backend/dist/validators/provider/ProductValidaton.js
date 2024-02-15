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
const Joi = require("joi");
const ValidationHelper_1 = require("../../helpers/ValidationHelper");
class ProductValidation {
    static newProductValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
}
exports.default = ProductValidation;
