"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const Game_1 = require("../../models/Game");
const ResponseHelper_1 = require("../../helpers/ResponseHelper");
const Bet_1 = require("../../models/Bet");
const OngoingGame_1 = require("../../models/OngoingGame");
const WalletSettings_1 = require("../../models/WalletSettings");
const Helper_1 = require("../../helpers/Helper");
const TransactionSetting_1 = require("../../models/TransactionSetting");
const AdminSetting_1 = require("../../models/AdminSetting");
const __1 = require("../..");
const { ObjectId } = require('mongodb');
let timer = 1;
let gameId = "";
let secondCount = 0;
const myArray = [120, 130, 145];
const randomIndex = Math.floor(Math.random() * myArray.length);
let randomItem = myArray[randomIndex];
let isTimerPaused = false;
let currentTime;
class GameController {
    static getGamePageData(req, res, next) {
        var _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getgamepagedata=========>>>>>>>>>..");
            const startTime = new Date().getTime();
            try {
                const ongoingGame = yield OngoingGame_1.default.findOne().populate([
                    { path: 'current_game' },
                ]);
                const gameBets = yield Bet_1.default.find({
                    game_id: (_b = ongoingGame === null || ongoingGame === void 0 ? void 0 : ongoingGame.current_game) === null || _b === void 0 ? void 0 : _b._id,
                }).populate([{ path: 'user_id' }]);
                const minBetAmount = (_c = (yield AdminSetting_1.default.findOne())) === null || _c === void 0 ? void 0 : _c.min_bet;
                const userBets = yield Bet_1.default.find({
                    user_id: req.user.id,
                    game_id: (_d = ongoingGame === null || ongoingGame === void 0 ? void 0 : ongoingGame.current_game) === null || _d === void 0 ? void 0 : _d._id,
                });
                const wallet = yield WalletSettings_1.default.findOne({ userId: req.user.id });
                if (!wallet) {
                    const newWallet = yield new WalletSettings_1.default({
                        userId: req.user.id,
                        balance: 0,
                    }).save();
                    return ResponseHelper_1.default.api(res, true, 'Game Data Get Successfully', {
                        balance: newWallet === null || newWallet === void 0 ? void 0 : newWallet.balance,
                        ongoingGame,
                        bets: gameBets,
                        minBetAmount,
                        userBets,
                    }, startTime);
                }
                return ResponseHelper_1.default.api(res, true, 'Game Data Get Successfully', {
                    balance: wallet === null || wallet === void 0 ? void 0 : wallet.balance,
                    ongoingGame,
                    bets: gameBets,
                    minBetAmount,
                    userBets,
                }, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static Fallrate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Fallrate=========>>>>>>>>>..");
            const startTime = new Date().getTime();
            try {
                const fallrate = yield Game_1.default.find().limit(10).sort({ created_at: -1 });
                return ResponseHelper_1.default.api(res, true, 'Fall rate Get Successfully', fallrate, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static bet(payload, userId) {
        var _b;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("bet==========>>>>>>>>>>>");
            const startTime = new Date().getTime();
            try {
                const { amount, betType, boxType } = payload;
                const wallet = yield WalletSettings_1.default.findOne({ userId: userId });
                const walletTransactionData = {
                    payee: userId,
                    receiver: (_b = Helper_1.default === null || Helper_1.default === void 0 ? void 0 : Helper_1.default.admin) === null || _b === void 0 ? void 0 : _b._id,
                    transaction_id: Helper_1.default.generateAlphaString(6),
                    amount: amount,
                    transaction_mode: TransactionSetting_1.Transaction_Modes.USER,
                    transaction_type: TransactionSetting_1.Transaction_Types.DEBIT,
                    status: TransactionSetting_1.Status_Types.SUCCESS,
                    wallet_id: wallet._id,
                    bidType: "manual",
                };
                const transaction = yield new TransactionSetting_1.default(walletTransactionData).save();
                if (transaction) {
                    wallet.balance = +wallet.balance - +amount;
                    wallet.save();
                }
                const ongoingGame = yield OngoingGame_1.default.findOne();
                const nextGame = yield Game_1.default.findById(ongoingGame === null || ongoingGame === void 0 ? void 0 : ongoingGame.current_game);
                // generate bet
                const betData = {
                    game_id: nextGame === null || nextGame === void 0 ? void 0 : nextGame._id,
                    user_id: userId,
                    status: Bet_1.BetStatus.ACTIVE,
                    deposit_amount: amount,
                    betType: betType,
                    boxType: boxType
                };
                const bet = yield new Bet_1.default(betData).save();
                console.log("bet=====>>>>>>>>>>", bet);
                // update game total deposit
                if (bet) {
                    const newAmount = +(nextGame === null || nextGame === void 0 ? void 0 : nextGame.total_deposit) + +amount;
                    const gameAdminCommissionPercentage = 10;
                    // number = (
                    // 	await AdminSetting.findOne()
                    // ).bet_commission;
                    const updatedAdminCommission = Math.round(((gameAdminCommissionPercentage * newAmount) / 100) * 100) / 100;
                    nextGame.total_deposit = newAmount;
                    nextGame.commission_amount = updatedAdminCommission;
                    yield nextGame.save();
                    const gameData = yield GameController.handleGame();
                    __1.io.emit('gameData', gameData);
                    return { message: "Your bet has been successfully placed!", status: true };
                }
                else {
                    wallet.balance = +wallet.balance + +amount;
                    transaction.status = TransactionSetting_1.Status_Types.FAILED;
                    yield transaction.save();
                    yield wallet.save();
                    return { message: "Transaction failed!, Money is re added to your wallet", status: false };
                }
            }
            catch (error) {
                return { message: "Transaction failed!, Some error occurs", status: false };
                // next(error);
            }
        });
    }
    // auto bet 
    static autoBet(payload, userId) {
        var _b;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("autoBet==========>>>>>>>>>>>");
            const startTime = new Date().getTime();
            try {
                const { amount, xValue, boxType, betType } = payload;
                const wallet = yield WalletSettings_1.default.findOne({ userId: userId });
                const walletTransactionData = {
                    payee: userId,
                    receiver: (_b = Helper_1.default === null || Helper_1.default === void 0 ? void 0 : Helper_1.default.admin) === null || _b === void 0 ? void 0 : _b._id,
                    transaction_id: Helper_1.default.generateAlphaString(6),
                    amount: amount,
                    transaction_mode: TransactionSetting_1.Transaction_Modes.USER,
                    transaction_type: TransactionSetting_1.Transaction_Types.DEBIT,
                    status: TransactionSetting_1.Status_Types.SUCCESS,
                    wallet_id: wallet._id,
                    betType: betType,
                    xValue: xValue
                };
                const transaction = yield new TransactionSetting_1.default(walletTransactionData).save();
                console.log("transaction======", transaction);
                if (transaction) {
                    wallet.balance = +wallet.balance - +amount;
                    wallet.save();
                }
                const ongoingGame = yield OngoingGame_1.default.findOne();
                const nextGame = yield Game_1.default.findById(ongoingGame === null || ongoingGame === void 0 ? void 0 : ongoingGame.current_game);
                // generate bet
                const betData = {
                    game_id: nextGame === null || nextGame === void 0 ? void 0 : nextGame._id,
                    user_id: userId,
                    status: Bet_1.BetStatus.ACTIVE,
                    deposit_amount: amount * xValue,
                    xValue: xValue,
                    betType: betType,
                    boxType: boxType
                };
                const bet = yield new Bet_1.default(betData).save();
                console.log("bet=====", bet);
                // update game total deposit
                if (bet) {
                    const newAmount = +(nextGame === null || nextGame === void 0 ? void 0 : nextGame.total_deposit) + +amount;
                    const gameAdminCommissionPercentage = 10;
                    // number = (
                    // 	await AdminSetting.findOne()
                    // ).bet_commission;
                    const updatedAdminCommission = Math.round(((gameAdminCommissionPercentage * newAmount) / 100) * 100) / 100;
                    nextGame.total_deposit = newAmount;
                    nextGame.commission_amount = updatedAdminCommission;
                    yield nextGame.save();
                }
                else {
                    wallet.balance = +wallet.balance + +amount;
                    transaction.status = TransactionSetting_1.Status_Types.FAILED;
                    yield transaction.save();
                    yield wallet.save();
                    return { message: "Transaction Failed, Money is re added to your wallet", status: false };
                    // return _RS.api(
                    // 	res,
                    // 	false,
                    // 	'Transaction Failed, Money is re added to your wallet',
                    // 	{},
                    // 	startTime
                    // );
                }
                return { message: "Your bet has been successfully placed!", status: true };
                // return _RS.api(
                // 	res,
                // 	true,
                // 	'Bet Successfully Submitted',
                // 	{ transaction, wallet },
                // 	startTime
                // );
            }
            catch (error) {
                return { message: "Transaction failed!, Some error occurs", status: false };
                // next(error);
            }
        });
    }
    // auto bet end function
    static getCurrentGameSession(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getCurrentGameSession==========>>>>>>>>>>>");
            const startTime = new Date().getTime();
            try {
                const activeGame = yield Game_1.default.findOne({ is_active: true });
                if (!activeGame) {
                    return ResponseHelper_1.default.api(res, false, 'No Active Games Found, Please Try Again Later', {}, startTime);
                }
                return ResponseHelper_1.default.api(res, true, 'Game Get Successfully', activeGame, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // end game and generate new game.
    static endGame(timerValue) {
        var _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("endGame==========>>>>>>>>>>>");
                const myArray1 = [90, 60, 30, 40, 50];
                const randomIndex1 = Math.floor(Math.random() * myArray.length);
                randomItem = myArray[randomIndex];
                secondCount = 0;
                //  timer = 1;
                //  socketTokenMap.set("_id", undefined);
                const ongoingGame = yield OngoingGame_1.default.findOne();
                const nextGame = yield Game_1.default.findById(ongoingGame === null || ongoingGame === void 0 ? void 0 : ongoingGame.next_game);
                // change all current bet status to completed (only players who have't withdrawed money, as for else it was already updated to placed)
                const updateBetStatus = yield Bet_1.default.updateMany({
                    game_id: ongoingGame.current_game,
                    status: Bet_1.BetStatus.ACTIVE,
                }, {
                    status: Bet_1.BetStatus.COMPLETED,
                });
                // generate new game
                const newGameData = {
                    // session: 'fdhjhgjkhdfkg',
                    total_deposit: 0,
                    commission_amount: 0,
                    base_amount: ((_b = (yield Bet_1.default.findOne({ game_id: nextGame._id })
                        .sort({ deposit_amount: -1 })
                        .exec())) === null || _b === void 0 ? void 0 : _b.deposit_amount) ? (_c = (yield Bet_1.default.findOne({ game_id: nextGame._id })
                        .sort({ deposit_amount: -1 })
                        .exec())) === null || _c === void 0 ? void 0 : _c.deposit_amount : 0,
                    fall_rate: 0,
                    earning: 0,
                    start_time: Date.now() + (10 * 1000),
                    end_time: Date.now() + (randomItem * 1000),
                };
                const newNextGame = yield new Game_1.default(newGameData).save();
                // update bet statuses for new current game
                const newCurrentBets = yield Bet_1.default.updateMany({
                    status: Bet_1.BetStatus.PENDING,
                    game_id: ongoingGame.next_game,
                }, {
                    status: Bet_1.BetStatus.ACTIVE,
                });
                yield Game_1.default.updateOne({
                    _id: ongoingGame.current_game,
                }, {
                    fall_rate: Number(timerValue),
                });
                ongoingGame.current_game = ongoingGame.next_game;
                ongoingGame.next_game = newNextGame._id;
                ongoingGame.fall_rate = timerValue;
                const maxBet = yield Bet_1.default.findOne({ game_id: nextGame._id })
                    .sort({ deposit_amount: -1 })
                    .exec();
                // console.log(maxBet, '---------');
                nextGame.start_time = Date.now() + (10 * 1000);
                nextGame.end_time = Date.now() + (90 * 1000);
                // nextGame.base_amount = (maxBet?.deposit_amount)?(maxBet?.deposit_amount):10;
                yield nextGame.save();
                yield ongoingGame.save();
                timer = 1;
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    static getXValue() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("dandownItemrandomItem====>>>>", randomItem, secondCount);
                secondCount++;
                if (randomItem == secondCount) {
                    // setTimeout(async() =>await GameController.endGame(timer), 10000);
                    const gameEnd = yield GameController.endGame(timer);
                    timer = 1;
                }
                else {
                    timer += 0.01;
                }
                // }
                return {
                    status: true,
                    message: 'Up Get Successfully',
                    data: {
                        timer
                    },
                    error: null,
                };
            }
            catch (error) {
                return {
                    status: false,
                    message: 'ERROR',
                    data: {},
                    error: error,
                };
            }
        });
    }
    static handleGame() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ongoingGame = yield OngoingGame_1.default.findOne();
                // let currentGame
                // let allBets
                // if(timer == 1){
                // 	currentGame = await Game.findById(ongoingGame?.next_game);
                // 	allBets = await Bet.find({
                // 		game_id: currentGame?._id,
                // 	}).populate([{ path: 'user_id' }]);
                // }
                // else{
                const currentGame = yield Game_1.default.findById(ongoingGame === null || ongoingGame === void 0 ? void 0 : ongoingGame.current_game);
                const allBets = yield Bet_1.default.find({
                    game_id: currentGame === null || currentGame === void 0 ? void 0 : currentGame._id,
                }).populate([{ path: 'user_id' }]);
                // }
                const fallrate = yield Game_1.default.find().limit(10).sort({ created_at: -1 });
                // let userBets = await Bet.find({user_id:userId}).sort({created_at:-1})
                const result = yield Bet_1.default.aggregate([
                    {
                        $match: {
                            withdraw_amount: { $ne: null },
                            game_id: currentGame._id,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            // totalWithdrawAmount: { $sum: '$withdraw_amount' },
                            totalDepositeAmount: { $sum: '$deposit_amount' },
                        },
                    },
                ]);
                // const totalWithdrawAmount: number =
                // 	result.length > 0 ? result[0].totalWithdrawAmount : 0;
                const totalDepositeAmount = result.length > 0 ? result[0].totalDepositeAmount : 0;
                // const baseAmount: number = currentGame?.base_amount;
                const gameTotal = Math.round((totalDepositeAmount - (currentGame === null || currentGame === void 0 ? void 0 : currentGame.commission_amount)) * 100) / 100;
                currentGame.base_amount = gameTotal;
                currentGame.total_deposit = totalDepositeAmount;
                currentGame.save();
                // const remaining = +gameTotal - +totalWithdrawAmount;
                const timeDiffInMs = Date.now() - (currentGame === null || currentGame === void 0 ? void 0 : currentGame.start_time);
                const timeDiffInMs1 = currentGame === null || currentGame === void 0 ? void 0 : currentGame.end_time;
                let currentGameId = currentGame._id;
                // console.log("findoutgameendingprocess=========>>>>>>>>",gameTotal)
                // const X = GameController.getUp();
                // const checkAutoAPI = GameController.checkAutoBet(timer,currentGame._id);
                return {
                    status: true,
                    message: 'Up Get Successfully',
                    data: {
                        fallrate,
                        allBets,
                        is_game_end: false,
                        // timer:timer
                    },
                    error: null,
                };
            }
            catch (error) {
                return {
                    status: false,
                    message: 'ERROR',
                    data: {},
                    error: error,
                };
            }
        });
    }
    static handleWithdrawRequest(payloads) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            try {
                const ongoingGame = yield OngoingGame_1.default.findOne();
                const currentGame = yield Game_1.default.findById(ongoingGame === null || ongoingGame === void 0 ? void 0 : ongoingGame.current_game);
                // const betId = req.params.id;
                const { requestedAmount, xValue, betId } = payloads;
                const bet = yield Bet_1.default.findById(betId);
                const gameTotal = currentGame === null || currentGame === void 0 ? void 0 : currentGame.base_amount;
                // const gameTotal: number =
                // 	Math.round(
                // 		(currentGame?.total_deposit - currentGame?.commission_amount) * 100
                // 	) / 100;
                const result = yield Bet_1.default.aggregate([
                    {
                        $match: {
                            withdraw_amount: { $ne: null },
                            game_id: currentGame._id,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalWithdrawAmount: { $sum: '$withdraw_amount' },
                        },
                    },
                ]);
                const totalWithdrawAmount = result.length > 0 ? result[0].totalWithdrawAmount : 0;
                const remaining = +gameTotal - +totalWithdrawAmount;
                if (requestedAmount > remaining) {
                    (0, __1.xInterValClear)();
                    const gameEnd = yield GameController.endGame(timer);
                    if (!gameEnd) {
                        return { message: "Transaction failed!, Game ended", status: false };
                    }
                    bet.status = Bet_1.BetStatus.COMPLETED;
                    yield bet.save();
                    return { message: "Transaction failed!, Game ended", status: false };
                }
                const walletupdate = yield WalletSettings_1.default.updateOne({
                    userId: bet.user_id
                }, {
                    $inc: {
                        balance: Number(requestedAmount)
                    }
                });
                console.log("walletupdatewalletupdate=====>>>>>", walletupdate);
                bet.withdraw_amount = requestedAmount;
                bet.withdraw_at = Date.now();
                bet.status = Bet_1.BetStatus.PLACED;
                bet.xValue = xValue;
                yield bet.save();
                const gameData = yield GameController.handleGame();
                __1.io.emit('gameData', gameData);
                return { message: `Bet win amount ${requestedAmount}`, status: true };
                // return _RS.api(res, true, 'Bet Win', bet, startTime);
            }
            catch (error) {
                return { message: "Transaction failed!, Some error occurs", status: false };
                // next(error);
            }
        });
    }
    static totalBet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("totlbets................>>>>>>>>>", req.user);
            const startTime = new Date().getTime();
            try {
                let bet = yield Bet_1.default.aggregate([
                    { $match: { user_id: req.user._id } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "user_id",
                            foreignField: "_id",
                            as: "customerInfo",
                        },
                    },
                    {
                        $unwind: "$customerInfo",
                    },
                    {
                        $project: {
                            _id: 1,
                            deposit_amount: 1,
                            win_amount: 1,
                            withdraw_at: 1,
                            status: 1,
                            created_at: 1,
                            user_id: "$customerInfo._id",
                            name: "$customerInfo.name",
                            email: "$customerInfo.email",
                            mobile_number: "$customerInfo.mobile_number",
                        },
                    },
                ]).sort({ created_at: -1 });
                return ResponseHelper_1.default.api(res, true, "Btes Found Successfully", bet, startTime);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.GameController = GameController;
_a = GameController;
// static getUp = ({
// 	gameTotal,
// 	remaining,
// 	baseAmount,
// 	timeDiffInMs,
// }): number => {
// 	// console.log(
// 	// 	remaining,
// 	// 	baseAmount,
// 	// 	timeDiffInMs,
// 	// 	'------------------------------ remaining baseAmount timeDiffInMs 💥'
// 	// );
// 	const range: number = ((+remaining - +baseAmount) * timeDiffInMs) / 10000; //speed
// 	// const range: number = ((9) * timeDiffInMs) / 10000; //speed
// 	// const range: number =  timeDiffInMs / 10000; //speed
// 	console.log("baseAmount=============>>>>>>>>>>>>.",timeDiffInMs);
// 	const up: number = parseFloat(
// 		((baseAmount + range) / baseAmount).toFixed(2)
// 	);
// 	return up;
// };
GameController.withdrowalAutomatically = (betId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("withdrowalAutomatically============>>>>>>>>>>");
    const ongoingGame = yield OngoingGame_1.default.findOne();
    const currentGame = yield Game_1.default.findById(ongoingGame === null || ongoingGame === void 0 ? void 0 : ongoingGame.current_game);
    const bet = yield Bet_1.default.findById(betId);
    const gameTotal = currentGame === null || currentGame === void 0 ? void 0 : currentGame.base_amount;
    // const gameTotal: number =
    //     Math.round(
    //         (currentGame?.total_deposit - currentGame?.commission_amount) * 100
    //     ) / 100;
    const result = yield Bet_1.default.aggregate([
        {
            $match: {
                withdraw_amount: { $ne: null },
                game_id: currentGame._id,
            },
        },
        {
            $group: {
                _id: null,
                totalWithdrawAmount: { $sum: '$withdraw_amount' },
            },
        },
    ]);
    const totalWithdrawAmount = result.length > 0 ? result[0].totalWithdrawAmount : 0;
    const remaining = +gameTotal - +totalWithdrawAmount;
    if (bet.deposit_amount > remaining) {
        (0, __1.xInterValClear)();
        const gameEnd = yield GameController.endGame(timer);
        if (!gameEnd) {
            timer = 1;
            return ResponseHelper_1.default.api("res", false, 'Request Failed', {}, "startTime");
        }
        bet.status = Bet_1.BetStatus.COMPLETED;
        bet.save();
        return false;
    }
    bet.withdraw_amount = bet.deposit_amount;
    bet.withdraw_at = Date.now();
    bet.status = Bet_1.BetStatus.PLACED;
    bet.save();
    return true;
});
GameController.checkAutoBet = (xValue) => __awaiter(void 0, void 0, void 0, function* () {
    const ongoingGame = yield OngoingGame_1.default.findOne();
    const currentGame = yield Game_1.default.findById(ongoingGame === null || ongoingGame === void 0 ? void 0 : ongoingGame.current_game);
    const allBets = yield Bet_1.default.find({
        game_id: currentGame._id,
        betType: "Auto",
        status: Bet_1.BetStatus.ACTIVE,
        xValue: { $lte: xValue.toFixed(2) }
    }).populate([{ path: 'user_id' }]);
    // console.log("checkcheckcheckcheck=======>>>>>",allBets)
    // if(allBets.length>0){
    // 	for (let i = 0; i < allBets.length; i++) {
    // 		let check = await GameController.withdrowalAutomatically(allBets[i]._id);
    // 		// console.log("checkcheckcheckcheck=======>>>>>",check)
    // 		if (check === false) {
    // 			break;
    // 		}
    // 	}
    // }
    if (allBets.length > 0) {
        allBets.forEach((betsDetail, index) => __awaiter(void 0, void 0, void 0, function* () {
            yield GameController.withdrowalAutomatically(betsDetail._id);
        }));
    }
    return true;
});
