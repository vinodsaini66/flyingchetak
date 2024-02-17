export interface Environment {
    nodeEnv: string;
    dbUrl: string;
    baseUrl: string;
    jwtSecret: string;
    jwt_timeout: string;
    redirection_url: string;
    awsSecretKey: string;
    awsAccessKey: string;
    region: string;
    s3Bucket: string;
}
export declare function env(): Environment;
