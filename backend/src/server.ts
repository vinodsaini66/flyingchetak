import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import { env } from './environments/Env';
import Routes from './routes/Routes';
import { NextFunction } from 'express';
import path = require('path');
import { ReqInterface, ResInterface } from './interfaces/RequestInterface';
import { GameController } from './controllers/App/GameController';
import * as cron from 'node-cron';
let gamedata = {}
// Define your cron job
cron.schedule('05 20 * * *', async() => {
	const xValueGet = async () => {
		const gameInterval = setInterval(async () => {
			const gameData: {
				message: string;
				status: boolean | number;
				data: any;
				error: any;
			} = await GameController.getXValue();
			if(gameData.data.timer== 1 ){
				clearInterval(gameInterval);
				setTimeout(async() =>await xValueGet(), 10000);
			}
			gamedata = gameData
			// console.log("cron job data",gamedata,gameData)
			return gamedata
		},1000);
	}
	await xValueGet()
  });


const app = express();
const cookieParser = require('cookie-parser');

const SEND_INTERVAL = 100;

export class Server {
	public app: express.Application = express();

	constructor() {
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
		console.log('db===>>>', env());
		mongoose
			.connect(env().dbUrl, {
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
		this.app.use(
			cors({
				origin: true,
				credentials: true,
			})
		);
	}

	configBodyParser() {
		this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
		this.app.use(express.json({ limit: '10mb' }));
	}

	setRoutes() {
		this.app.use(
			(req: ReqInterface, res: ResInterface, next: express.NextFunction) => {
				res.startTime = new Date().getTime();
				next();
			}
		);
		this.app.use(
			'/api-doc',
			express.static(path.resolve(process.cwd() + '/apidoc'))
		);
		this.app.use(
			'/img',
			express.static(path.resolve(process.cwd() + '/assest/images'))
		);
		app.use('./uploads', express.static(path.join(__dirname, 'uploads')));

		// Add the SSE route
		// this.app.get('/handle-game', GameController.handleGame);

		this.app.get('/handle-game', async (req, res, next) => {
			if (req.headers.accept === 'text/event-stream') {
				await this.sendEvent(req, res, next);
			} else {
				res.json({ message: 'Connection Error' });
			}
		});

		// Other routes
		this.app.use('/api', Routes);
	}
	// await GameController.handleGame();
	async sendEvent(req: express.Request, res: express.Response, next) {
		console.log("startGame");
		const startTime = new Date().getTime();
		res.writeHead(200, {
		  'Cache-Control': 'no-cache',
		  Connection: 'keep-alive',
		  'Content-Type': 'text/event-stream',
		});
		const sseId = new Date().toDateString();
		const handleGameInterval = async () => {
			let timeStart = 0;
		//   const gameInterval = setInterval(async () => {
			// console.log("IntervalCall");
			const gameData: {
			  message: string;
			  status: boolean | number;
			  data: any;
			  error: any;
			} = await GameController.handleGame();
			console.log("gameEnd=====APICAll",gameData?.data?.is_game_end);
			if (!!gameData?.data?.is_game_end) {
			//   clearInterval(gameInterval);
			  this.writeEvent(
				res,
				sseId,
				JSON.stringify({
				  message: gameData.message,
				  status: gameData.status,
				  data: gameData.data,
				  startTime: startTime,
				  timer:gamedata,
				})
			  );
			  setTimeout(async() => await handleGameInterval(), 1000);
			}
	  
			if (!!gameData.error) {
			  this.handleErrors();
			//   clearInterval(gameInterval);
			}
	  
			this.writeEvent(
			  res,
			  sseId,
			  JSON.stringify({
				message: gameData.message,
				status: gameData.status,
				data: gameData.data,
				startTime: startTime,
				timer:gamedata
			  })
			);
			setTimeout(async() => await handleGameInterval(), 1000);
		//   }, 1000);
		} // Bind the function to the current context
	  
		await handleGameInterval();
	}
	  
	  

	writeEvent(res: express.Response, sseId: string, data: string) {
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
		this.app.use((error: any, req, res, next: NextFunction) => {
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
