import { Router } from 'express';
import UploadFiles from '../Middlewares/FileUploadMiddleware';
import { CommonController } from '../controllers/CommonController';

class CommonRoutes {
	public router: Router;

	constructor() {
		this.router = Router();
		this.post();
		this.get();
	}

	public post() {
		this.router.post(
			'/image-upload',
			UploadFiles.upload,
			CommonController.uploadImage
		);

		this.router.post(
			'/pdf-upload',
			UploadFiles.upload,
			CommonController.uploadDocument
		);
	}

	public get() {
		this.router.get('/app-setting', CommonController.appSetting);

		this.router.post('/country-list', CommonController.countryList);
		this.router.post('/state-list', CommonController.stateList);
		this.router.post('/city-list', CommonController.cityList);

		this.router.get('/banner/:type?', CommonController.banner);
		this.router.get('/content/:slug', CommonController.content);

		this.router.get('/customer', CommonController.customer);

		// this.router.
	}
}

export default new CommonRoutes().router;
