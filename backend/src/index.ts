import Authentication from './Middlewares/Authentication';
import { GameController } from './controllers/App/GameController';
import Game from './models/Game';
import OngoingGame from './models/OngoingGame';
import { Server } from './server';
const http = require('http'); // Require http module for creating HTTP server
const express = require('express');
const NextFunction = require("express")
const socketIo = require('socket.io');
import * as cron from 'node-cron';
const redis = require('redis');
const client = redis.createClient();

const app = express();
const server = http.createServer(new Server().app); // Create HTTP server using Express app

const port = process.env.PORT || 8002;
const cors = require('cors');

app.use(cors({
  origin: true,
  credentials: true,
}));

export const io = socketIo(server, {
  cors: {
    // origin: "http://localhost:3000",
	// origin:"http://34.123.238.205",
	origin:"http://web.thelotusonline777.com",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});


let redisResult = {}
let setVarForInterval = 0
let gameInterval = false
let XInterval
let currentGame

const xValueGet = async () => {
	setVarForInterval = 0
	const sseId = new Date().toDateString();
		XInterval = setInterval(async () => {
			const ongoingGame = await OngoingGame.findOne();
			currentGame = await Game.findById(ongoingGame?.current_game);

		const xData: {
			message: string;
			status: boolean | number;
			data: any;
			error: any;
		} = await GameController.getXValue(currentGame);
		console.log("xDataxDataxDataxData=====>>>>>>",xData.data)
		if( currentGame?.end_time < Date.now() && !gameInterval ){
			console.log("gamerestart======>>>>>>",gameInterval)
			gameInterval = true
			clearInterval(XInterval);
			gameDataGet()
			setTimeout(async()=>{
				gameInterval = false,
				await xValueGet() 
			},10000);
		}
		// else{
		// 	const checkAutoAPI = GameController.checkAutoBet(currentGame);
		// }
		if(xData.data.timer>1){
			// const checkAutoAPI = GameController.checkAutoBet(currentGame);
		}
		io.emit('xValue', xData);
	},100);
	
	// await gameDataGet()
}

	const gameDataGet = async () => {
		var gameInterval = setInterval(async()=>{
						const gameData: {
							message: string;
							status: boolean | number;
							data: any;
							error: any;
						  } = await GameController.handleGame();
						//   console.log("gamedatagamedatagamedata==>>>>>>>>>",gameData.data.timer)
						if(gameData.data.timer > 1 ){
							clearInterval(gameInterval);
						}
						  io.emit('gameData', gameData);
					
		},1000)
	}
	
	export const xInterValClear = async() => {
		const xData = { data:{
			timer:1}
		}
		clearInterval(XInterval);  
		if(setVarForInterval === 0){
			setVarForInterval += 1
			gameDataGet()
			io.emit('xValue', xData);
			setTimeout(async() =>await xValueGet(), 10000);
		}
	}

  io.on('connection', async(socket) => {

		// console.log('New user connected',socket.handshake.auth.token);
		const { token } = socket.handshake.auth;
		const gameData: {
			message: string;
			status: boolean | number;
			data: any;
			error: any;
		  } = await GameController.handleGame();
		  if(token){
			var userId = await Authentication.socketAuth(token)
            userId && socket.join(userId);
		  }
		 
		socket.emit('gameData', gameData);
		socket.on("withdrawal",async(payloads)=>{
			console.log("payloadpayload=========>>>",payloads)
			const withdRes = await GameController.handleWithdrawRequest(payloads)
			if(withdRes.status){
				io.to(userId).emit('WithdrawalPlaced',withdRes);
			}
			else{
				io.to(userId).emit('WithdrawalPlaced', withdRes);
			}
			
		})
		
		socket.on('placeBet', async(payload) => {
			const betRes = await GameController.bet(payload,userId)
			if(betRes.status){
				io.to(userId).emit('betPlaced',betRes);
			}
			else{
				io.to(userId).emit('betPlaced', betRes);
			}

		});
		socket.on('placeAutoBet', async(payload) => {
			const betRes = await GameController.autoBet(payload,userId)
			if(betRes.status){
				io.to(userId).emit('autoBetPlaced', betRes);
			}
			else{
				io.to(userId).emit('autoBetPlaced', betRes);
			}

		});

	    socket.on('disconnect', () => {
    	  console.log('User disconnected');
    	});
  	});



server.listen(port, async() => {
	await xValueGet()
  console.log(`Server is listening at port ${port}`);
});

