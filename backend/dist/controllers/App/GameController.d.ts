export declare class GameController {
    static getGamePageData(req: any, res: any, next: any): Promise<void>;
    static bet(req: any, res: any, next: any): Promise<void>;
    static autoBet(req: any, res: any, next: any): Promise<void>;
    static getCurrentGameSession(req: any, res: any, next: any): Promise<void>;
    static endGame(): Promise<boolean>;
    static getUp: ({ gameTotal, remaining, baseAmount, timeDiffInMs, currentGameId }: {
        gameTotal: any;
        remaining: any;
        baseAmount: any;
        timeDiffInMs: any;
        currentGameId: any;
    }) => number;
    static withdrowalAutomatically: (betId: any) => Promise<boolean>;
    static checkAutoBet: (xValue: any, game_id: any) => Promise<boolean>;
    static handleGame(): Promise<{
        message: string;
        status: boolean | number;
        data: any;
        error: any;
    }>;
    static handleWithdrawRequest(req: any, res: any, next: any): Promise<void>;
    static totalBet(req: any, res: any, next: any): Promise<void>;
}
