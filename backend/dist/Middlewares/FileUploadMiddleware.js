"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFiles = void 0;
const formidable = require("formidable");
class UploadFiles {
    static upload(req, res, next) {
        try {
            const form = formidable({ multiples: true });
            form.parse(req, (err, fields = {}, files) => {
                if (err) {
                    next(err);
                    return;
                }
                req.body = Object.assign(Object.assign({}, fields), { files });
                next();
            });
        }
        catch (error) {
            req.errorStatus = 401; // 401 Unprocessable Entity
            next(error);
        }
    }
}
exports.UploadFiles = UploadFiles;
exports.default = UploadFiles;
