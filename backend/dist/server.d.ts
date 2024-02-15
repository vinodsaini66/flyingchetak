import * as express from 'express';
export declare class Server {
    app: express.Application;
    constructor();
    setConfigurations(): void;
    setMongodb(): void;
    enableCors(): void;
    configBodyParser(): void;
    setRoutes(): void;
    sendEvent(req: express.Request, res: express.Response, next: any): Promise<void>;
    writeEvent(res: express.Response, sseId: string, data: string): void;
    error404Handler(): void;
    handleErrors(): void;
}
