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
const socketIo = require('socket.io');
const Authentication_1 = require("./Middlewares/Authentication");
const app = express();
const cookieParser = require('cookie-parser');
// const { createClient } = require('redis');
// // const { config } = require('../../config');
// // const redisConfig = config.redis;
// const redisClientInit = async () => {
//    const client = await createClient({});
//   await client.connect();
//   return client;
// };
// const redis = redisClientInit();
// console.log("redis",redis)
// function setResponse(username,repos){
// 	return `<h3> ${username} has this ${repos}</h3>`
// }
// async function resuest(req,res,next){
// 	try {
// 		console.log("fetching data")
// 		const { username } = req.params;
// 		const response = await fetch(`https://api.github.com/users/${username}`)
// 		const data = await response.json();
// 		const repos = data.public_repos;
// 		// client.set(username,3600,repos)
// 		client.set("key", "value", (err, reply) => {
// 			console.log(reply); // OK
// 			client.get("key", (err, reply) => {
// 			  console.log(reply); // value
// 			});
// 		  });
// 		res.send(setResponse(username,repos))
// 	} catch (error) {
// 		console.log(error)
// 		res.status(500)
// 	}
// }
// function cache(req: Request, res: Response, next: NextFunction): void {
//     const { username } = req.params as { username: string }; // Type assertion for username
//     client.get(username, (err, data) => {
//         if (err) {
//             console.error('Redis error:', err);
//             return next(err);
//         }
//         if (data !== null) {
//             res.send(setResponse(username, data));
//         } else {
//             next(); // Call the next middleware if data is not in cache
//         }
//     });
// }
let gamedata = {};
let intervalNumber = 0;
// Define your cron job
// cron.schedule('36 23 * * *', async() => {
// 	const xValueGet = async () => {
// 		const sseId = new Date().toDateString();
// 		const gameInterval = setInterval(async () => {
// 			const gameData: {
// 				message: string;
// 				status: boolean | number;
// 				data: any;
// 				error: any;
// 			} = await GameController.getXValue();
// 			if(gameData.data.timer == 1 ){
// 				clearInterval(gameInterval);
// 				setTimeout(async() =>await xValueGet(), 10000);
// 			}
// 			gamedata = gameData
// 			console.log("cron job data=========>>>>>>>>",gamedata,gameData)
// 			return gamedata
// 		},500);
// 	}
// 	await xValueGet()
//   });
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
        // "/get/by-user-id/:id",
        this.app.get('/handle-game/:token', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.headers.accept === 'text/event-stream') {
                let verify = yield Authentication_1.default.eventAuth(req, res, next, req.params);
                if (verify) {
                    yield this.sendEvent(req, res, next, verify);
                }
                else {
                    res.json({ message: 'Unauthorized user!' });
                }
            }
            else {
                res.json({ message: 'Connection Error' });
            }
        }));
        // this.app.get("/get/resuest/:username",resuest)
        // Other routes
        this.app.use('/api', Routes_1.default);
    }
    // await GameController.handleGame();
    sendEvent(req, res, next, verify) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            res.writeHead(200, {
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
                'Content-Type': 'text/event-stream',
            });
            const sseId = new Date().toDateString();
            const handleGameInterval = () => __awaiter(this, void 0, void 0, function* () {
                intervalNumber += 1;
                let timeStart = 0;
                const gameInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    // console.log("IntervalCall");
                    // const gameData: {
                    //   message: string;
                    //   status: boolean | number;
                    //   data: any;
                    //   error: any;
                    // } = await GameController.handleGame(req,res,verify);
                    console.log("intervalNumberintervalNumber===>>>>>", intervalNumber);
                    // if (!!gameData?.data?.is_game_end) {
                    clearInterval(gameInterval);
                    this.writeEvent(res, sseId, JSON.stringify({
                        //   message: gameData.message,
                        //   status: gameData.status,
                        //   data: gameData.data,
                        //   startTime: startTime,
                        timer: gamedata,
                    }));
                    //   setTimeout(async() => await handleGameInterval(), 500);
                    // }
                    // if (!!gameData.error) {
                    //   this.handleErrors();
                    //   clearInterval(gameInterval);
                    // }
                    // this.writeEvent(
                    //   res,
                    //   sseId,
                    //   JSON.stringify({
                    // 	// message: gameData.message,
                    // 	// status: gameData.status,
                    // 	// data: gameData.data,
                    // 	// startTime: startTime,
                    // 	timer:gamedata
                    //   })
                    // );
                    // setTimeout(async() => await handleGameInterval(), 500);
                }), 500);
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
            const errorStatus = req.errorStatus || "";
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
