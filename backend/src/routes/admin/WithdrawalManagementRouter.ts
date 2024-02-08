import { Router } from 'express';
import { AuthController } from '../../controllers/Admin/AuthController';
import Authentication from '../../Middlewares/Authentication';
import { WithdrawalController } from '../../controllers/Admin/WithdawalController';

class Withdrawal {
	public router: Router;

	constructor() {
		this.router = Router();
		this.delete();
		this.post();
		this.get();
	}

	public delete() {
        
	}

	public post() {
		this.router.post(
			'/change/status',
			Authentication.admin,
			WithdrawalController._changeStatus
		);
	}

	public get() {
		this.router.get(
			'/get',
			Authentication.admin,
			WithdrawalController.get
		);
	}
}

export default new Withdrawal().router;
