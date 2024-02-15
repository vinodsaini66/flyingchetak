"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
function env() {
    return {
        nodeEnv: process.env.NODE_ENV,
        dbUrl: process.env.DB_URL,
        baseUrl: process.env.BASE_URL,
        awsSecretKey: process.env.aws_access_key,
        awsAccessKey: process.env.aws_secret_key,
        region: process.env.region,
        s3Bucket: process.env.s3_bucket,
    };
}
exports.env = env;
