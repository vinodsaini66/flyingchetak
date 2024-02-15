declare class ResponseHelper {
    ok(res: any, statusText: string, message: any, data: any, startTime: any): Promise<void>;
    api(res: any, status: boolean, message: any, data: any, startTime: any): Promise<void>;
    badRequest(res: any, statusText: string, message: any, data: any, startTime: any): Promise<void>;
    notAcceptable(res: any, statusText: string, message: any, data: any, startTime: any): Promise<void>;
    conflict(res: any, statusText: string, message: any, data: any, startTime: any): Promise<void>;
    noContent(res: any, statusText: string, message: any, data?: any): Promise<void>;
    unAuthenticated(res: any, statusText: string, message: any, data: any, startTime: any, wrongAttempt: any): Promise<void>;
    notFound(res: any, statusText: string, message: any, data: any, startTime: any): Promise<void>;
    unAuthorize(res: any, statusText: string, message: any, data: any, startTime: any): Promise<void>;
    serverError(res: any, message?: string, data?: any): Promise<void>;
    created(res: any, statusText: string, message?: any, data?: any): Promise<void>;
    acceptanceRequired(res: any, statusText: string, message?: any, data?: any): Promise<void>;
    private execTime;
    private tracking;
}
declare const _default: ResponseHelper;
export default _default;
