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
exports.FileUpload = void 0;
const Env_1 = require("../environments/Env");
const AWS = require("aws-sdk");
const fs = require("fs");
const Helper_1 = require("./Helper");
AWS.config.update({
    accessKeyId: (0, Env_1.env)().awsAccessKey,
    secretAccessKey: (0, Env_1.env)().awsSecretKey,
    region: (0, Env_1.env)().region,
});
class FileUpload {
    constructor() { }
    static uploadInS3(image, path) {
        let folderPath = path;
        let fileExtension = '.png';
        const imageRemoteName = `${folderPath}/image_${new Date().getTime()}${fileExtension}`;
        return FileUpload.s3
            .putObject({
            Bucket: (0, Env_1.env)().s3Bucket,
            Body: fs.readFileSync(image.filepath),
            ContentType: image.mimetype,
            Key: imageRemoteName,
        })
            .promise()
            .then((response) => {
            return imageRemoteName;
        })
            .catch((err) => {
            return false;
        });
    }
    // static uploadPdfInS3(file, path) {
    //   let folderPath = path;
    //   let fileExtension = ".pdf";
    //   const fileRemoteName = `${folderPath}/document_${new Date().getTime()}${fileExtension}`;
    //   return FileUpload.s3
    //     .putObject({
    //       Bucket: env().s3Bucket,
    //       Body: fs.readFileSync(file.filepath),
    //       ContentType: file.mimetype,
    //       Key: fileRemoteName,
    //     })
    //     .promise()
    //     .then((response) => {
    //       return fileRemoteName;
    //     })
    //     .catch((err) => {
    //       return false;
    //     });
    // }
    // static async uploadPdfInS3(file, path) {
    //   let folderPath = path;
    //   const extension = await Helper.getFileExtension(".pdf");
    //   const imageRemoteName = `${folderPath}/file_${new Date().getTime()}.${extension}`;
    //   return FileUpload.s3
    //     .putObject({
    //       Bucket: env().s3Bucket,
    //       Body: fs.readFileSync(file.filepath),
    //       ContentType: file.mimetype,
    //       Key: imageRemoteName,
    //     })
    //     .promise()
    //     .then((response) => {
    //       return imageRemoteName;
    //     })
    //     .catch((err) => {
    //       return false;
    //     });
    // }
    static uploadPdfInS3(file, path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let folderPath = path;
                const extension = yield Helper_1.default.getFileExtension('.pdf');
                const imageRemoteName = `${folderPath}/file_${new Date().getTime()}.${extension}`;
                if (!fs.existsSync(file.filepath)) {
                    console.error('File does not exist:', file.filepath);
                    return false;
                }
                const response = yield FileUpload.s3
                    .putObject({
                    Bucket: (0, Env_1.env)().s3Bucket,
                    Body: fs.readFileSync(file.filepath),
                    ContentType: file.mimetype,
                    Key: imageRemoteName,
                })
                    .promise();
                return imageRemoteName;
            }
            catch (err) {
                console.error('Error uploading to S3:', err);
                return false;
            }
        });
    }
    static deleteFromS3(path) {
        const params = {
            Bucket: (0, Env_1.env)().s3Bucket,
            Delete: {
                Objects: [
                    {
                        Key: path,
                    },
                ],
            },
        };
        return FileUpload.s3
            .deleteObjects(params)
            .promise()
            .then((response) => {
            return true;
        })
            .catch((error) => {
            return false;
        });
    }
}
exports.FileUpload = FileUpload;
FileUpload.s3 = new AWS.S3();
exports.default = FileUpload;
