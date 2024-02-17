"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const project_enum_1 = require("../constants/project.enum");
function env() {
    return {
        nodeEnv: process.env.NODE_ENV,
        dbUrl: project_enum_1.CONASTANT.DB_URL,
        baseUrl: project_enum_1.CONASTANT.BASE_URL,
        jwtSecret: project_enum_1.CONASTANT.JWT_SECRET,
        redirection_url: project_enum_1.CONASTANT.REDIRECTION_URL,
        jwt_timeout: project_enum_1.CONASTANT.JWT_TIMEOUT_DURATION,
        awsSecretKey: process.env.aws_access_key,
        awsAccessKey: process.env.aws_secret_key,
        region: process.env.region,
        s3Bucket: process.env.s3_bucket,
    };
}
exports.env = env;
