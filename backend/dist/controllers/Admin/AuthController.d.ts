export declare class AuthController {
    static login(req: any, res: any, next: any): Promise<void>;
    static signUp(req: any, res: any, next: any): Promise<void>;
    static getProfile(req: any, res: any, next: any): Promise<void>;
    static changePassword(req: any, res: any, next: any): Promise<void>;
    static updateProfile(req: any, res: any, next: any): Promise<void>;
    static forgotPassword(req: any, res: any, next: any): Promise<void>;
    static verifyOtp(req: any, res: any, next: any): Promise<void>;
    static resetPassword(req: any, res: any, next: any): Promise<void>;
    static updateAppSetting(req: any, res: any, next: any): Promise<void>;
}
