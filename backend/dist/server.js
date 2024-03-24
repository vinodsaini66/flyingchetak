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
exports.Server = void 0;
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Env_1 = require("./environments/Env");
const Routes_1 = require("./routes/Routes");
const path = require("path");
const GameController_1 = require("./controllers/App/GameController");
const cron = require("node-cron");
let gamedata = {};
// Define your cron job
cron.schedule('05 20 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    const xValueGet = () => __awaiter(void 0, void 0, void 0, function* () {
        const gameInterval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            const gameData = yield GameController_1.GameController.getXValue();
            if (gameData.data.timer == 1) {
                clearInterval(gameInterval);
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () { return yield xValueGet(); }), 10000);
            }
            gamedata = gameData;
            // console.log("cron job data",gamedata,gameData)
            return gamedata;
        }), 1000);
    });
    yield xValueGet();
}));
const app = express();
const cookieParser = require('cookie-parser');
const SEND_INTERVAL = 100;
class Server {
    constructor() {
        this.app = express();
        this.setConfigurations();
        this.setRoutes();
        this.error404Handler();
        this.handleErrors();
    }
    setConfigurations() {
        this.setMongodb();
        this.enableCors();
        this.configBodyParser();
    }
    setMongodb() {
        console.log('db===>>>', (0, Env_1.env)());
        mongoose
            .connect((0, Env_1.env)().dbUrl, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(() => {
            console.log('Database connected');
        })
            .catch((e) => {
            console.log('e=========>', e);
        });
    }
    enableCors() {
        this.app.use(cors({
            origin: true,
            credentials: true,
        }));
    }
    configBodyParser() {
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
        this.app.use(express.json({ limit: '10mb' }));
    }
    setRoutes() {
        this.app.use((req, res, next) => {
            res.startTime = new Date().getTime();
            next();
        });
        this.app.use('/api-doc', express.static(path.resolve(process.cwd() + '/apidoc')));
        this.app.use('/img', express.static(path.resolve(process.cwd() + '/assest/images')));
        app.use('./uploads', express.static(path.join(__dirname, 'uploads')));
        // Add the SSE route
        // this.app.get('/handle-game', GameController.handleGame);
        this.app.get('/handle-game', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.headers.accept === 'text/event-stream') {
                yield this.sendEvent(req, res, next);
            }
            else {
                res.json({ message: 'Connection Error' });
            }
        }));
        // Other routes
        this.app.use('/api', Routes_1.default);
    }
    // await GameController.handleGame();
    sendEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("startGame");
            const startTime = new Date().getTime();
            res.writeHead(200, {
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
                'Content-Type': 'text/event-stream',
            });
            const sseId = new Date().toDateString();
            const handleGameInterval = () => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                let timeStart = 0;
                //   const gameInterval = setInterval(async () => {
                // console.log("IntervalCall");
                const gameData = yield GameController_1.GameController.handleGame();
                console.log("gameEnd=====APICAll", (_a = gameData === null || gameData === void 0 ? void 0 : gameData.data) === null || _a === void 0 ? void 0 : _a.is_game_end);
                if (!!((_b = gameData === null || gameData === void 0 ? void 0 : gameData.data) === null || _b === void 0 ? void 0 : _b.is_game_end)) {
                    //   clearInterval(gameInterval);
                    this.writeEvent(res, sseId, JSON.stringify({
                        message: gameData.message,
                        status: gameData.status,
                        data: gameData.data,
                        startTime: startTime,
                        timer: gamedata,
                    }));
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () { return yield handleGameInterval(); }), 1000);
                }
                if (!!gameData.error) {
                    this.handleErrors();
                    //   clearInterval(gameInterval);
                }
                this.writeEvent(res, sseId, JSON.stringify({
                    message: gameData.message,
                    status: gameData.status,
                    data: gameData.data,
                    startTime: startTime,
                    timer: gamedata
                }));
                setTimeout(() => __awaiter(this, void 0, void 0, function* () { return yield handleGameInterval(); }), 1000);
                //   }, 1000);
            }); // Bind the function to the current context
            yield handleGameInterval();
        });
    }
    writeEvent(res, sseId, data) {
        res.write(`id: ${sseId}\n`);
        res.write(`data: ${data}\n\n`);
    }
    error404Handler() {
        this.app.use((req, res) => {
            res.status(404).json({
                message: 'Route not found test',
                status: 404,
            });
        });
    }
    handleErrors() {
        this.app.use((error, req, res, next) => {
            const errorStatus = req.errorStatus;
            res.status(errorStatus || 500).json({
                message: error.message || 'Something went wrong!!',
                statusText: error.statusText || 'ERROR',
                status: errorStatus || 500,
                data: {},
            });
        });
    }
}
exports.Server = Server;
