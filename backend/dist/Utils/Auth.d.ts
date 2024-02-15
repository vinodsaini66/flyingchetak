declare class Auth {
    constructor();
    MAX_TOKEN_TIME: number;
    generateOtp(size?: number): Promise<{
        otp: number;
        otpExpiresTime: Date;
    }>;
    decodeJwt(token: any): Promise<unknown>;
    getToken(data: any, expiresIn: any, next: any): Promise<any>;
    comparePassword(candidatePassword: string, userPassword: string): Promise<any>;
    encryptPassword(password: string): Promise<any>;
}
declare let respObj: Auth;
export default respObj;
