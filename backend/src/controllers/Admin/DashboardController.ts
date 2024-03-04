import _RS from '../../helpers/ResponseHelper';
import User from '../../models/User';
import { USER_TYPE } from '../../constants/user-type.enum';
import Helper from '../../helpers/Helper';
import Transaction from '../../models/TransactionSetting';

export class DashboardController {
	static async dashboardData(req, res, next) {
		try {
			const startTime = new Date().getTime();

			const [customerCount] = await Promise.all([
				User.countDocuments({ type: USER_TYPE.customer }),
				// User.countDocuments({ type: USER_TYPE.serviceProvider }),
			]);

			// const earnings = await Wallet.findOne({ user_id: Helper.admin._id });
			const get = await Transaction.aggregate([
				{
					$lookup: {
					  from: "users",
					  localField: "payee",
					  foreignField: "_id",
					  as: "customerInfo",
					},
				},
				{
					$unwind: "$customerInfo",
				  },
					{
						$project: {
						  _id: 1, 
						  amount: 1,
						  transaction_type: 1,
						  transaction_id:1,
						  status:1,
						  created_at:1,
						  user_id:"$customerInfo._id",
						  name:"$customerInfo.name",
						  email:"$customerInfo.email",
						  mobile_number:"$customerInfo.mobile_number",
						  account_number:"$customerInfo.bank_info.account_number",
						  ifsc_code:"$customerInfo.bankInfo.ifsc_code",
						  account_holder:"$customerInfo.bankInfo.account_holder"
			  
			  
						  // Add more fields as needed
						},
				  },
			]).sort({ created_at: -1 }).limit(10);
			let data = {
				customerCount: customerCount,
				tentransaction:get
				// earnings: !!earnings ? earnings : null,
			};


			return _RS.ok(
				res,
				'SUCCESS',
				'Dashboard data has been get Successfully',
				data,
				startTime
			);
		} catch (err) {
			next(err);
		}
	}
	static async dashboardBoxData(req, res, next) {
		try {
			const startTime = new Date().getTime();
			let getTransaction = await Transaction.aggregate([
				{
				  $match: {
					transaction_type: { $in: ["Debit", "Credit"] } // Filter only debit and credit transactions
				  }
				},
				{
				  $group: {
					_id: "$transaction_type",
					totalAmount: { $sum: "$amount" }
				  }
				}
			  ]);
			

			return _RS.ok(
				res,
				'SUCCESS',
				'Dashboard data has been get Successfully',
				getTransaction,
				startTime
			);
		} catch (err) {
			next(err);
		}
	}
}
