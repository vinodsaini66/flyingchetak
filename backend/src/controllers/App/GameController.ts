import { response } from 'express';
import Game from '../../models/Game';
import _RS from '../../helpers/ResponseHelper';
import Bet, { BetStatus } from '../../models/Bet';
import OngoingGame from '../../models/OngoingGame';
import Wallet from '../../models/WalletSettings';
import Helper from '../../helpers/Helper';
import Transaction, {
	Status_Types,
	Transaction_Modes,
	Transaction_Types,
} from '../../models/TransactionSetting';
import AdminSetting from '../../models/AdminSetting';
import * as express from 'express';
import { io, xInterValClear } from '../..';
const { ObjectId } = require('mongodb');
let timer = 1;
let gameId = "";
let secondCount = 0;
const myArray = [5,7,8,9,6,10];
const randomIndex = Math.floor(Math.random() * myArray.length);
let randomItem = myArray[randomIndex];
let isTimerPaused = false
let currentTime
export class GameController {
	static async getGamePageData(req, res, next) {
		console.log("getgamepagedata=========>>>>>>>>>..")
		const startTime = new Date().getTime();
		try {
			const ongoingGame = await OngoingGame.findOne().populate([
				{ path: 'current_game' },
			]);

			const gameBets = await Bet.find({
				game_id: ongoingGame?.current_game?._id,
			}).populate([{ path: 'user_id' }]);

			const minBetAmount = (await AdminSetting.findOne())?.min_bet;

			const userBets = await Bet.find({
				user_id: req.user.id,
				game_id: ongoingGame?.current_game?._id,
			});

			const wallet = await Wallet.findOne({ userId: req.user.id });

			if (!wallet) {
				const newWallet = await new Wallet({
					userId: req.user.id,
					balance: 0,
				}).save();

				return _RS.api(
					res,
					true,
					'Game Data Get Successfully',
					{
						balance: newWallet?.balance,
						ongoingGame,
						bets: gameBets,
						minBetAmount,
						userBets,
					},
					startTime
				);
			}

			return _RS.api(
				res,
				true,
				'Game Data Get Successfully',
				{
					balance: wallet?.balance,
					ongoingGame,
					bets: gameBets,
					minBetAmount,
					userBets,
				},
				startTime
			);
		} catch (error) {
			next(error);
		}
	}


	static async Fallrate(req, res, next) {
		console.log("Fallrate=========>>>>>>>>>..")

		const startTime = new Date().getTime();
		try {
			const fallrate = await Game.find().limit(10).sort({created_at:-1})
				return _RS.api(
					res,
					true,
					'Fall rate Get Successfully',
					fallrate,
					startTime
				);
			
		} catch (error) {
			next(error);
		}
	}

	static async bet(payload,userId) {
		console.log("bet==========>>>>>>>>>>>")
		const startTime = new Date().getTime();
		try {
			const { amount,betType,boxType } = payload;
			const wallet = await Wallet.findOne({ userId: userId });
			const walletTransactionData = {
				payee: userId,
				receiver: Helper?.admin?._id, //adminId,
				transaction_id: Helper.generateAlphaString(6),
				amount: amount,
				transaction_mode: Transaction_Modes.USER,
				transaction_type: Transaction_Types.DEBIT,
				status: Status_Types.SUCCESS,
				wallet_id: wallet._id,
				bidType: "manual",
			};

			const transaction = await new Transaction(walletTransactionData).save();
			if (transaction) {
				wallet.balance = +wallet.balance - +amount;
				wallet.save();
			}

			const ongoingGame = await OngoingGame.findOne();
			const nextGame = await Game.findById(ongoingGame?.current_game);

			// generate bet
			const betData = {
				game_id: nextGame?._id, //next game id
				user_id: userId,
				status: BetStatus.ACTIVE,
				deposit_amount: amount,
				betType:betType,
				boxType:boxType
			};

			const bet = await new Bet(betData).save();
			console.log("bet=====>>>>>>>>>>",bet);
			// update game total deposit
			if (bet) {
				const newAmount: number = +nextGame?.total_deposit + +amount;
				const gameAdminCommissionPercentage = 10;
				// number = (
				// 	await AdminSetting.findOne()
				// ).bet_commission;
				const updatedAdminCommission: number =
					Math.round(
						((gameAdminCommissionPercentage * newAmount) / 100) * 100
					) / 100;
				nextGame.total_deposit = newAmount;
				nextGame.commission_amount = updatedAdminCommission;

				await nextGame.save();
				const gameData: {
					message: string;
					status: boolean | number;
					data: any;
					error: any;
				  } = await GameController.handleGame();
				  io.emit('gameData', gameData);
				return {message:"Your bet has been successfully placed!",status:true}
			} else {
				wallet.balance = +wallet.balance + +amount;
				transaction.status = Status_Types.FAILED;
				await transaction.save();
				await wallet.save();
				return {message:"Transaction failed!, Money is re added to your wallet",status:false}
				
			}
		} catch (error) {
			return {message:"Transaction failed!, Some error occurs",status:false}
			// next(error);
		}
	}

	// auto bet 
	static async autoBet(payload,userId) {
		console.log("autoBet==========>>>>>>>>>>>")
		const startTime = new Date().getTime();
		try {
			const { amount,xValue,boxType,betType } = payload;
			const wallet = await Wallet.findOne({ userId: userId });
			const walletTransactionData = {
				payee: userId,
				receiver: Helper?.admin?._id, //adminId,
				transaction_id: Helper.generateAlphaString(6),
				amount: amount,
				transaction_mode: Transaction_Modes.USER,
				transaction_type: Transaction_Types.DEBIT,
				status: Status_Types.SUCCESS,
				wallet_id: wallet._id,
				betType: betType,
				xValue: xValue
			};
	
			const transaction = await new Transaction(walletTransactionData).save();
			console.log("transaction======",transaction);
			if (transaction) {
				wallet.balance = +wallet.balance - +amount;
				wallet.save();
			}
	
			const ongoingGame = await OngoingGame.findOne();
			const nextGame = await Game.findById(ongoingGame?.current_game);
	
			// generate bet
			const betData = {
				game_id: nextGame?._id, //next game id
				user_id: userId,
				status: BetStatus.ACTIVE,
				deposit_amount: amount*xValue,
				xValue:xValue,
				betType:betType,
				boxType:boxType
			};
	
			const bet = await new Bet(betData).save();
			console.log("bet=====",bet);
			// update game total deposit
			if (bet) {
				const newAmount: number = +nextGame?.total_deposit + +amount;
				const gameAdminCommissionPercentage = 10;
				// number = (
				// 	await AdminSetting.findOne()
				// ).bet_commission;
				const updatedAdminCommission: number =
					Math.round(
						((gameAdminCommissionPercentage * newAmount) / 100) * 100
					) / 100;
				nextGame.total_deposit = newAmount;
				nextGame.commission_amount = updatedAdminCommission;
	
				await nextGame.save();
			} else {
				wallet.balance = +wallet.balance + +amount;
				transaction.status = Status_Types.FAILED;
				await transaction.save();
				await wallet.save();
				return {message:"Transaction Failed, Money is re added to your wallet",status:false}
				// return _RS.api(
				// 	res,
				// 	false,
				// 	'Transaction Failed, Money is re added to your wallet',
				// 	{},
				// 	startTime
				// );
			}
			return {message:"Your bet has been successfully placed!",status:true}
	
			// return _RS.api(
			// 	res,
			// 	true,
			// 	'Bet Successfully Submitted',
			// 	{ transaction, wallet },
			// 	startTime
			// );
		} catch (error) {
			return {message:"Transaction failed!, Some error occurs",status:false}
			// next(error);
		}
	}
	// auto bet end function

	static async getCurrentGameSession(req, res, next) {
		console.log("getCurrentGameSession==========>>>>>>>>>>>")
		const startTime = new Date().getTime();
		try {
			const activeGame = await Game.findOne({ is_active: true });
			if (!activeGame) {
				return _RS.api(
					res,
					false,
					'No Active Games Found, Please Try Again Later',
					{},
					startTime
				);
			}
			return _RS.api(res, true, 'Game Get Successfully', activeGame, startTime);
		} catch (error) {
			next(error);
		}
	}

	// end game and generate new game.
	static async endGame(timerValue) {
		try {
			const myArray1 = [90, 60, 30, 40, 50];
			const randomIndex1 = Math.floor(Math.random() * myArray.length);
			 randomItem = myArray[randomIndex];
			console.log("endGame==========>>>>>>>>>>>",randomItem)
			
			//  socketTokenMap.set("_id", undefined);
			const ongoingGame = await OngoingGame.findOne();
			const nextGame = await Game.findById(ongoingGame?.next_game);
			// change all current bet status to completed (only players who have't withdrawed money, as for else it was already updated to placed)
			const updateBetStatus = await Bet.updateMany(
				{
					game_id: ongoingGame.current_game,					
					status: BetStatus.ACTIVE,
				},
				{
					status: BetStatus.COMPLETED,
				}
			);

			// generate new game
			const newGameData = {
				// session: 'fdhjhgjkhdfkg',
				total_deposit: 0,
				commission_amount: 0,
				base_amount: (
					await Bet.findOne({ game_id: nextGame._id })
						.sort({ deposit_amount: -1 })
						.exec()
				)?.deposit_amount?(
					await Bet.findOne({ game_id: nextGame._id })
						.sort({ deposit_amount: -1 })
						.exec()
				)?.deposit_amount:0,
				fall_rate: 0,
				earning: 0,
				start_time: Date.now()+(10*1000),
				end_time: Date.now()+(randomItem*1000),
			};

			const newNextGame = await new Game(newGameData).save();

			// update bet statuses for new current game
			const newCurrentBets = await Bet.updateMany(
				{
					status: BetStatus.PENDING,
					game_id: ongoingGame.next_game,
				},
				{
					status: BetStatus.ACTIVE,
				}
			);
			await Game.updateOne(
				{
					_id: ongoingGame.current_game,
				},
				{
					fall_rate: Number(timerValue),
				}
			);
			ongoingGame.current_game = ongoingGame.next_game;
			ongoingGame.next_game = newNextGame._id;
			ongoingGame.fall_rate = timerValue;

			const maxBet = await Bet.findOne({ game_id: nextGame._id })
				.sort({ deposit_amount: -1 })
				.exec();

			// console.log(maxBet, '---------');

			nextGame.start_time = Date.now()+(10*1000);
			nextGame.end_time= Date.now()+(90*1000);
			// nextGame.base_amount = (maxBet?.deposit_amount)?(maxBet?.deposit_amount):10;
			await nextGame.save();
			timer = 1;
			await ongoingGame.save();
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}

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

	
	static withdrowalAutomatically=async(betId,currentGame)=>{
		console.log("withdrowalAutomatically============>>>>>>>>>>")
		// const ongoingGame = await OngoingGame.findOne();
        // const currentGame = await Game.findById(ongoingGame?.current_game);
        const bet = await Bet.findById(betId);
        const gameTotal: number = currentGame?.base_amount;
        // const gameTotal: number =
        //     Math.round(
        //         (currentGame?.total_deposit - currentGame?.commission_amount) * 100
        //     ) / 100;
			const result = await Bet.aggregate([
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
		const totalWithdrawAmount: number = result.length > 0 ? result[0].totalWithdrawAmount : 0;
        const remaining: number = +gameTotal - +totalWithdrawAmount;
		if (bet.deposit_amount > remaining) {
			xInterValClear()
			currentGame.end_time = Date.now()
			currentGame.save()
            const gameEnd = await GameController.endGame(timer);
            if (!gameEnd) {
				timer = 1
            	return _RS.api("res", false, 'Request Failed', {}, "startTime");
            }
            bet.status = BetStatus.COMPLETED;
            bet.save();
            return false;
        }

        bet.withdraw_amount = bet.deposit_amount;
        bet.withdraw_at = Date.now();
        bet.status = BetStatus.PLACED;
        bet.save();
		return true;
	} 

	static checkAutoBet = async(currentGame) => {
		
		// const ongoingGame = await OngoingGame.findOne();
		// const currentGame = await Game.findById(ongoingGame?.current_game);
		const allBets = await Bet.find({
			game_id: currentGame._id,
			betType: "Auto",
			status: BetStatus.ACTIVE,
			xValue: { $lte: timer.toFixed(2) }
		}).populate([{ path: 'user_id' }]);
		console.log("timetimetimeritismnbdmb......?>>>>>",allBets)
		if(allBets.length>0){
			allBets.forEach(async(betsDetail, index) => {
				await GameController.withdrowalAutomatically(betsDetail._id,currentGame);
			});
		}
		return true;
	};
	static async getXValue(nextGame): Promise<{
		message: string;
		status: boolean | number;
		data: any;
		error: any;
	}> {
		try {	
			// secondCount++;
					if(nextGame?.end_time < Date.now() && !isTimerPaused){
						isTimerPaused = true
						// setTimeout(async() =>await GameController.endGame(timer), 10000);
						const gameEnd = await GameController.endGame(timer);
						timer = 1;
					}else{
						isTimerPaused = false
						timer += 0.01
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
		} catch (error) {
			return {
				status: false,
				message: 'ERROR',
				data: {},
				error: error,
			};
		}
	}
	static async handleGame(): Promise<{
		message: string;
		status: boolean | number;
		data: any;
		error: any;
	}> {
		try {
			const ongoingGame = await OngoingGame.findOne();
			// let currentGame
			// let allBets
			// if(timer == 1){
			// 	currentGame = await Game.findById(ongoingGame?.next_game);
			// 	allBets = await Bet.find({
			// 		game_id: currentGame?._id,
			// 	}).populate([{ path: 'user_id' }]);
			// }
			// else{
				const currentGame = await Game.findById(ongoingGame?.current_game);
				const allBets = await Bet.find({
					game_id: currentGame?._id,
				}).populate([{ path: 'user_id' }]);
			// }
			const fallrate = await Game.find().limit(10).sort({created_at:-1})
			// let userBets = await Bet.find({user_id:userId}).sort({created_at:-1})
			

			
			const result = await Bet.aggregate([
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
			const totalDepositeAmount: number =
				result.length > 0 ? result[0].totalDepositeAmount : 0;

				// const baseAmount: number = currentGame?.base_amount;
			const gameTotal: number =
				Math.round(
					(totalDepositeAmount - currentGame?.commission_amount) * 100
				) / 100;
				currentGame.base_amount = gameTotal
				currentGame.total_deposit = totalDepositeAmount
				currentGame.save()

			// const remaining = +gameTotal - +totalWithdrawAmount;
			const timeDiffInMs: number = Date.now() - currentGame?.start_time	
			const timeDiffInMs1: number = currentGame?.end_time;
			
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
		} catch (error) {
			return {
				status: false,
				message: 'ERROR',
				data: {},
				error: error,
			};
		}
	}

	static async handleWithdrawRequest(payloads) {
		const startTime = new Date().getTime();
		try {
			const ongoingGame = await OngoingGame.findOne();
			const currentGame = await Game.findById(ongoingGame?.current_game);

			// const betId = req.params.id;
			const { requestedAmount,xValue,betId } = payloads
			const bet = await Bet.findById(betId);

			const gameTotal: number = currentGame?.base_amount;
			// const gameTotal: number =
			// 	Math.round(
			// 		(currentGame?.total_deposit - currentGame?.commission_amount) * 100
			// 	) / 100;

			const result = await Bet.aggregate([
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
			const totalWithdrawAmount: number =
				result.length > 0 ? result[0].totalWithdrawAmount : 0;

			const remaining: number = +gameTotal - +totalWithdrawAmount;

			if (requestedAmount > remaining) {
				xInterValClear()
				const gameEnd = await GameController.endGame(timer);
				if (!gameEnd) {
					return {message:"Transaction failed!, Game ended",status:false}
				}
				bet.status = BetStatus.COMPLETED;
				await bet.save();
				

				return {message:"Transaction failed!, Game ended",status:false}
			}
			const walletupdate = await Wallet.updateOne({
				userId: bet.user_id
			  },{
				$inc: {
					balance: Number(requestedAmount)
				}
			  });
			  console.log("walletupdatewalletupdate=====>>>>>",walletupdate)
			bet.withdraw_amount = requestedAmount;
			bet.withdraw_at = Date.now();
			bet.status = BetStatus.PLACED;
			bet.xValue = xValue
			await bet.save();
			const gameData: {
				message: string;
				status: boolean | number;
				data: any;
				error: any;
			  } = await GameController.handleGame();
			io.emit('gameData', gameData);
			return {message:`Bet win amount ${requestedAmount}`,status:true}
			// return _RS.api(res, true, 'Bet Win', bet, startTime);
		} catch (error) {
			return {message:"Transaction failed!, Some error occurs",status:false}
			// next(error);
		}
	}


	static async totalBet(req,res,next) {
		console.log("totlbets................>>>>>>>>>",req.user)
		const startTime = new Date().getTime();
		try{
			let bet=await Bet.aggregate([
				{$match:{user_id:req.user._id}},
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
							  withdraw_at:1,
							  status:1,
							  created_at:1,
							  user_id:"$customerInfo._id",
							  name:"$customerInfo.name",
							  email:"$customerInfo.email",
							  mobile_number:"$customerInfo.mobile_number",
							},
					  },
				]).sort({created_at:-1})

			return _RS.api(
                res,
                true,
                "Btes Found Successfully",
                bet,
                startTime
              );
		}catch(error){
			next(error)
		}

	}
}