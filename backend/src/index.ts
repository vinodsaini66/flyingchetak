import Authentication from './Middlewares/Authentication';
import { GameController } from './controllers/App/GameController';
import Game from './models/Game';
import OngoingGame from './models/OngoingGame';
import { Server } from './server';
const http = require('http'); // Require http module for creating HTTP server
const express = require('express');
const socketIo = require('socket.io');
import * as cron from 'node-cron';

const app = express();
const server = http.createServer(new Server().app); // Create HTTP server using Express app

const port = process.env.PORT || 8002;
const cors = require('cors');

app.use(cors({
  origin: true,
  credentials: true,
}));

const io = socketIo(server, {
  cors: {
    // origin: "http://localhost:3000",
	// origin:"http://34.123.238.205",
	origin:"http://web.thelotusonline777.com",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});


let gamedata = {}
let setVarForInterval = 0
var XInterval
// cron.schedule('05 23 * * *', async() => {
	const xValueGet = async () => {
		setVarForInterval = 0
		const sseId = new Date().toDateString();
			XInterval = setInterval(async () => {
			const xData: {
				message: string;
				status: boolean | number;
				data: any;
				error: any;
			} = await GameController.getXValue();
			// console.log("timetimetimeritismnbdmb......?>>>>>",xData.data)
			if(xData.data.timer == 1 ){
				clearInterval(XInterval);
				gameDataGet()
				setTimeout(async() =>await xValueGet(), 10000);
			}
			if(xData.data.timer>1){
				const checkAutoAPI = GameController.checkAutoBet(xData.data.timer);
			}
			io.emit('xValue', xData);
		},200);
		
	gameDataGet()
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
		// setTimeout(function(){
		// 	clearInterval(XInterval);
		// 	console.log('stoped');
		//   },100);
		// console.log("checkautobet=========>>>>>>>>>",XInterval)
		// if (XInterval === null) {
		// 	console.log("The interval has been cleared.");
		// 	gameDataGet()
		// 	io.emit('xValue', xData);
		// 	setTimeout(async() =>await xValueGet(), 10000);
		// } else {
		// 	// clearInterval(XInterval);
		// 	xInterValClear()
		// 	console.log("The interval is still active.");
		// }
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

		socket.emit('gameData', gameData);
		
	    socket.on('disconnect', () => {
    	  console.log('User disconnected');
    	});
  	});



server.listen(port, async() => {
	await xValueGet()
  console.log(`Server is listening at port ${port}`);
});

