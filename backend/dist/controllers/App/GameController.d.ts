export declare class GameController {
    static getGamePageData(req: any, res: any, next: any): Promise<void>;
    static bet(req: any, res: any, next: any): Promise<void>;
    static autoBet(req: any, res: any, next: any): Promise<void>;
    static getCurrentGameSession(req: any, res: any, next: any): Promise<void>;
    static endGame(): Promise<boolean>;
    static withdrowalAutomatically: (betId: any) => Promise<boolean>;
    static checkAutoBet: (xValue: any, game_id: any) => Promise<boolean>;
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
    static handleWithdrawRequest(req: any, res: any, next: any): Promise<void>;
    static totalBet(req: any, res: any, next: any): Promise<void>;
}
