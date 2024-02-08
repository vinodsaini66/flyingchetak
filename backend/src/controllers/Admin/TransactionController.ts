import _RS from '../../helpers/ResponseHelper';
import User from '../../models/User';
import { USER_TYPE } from '../../constants/user-type.enum';
import Helper from '../../helpers/Helper';
import AdminInfo from '../../models/AdminInfo';
import Transaction from "../../models/TransactionSetting"
import Bet from '../../models/Bet';
const { ObjectId } = require('mongodb');

export class TransactionController {

	static async getTransaction(req, res, next) {
		try {
			const startTime = new Date().getTime();

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
						},
				  },
			])

			return _RS.ok(
				res,
				"Success",
				'Transaction Found Successfully',
				get,
				startTime
			);
		} catch (err) {
			next(err);
		}
}
static async getTransactionByUserId(req, res, next) {
	try {
		const startTime = new Date().getTime();
		let {
			id
		} = req.params
			console.log("idididid==========>>>>>>>",req.params)
			id = ObjectId(id)

		const get = await Transaction.find({
			payee: id,
			$and: [
				{ $or: [{ transaction_type: "Debit" }, { transaction_type: "Credit" }] },
			  ]
			});
		const betData = await Bet.find({user_id:id})

		return _RS.ok(
			res,
			"Success",
			'Transaction Found Successfully',
			{get,betData},
			startTime
		);
	} catch (err) {
		next(err);
	}
}
}
