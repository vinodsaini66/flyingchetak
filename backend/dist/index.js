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
exports.xInterValClear = void 0;
const GameController_1 = require("./controllers/App/GameController");
const server_1 = require("./server");
const http = require('http'); // Require http module for creating HTTP server
const express = require('express');
const socketIo = require('socket.io');
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
let setVarForInterval = 0;
var XInterval;
// cron.schedule('05 23 * * *', async() => {
const xValueGet = () => __awaiter(void 0, void 0, void 0, function* () {
    setVarForInterval = 0;
    const sseId = new Date().toDateString();
    XInterval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const xData = yield GameController_1.GameController.getXValue();
        // console.log("timetimetimeritismnbdmb......?>>>>>",xData.data)
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
    gameDataGet();
});
const gameDataGet = () => __awaiter(void 0, void 0, void 0, function* () {
    var gameInterval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const gameData = yield GameController_1.GameController.handleGame();
        //   console.log("gamedatagamedatagamedata==>>>>>>>>>",gameData.data.timer)
        if (gameData.data.timer > 1) {
            clearInterval(gameInterval);
        }
        io.emit('gameData', gameData);
    }), 1000);
});
const xInterValClear = () => __awaiter(void 0, void 0, void 0, function* () {
    const xData = { data: {
            timer: 1
        }
    };
    clearInterval(XInterval);
    if (setVarForInterval === 0) {
        setVarForInterval += 1;
        gameDataGet();
        io.emit('xValue', xData);
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () { return yield xValueGet(); }), 10000);
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
});
exports.xInterValClear = xInterValClear;
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('New user connected',socket.handshake.auth.token);
    const { token } = socket.handshake.auth;
    const gameData = yield GameController_1.GameController.handleGame();
    socket.emit('gameData', gameData);
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
}));
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield xValueGet();
    console.log(`Server is listening at port ${port}`);
}));
