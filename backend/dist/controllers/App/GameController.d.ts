export declare class GameController {
    static getGamePageData(req: any, res: any, next: any): Promise<void>;
    static Fallrate(req: any, res: any, next: any): Promise<void>;
    static bet(payload: any, userId: any): Promise<{
        message: string;
        status: boolean;
    }>;
    static autoBet(payload: any, userId: any): Promise<{
        message: string;
        status: boolean;
    }>;
    static getCurrentGameSession(req: any, res: any, next: any): Promise<void>;
    static endGame(timerValue: any): Promise<boolean>;
    static withdrowalAutomatically: (betId: any) => Promise<boolean | void>;
    static checkAutoBet: (xValue: any) => Promise<boolean>;
    static getXValue(): Promise<{
        message: string;
        status: boolean | number;
        data: any;
        error: any;
    }>;
    static handleGame(): Promise<{
        message: string;
        status: boolean | number;
        data: any;
        error: any;
    }>;
    static handleWithdrawRequest(payloads: any): Promise<{
        message: string;
        status: boolean;
    }>;
    static totalBet(req: any, res: any, next: any): Promise<void>;
}
