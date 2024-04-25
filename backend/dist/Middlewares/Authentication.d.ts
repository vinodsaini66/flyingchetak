declare class Authentication {
    constructor();
    static userLanguage(req: any, res: any, next: any): Promise<void>;
    static user(req: any, res: any, next: any): Promise<any>;
    static socketAuth(token: any): Promise<any>;
    static admin(req: any, res: any, next: any): Promise<any>;
}
export default Authentication;
