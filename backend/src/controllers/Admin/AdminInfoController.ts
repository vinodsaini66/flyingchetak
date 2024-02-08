import _RS from '../../helpers/ResponseHelper';
import User from '../../models/User';
import { USER_TYPE } from '../../constants/user-type.enum';
import Helper from '../../helpers/Helper';
import AdminInfo from '../../models/AdminInfo';

export class AdminInfController {
	static async getDetails(req, res, next) {
		try {
			const startTime = new Date().getTime();

			const get = await AdminInfo.findOne()

			return _RS.ok(
				res,
				"Success",
				'Admin details has been get Successfully',
				get,
				startTime
			);
		} catch (err) {
			next(err);
		}
	}

	static async updateDetails(req, res, next) {
		const startTime = new Date().getTime();
		const { email, mobile_number, address, facebook, instagram } = req.body;
		try{
		const adminInfo = await AdminInfo.findOne();
		adminInfo.mobile_number = !!mobile_number
		  ? mobile_number
		  : adminInfo.mobile_number;
		adminInfo.email = !!email ? email : adminInfo.email;
		adminInfo.address = !!address ? address : adminInfo.address;
		adminInfo.instagram = !!instagram ? instagram : adminInfo.instagram;
		adminInfo.facebook = !!facebook ? facebook : adminInfo.facebook;

		await adminInfo.save();
		return _RS.api(
		  res,
		  true,
		  "Admin Details Updated Successfully",
		  {},
		  startTime
		);
	} catch (error) {
		next(error);
	  }
}}
