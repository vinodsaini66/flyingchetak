import { Router } from 'express';
import Authentication from '../../Middlewares/Authentication';
import { UserInfoController } from '../../controllers/Admin/UserinfoController';

class UserInfoRouter {
	public router: Router;

	constructor() {
		this.router = Router();
		this.post();
		this.get();
	}

	public post() {
	  this.router.post("/add-edit", Authentication.admin, UserInfoController.addEdit);
	}

	public get() {
		this.router.get('/list', UserInfoController.list);
		this.router.get('/no-of-user', UserInfoController.totalUser);
		this.router.get('/getuser/view/:id', UserInfoController.viewUser);
		this.router.get("/withdrawal/change-status/:id", Authentication.admin, UserInfoController.withdrawalStatusChange);


	}
}

export default new UserInfoRouter().router;
