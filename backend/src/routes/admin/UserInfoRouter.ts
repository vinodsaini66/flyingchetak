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
		this.router.get('/list',Authentication.admin, UserInfoController.list);
		this.router.get('/status/:id',Authentication.admin, UserInfoController.statusChange);
		this.router.get('/no-of-user',Authentication.admin, UserInfoController.totalUser);
		this.router.get('/getuser/view/:id',Authentication.admin, UserInfoController.viewUser);
		this.router.get("/withdrawal/change-status/:id", Authentication.admin, UserInfoController.withdrawalStatusChange);


	}
}

export default new UserInfoRouter().router;
