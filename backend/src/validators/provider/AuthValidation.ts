import * as Joi from "joi";
import { NextFunction } from "express";
import { validate } from "../../helpers/ValidationHelper";
import { ReqInterface, ResInterface } from "../../interfaces/RequestInterface";

class AuthValidation {
  static async loginValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction,
  ) {
    const schema = Joi.object().keys({
      country_code: Joi.number().required(),
      mobile_number: Joi.number().required(),
      password: Joi.string().required(),
      device_token: Joi.string(),
      device_type: Joi.string(),
      latitude: Joi.number().optional(),
      longitude: Joi.number().optional(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }

  static async signUpValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction,
  ) {
    const schema = Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      country_code: Joi.string().required(),
      mobile_number: Joi.string().required(),
      email: Joi.string().required(),
      business_name: Joi.string().required(),
      business_location_latitude: Joi.number().required(),
      business_location_longitude: Joi.number().required(),
      business_location_address: Joi.string().required(),
      device_token: Joi.string().required(),
      device_type: Joi.string().required(),
      radius: Joi.number().required(),
      terms_and_conditions: Joi.boolean().required(),
      country_id: Joi.string().optional(),
      business_location_postal_code: Joi.number().optional(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }

  static async forgotPasswordValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction,
  ) {
    const schema = Joi.object().keys({
      country_code: Joi.string().required(),
      mobile_number: Joi.string().required(),
      type: Joi.string().required(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }

  static async socialSignupValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction,
  ) {
    const schema = Joi.object().keys({
      name: Joi.string().optional(),
      email: Joi.string().email().required(),
      device_token: Joi.string().optional(),
      country_code: Joi.string().optional(),
      mobile_number: Joi.string().optional(),
      device_type: Joi.string().optional(),
      login_type: Joi.string().required(),
      social_id: Joi.string().required(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }

  static async verifyOTPValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction,
  ) {
    const schema = Joi.object().keys({
      country_code: Joi.string().required(),
      mobile_number: Joi.string().required(),
      otp: Joi.number().required(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }

  static async resetPasswordValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction,
  ) {
    const schema = Joi.object().keys({
      password: Joi.string().required(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }

  static async ChangePasswordValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction,
  ) {
    const schema = Joi.object().keys({
      password: Joi.string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/,
          ),
        )
        .required()
        .messages({
          "string.pattern.base": `Password atleast contain 8 characters, atleast contain one captital letter, atleast contain one small letter, atleast contain one digit, atleast contain one special character`,
          "string.empty": `Password cannot be empty`,
          "any.required": `Password is required`,
        }),
      new_password: Joi.string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/,
          ),
        )
        .required()
        .messages({
          "string.pattern.base": `New password atleast contain 8 characters, atleast contain one captital letter, atleast contain one small letter, atleast contain one digit, atleast contain one special character`,
          "string.empty": `New password cannot be empty`,
          "any.required": `New password is required`,
        }),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }

  static async newProfileValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction,
  ) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required(),
      dob: Joi.string().required(),
      image: Joi.string().optional(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      device_type: Joi.string().required(),
      device_token: Joi.string().required(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
}

export default AuthValidation;
