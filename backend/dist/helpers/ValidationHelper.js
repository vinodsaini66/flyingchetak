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
exports.validate = void 0;
const validate = (body, res, schema) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = yield schema.validate(body, { abortEarly: true });
        if (validation.error) {
            const error = validation.error.details.map((e) => (e = e.message));
            console.log('errorororo=====>>>>>', validation, error);
            res.status(400).json({
                // status: 400,
                // statusText: "VALIDATION_FAILED",
                status: false,
                message: error[0],
                data: {},
            });
            return false;
        }
        else {
            return true;
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.validate = validate;
