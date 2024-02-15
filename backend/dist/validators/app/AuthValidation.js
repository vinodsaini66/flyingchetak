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
var LoginTypeRole;
(function (LoginTypeRole) {
    LoginTypeRole["Google"] = "Google";
    LoginTypeRole["Facebook"] = "Facebook";
})(LoginTypeRole || (LoginTypeRole = {}));
class AuthValidation {
    static loginValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object().keys({
                mobile_number: Joi.number().required(),
                password: Joi.string().required(),
                // device_token: Joi.string(),
                // device_type: Joi.string(),
                latitude: Joi.number().optional(),
                longitude: Joi.number().optional(),
            });
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
    static signUpValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object().keys({
                email: Joi.string().required(),
                name: Joi.string().required(),
                country_code: Joi.string().required(),
                mobile_number: Joi.string().required(),
                type: Joi.string().required(),
                password: Joi.string().required(),
                Cpassword: Joi.string().required(),
                referral_from_id: Joi.string().allow('').optional(),
            });
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
    static forgotPasswordValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object().keys({
                country_code: Joi.string().required(),
                mobile_number: Joi.string().required(),
                type: Joi.string().required(),
            });
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
    static socialSignupValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object().keys({
                name: Joi.string().optional(),
                email: Joi.string().email().required(),
                device_token: Joi.string().optional(),
                country_code: Joi.string().optional(),
                mobile_number: Joi.string().optional(),
                device_type: Joi.string().optional(),
                login_type: Joi.string().required(),
                social_id: Joi.string().required(),
                social_image: Joi.string().required(),
            });
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
    static verifyOTPValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object().keys({
                country_code: Joi.string().required(),
                mobile_number: Joi.string().required(),
                otp: Joi.number().required(),
                type: Joi.string().required(),
            });
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
    static updateProfileValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("req.body======>>>>>>>>", req.body);
            const schema = Joi.object().keys({
                name: Joi.string().required(),
                email: Joi.string().required(),
                mobile_number: Joi.string().required(),
                dob: Joi.string().required(),
                gender: Joi.string().required(),
            });
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
    static resetPasswordValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object().keys({
                password: Joi.string().required(),
            });
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
    static ChangePasswordValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object().keys({
                password: Joi.string()
                    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/))
                    .required()
                    .messages({
                    'string.pattern.base': `Password atleast contain 8 characters, atleast contain one captital letter, atleast contain one small letter, atleast contain one digit, atleast contain one special character`,
                    'string.empty': `Password cannot be empty`,
                    'any.required': `Password is required`,
                }),
                new_password: Joi.string()
                    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/))
                    .required()
                    .messages({
                    'string.pattern.base': `New password atleast contain 8 characters, atleast contain one captital letter, atleast contain one small letter, atleast contain one digit, atleast contain one special character`,
                    'string.empty': `New password cannot be empty`,
                    'any.required': `New password is required`,
                }),
            });
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
    static newProfileValidation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const isValid = yield (0, ValidationHelper_1.validate)(req.body, res, schema);
            if (isValid) {
                next();
            }
        });
    }
}
exports.default = AuthValidation;
