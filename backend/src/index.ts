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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});


let gamedata = {}
let sethandlegame = 0
cron.schedule('01 00 * * *', async() => {
	const xValueGet = async () => {
		const sseId = new Date().toDateString();
		const XInterval = setInterval(async () => {
			const xData: {
				message: string;
				status: boolean | number;
				data: any;
				error: any;
			} = await GameController.getXValue();
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
		const gameDataGet = async () => {
		var gameInterval = setInterval(async()=>{
						const gameData: {
							message: string;
							status: boolean | number;
							data: any;
							error: any;
						  } = await GameController.handleGame();
						if(gameData.data.timer > 1 ){
							clearInterval(gameInterval);
						}
						  io.emit('gameData', gameData);
					
		},1000)
	}
	gameDataGet()
	}
	await xValueGet()
  });


//   io.use((socket, next) => {
// 	// Validate and decode token
// 	const token = socket.handshake.auth.token;
// 	try {
// 		let verify = await Authentication.eventAuth(req,res,next,req.params)
// 	  // Store user ID or any other identifier
// 	  socket.userId = decoded.userId;
// 	  next();
// 	} catch (error) {
// 	  console.error('Authentication error:', error);
// 	  next(new Error('Authentication error'));
// 	}
//   });



io.on('connection', async(socket) => {

		console.log('New user connected',socket.handshake.auth.token);
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



server.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});


// io.on('connection', (socket) => {
//   console.log('Client connected');

//   // Handle messages from the client
//   socket.on('message', (message) => {
//     console.log(`Received message: ${message}`);
//     // Broadcast the message to all connected clients
//     io.emit('message', message);
//   });

//   // Handle client disconnection
//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });


// import { Server } from 'socket.io';
// const io = new Server(8002, {
// 	cors: {
// 	  origin: "http://localhost:3000",
// 	  methods: ["GET", "POST"],
// 	  allowedHeaders: ["my-custom-header"],
// 	  credentials: true
// 	}
//   })
// const express = require('express');
// const http = require('http').createServer(express); 

// io.on("connection", (socket) => { 
// 	global.socket= socket
// 	 socket.emit("xValue","1")
// 	//   socket.on("disconnect", () => {
// 	//     console.log("A user disconnected");
// 	//   });
// });

// http.listen(port, () => {
// 	console.log(`server is listening at port ${port}`);
// 	// socketObj.init(server);
// 	// socketObj.connect();
// 	// console.log('Socket Connected');
// });


// import { Server } from './server';
// const server: any = require('http').Server(new Server().app);
// import socketObj from './services/SocketService';
// import cluster from 'cluster';
// import * as os from 'os'

// const totalCpu = os.cpus().length;
// console.log(totalCpu)
// console.log("cluster",cluster)
// if(cluster.isPrimary){
//     for(let i = 0; i < totalCpu; i++){
//         cluster.fork();
//     }
// }else{  
// let port = process.env.PORT || 8002;
// server.listen(port, () => {
// 	console.log(`server is listening at port ${port}`);
// 	socketObj.init(server);
// 	socketObj.connect();
// 	console.log('Socket Connected');
// });
// }

