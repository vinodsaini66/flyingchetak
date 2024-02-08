import { Router } from 'express';
import Authentication from '../../Middlewares/Authentication';
import { EmailTemplateController } from '../../controllers/Admin/EmailTemplateController';

class EmailTemplateRouter {
	public router: Router;

	constructor() {
		this.router = Router();
		this.post();
		this.get();
	}

	public post() {
		this.router.post(
			'/add-edit/:id?',
			Authentication.admin,
			EmailTemplateController.addEdit
		);
	}

	public get() {
		this.router.get(
			'/list',
			Authentication.admin,
			EmailTemplateController.list
		);
		this.router.get(
			'/status/:id',
			Authentication.admin,
			EmailTemplateController.statusChange
		);
		this.router.get(
			'/view/:id',
			Authentication.admin,
			EmailTemplateController.view
		);
	}
}

export default new EmailTemplateRouter().router;
