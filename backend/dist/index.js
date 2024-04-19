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
Object.defineProperty(exports, "__esModule", { value: true });
const GameController_1 = require("./controllers/App/GameController");
const server_1 = require("./server");
const http = require('http'); // Require http module for creating HTTP server
const express = require('express');
const socketIo = require('socket.io');
const cron = require("node-cron");
const app = express();
const server = http.createServer(new server_1.Server().app); // Create HTTP server using Express app
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
        origin: "http://web.thelotusonline777.com",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
let gamedata = {};
let sethandlegame = 0;
cron.schedule('05 23 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    const xValueGet = () => __awaiter(void 0, void 0, void 0, function* () {
        const sseId = new Date().toDateString();
        const XInterval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            const xData = yield GameController_1.GameController.getXValue();
            if (xData.data.timer == 1) {
                clearInterval(XInterval);
                gameDataGet();
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () { return yield xValueGet(); }), 10000);
            }
            if (xData.data.timer > 1) {
                const checkAutoAPI = GameController_1.GameController.checkAutoBet(xData.data.timer);
            }
            io.emit('xValue', xData);
        }), 200);
        const gameDataGet = () => __awaiter(void 0, void 0, void 0, function* () {
            var gameInterval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
                const gameData = yield GameController_1.GameController.handleGame();
                if (gameData.data.timer > 1) {
                    clearInterval(gameInterval);
                }
                io.emit('gameData', gameData);
                io.on('token', (token) => {
                    console.log("tokentokentokentoken=========>>>>>>>>>", token);
                });
            }), 1000);
        });
        gameDataGet();
    });
    yield xValueGet();
}));
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('New user connected', socket.handshake.auth.token);
    const { token } = socket.handshake.auth;
    const gameData = yield GameController_1.GameController.handleGame();
    socket.emit('gameData', gameData);
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
}));
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
