"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authentication_1 = require("../../Middlewares/Authentication");
const GameController_1 = require("../../controllers/App/GameController");
class GameRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.post();
        this.get();
    }
    post() {
        this.router.post('/deposit', Authentication_1.default.user, GameController_1.GameController.bet);
        this.router.post('/withdraw/:id', Authentication_1.default.user, GameController_1.GameController.handleWithdrawRequest);
        this.router.post('/autoBet', Authentication_1.default.user, GameController_1.GameController.autoBet);
    }
    get() {
        this.router.get('/', Authentication_1.default.user, GameController_1.GameController.getGamePageData);
        this.router.get('/bets', Authentication_1.default.user, GameController_1.GameController.totalBet);
        this.router.get('/fall-rate', Authentication_1.default.user, GameController_1.GameController.Fallrate);
    }
}
exports.default = new GameRoutes().router;
