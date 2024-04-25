import { Router } from 'express';

import Authentication from '../../Middlewares/Authentication';
import { GameController } from '../../controllers/App/GameController';

class GameRoutes {
	public router: Router;

	constructor() {
		this.router = Router();
		this.post();
		this.get();
	}

	public post() {
		this.router.post('/deposit', Authentication.user, GameController.bet);
		// this.router.post(
		// 	'/withdraw/:id',
		// 	Authentication.user,
		// 	GameController.handleWithdrawRequest
		// );
		this.router.post('/autoBet', Authentication.user, GameController.autoBet);
	}

	public get() {
		this.router.get('/', Authentication.user, GameController.getGamePageData);
		this.router.get('/bets', Authentication.user, GameController.totalBet);
		this.router.get('/fall-rate', Authentication.user, GameController.Fallrate);


	}
}

export default new GameRoutes().router;
