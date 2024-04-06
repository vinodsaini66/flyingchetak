import { GameController } from './controllers/App/GameController';
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

cron.schedule('48 00 * * *', async() => {
	const xValueGet = async () => {
		const sseId = new Date().toDateString();
		const gameInterval = setInterval(async () => {
			const gameData: {
				message: string;
				status: boolean | number;
				data: any;
				error: any;
			} = await GameController.getXValue();
			if(gameData.data.timer == 1 ){
				clearInterval(gameInterval);
				setTimeout(async() =>await xValueGet(), 10000);
			}
			gamedata = gameData
			console.log("cron job data=========>>>>>>>>",gamedata,gameData)
			return gamedata
		},500);
	}
	await xValueGet()
  });



io.on('connection', (socket) => {
	// console.log('A user connected');
	socket.emit("xValue",gamedata)
	// setInterval(() => {
	// 	const data = Math.random(); // Example data, replace with your actual data
	// 	socket?.emit("xValue",gamedata) // Emit data to all connected clients
	//   }, 5000);
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

