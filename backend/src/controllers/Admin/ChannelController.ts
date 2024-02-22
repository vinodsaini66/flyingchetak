import _RS from '../../helpers/ResponseHelper';
import User from '../../models/User';
import { USER_TYPE } from '../../constants/user-type.enum';
import Helper from '../../helpers/Helper';
import AdminInfo from '../../models/AdminInfo';
import Transaction from "../../models/TransactionSetting"
import Channel from '../../models/Channel';
const { ObjectId } = require('mongodb');

export class ChannelController {

	static async getChannels(req, res, next) {
		try {
			const startTime = new Date().getTime();

			const get = await Channel.find()

			return _RS.ok(
				res,
				"Success",
				'Channels Found Successfully',
				get,
				startTime
			);
		} catch (err) {
			next(err);
		}
}
static async AddChannel(req, res, next) {
	try {
		const startTime = new Date().getTime();
		let {
			name,key,_id,url
		} = req.body
		let get
		if(_id){
			get = await Channel.updateOne({_id:_id},{$set:req.body})
		}
		else{
			get = await Channel.create(req.body)
		}
		let message = !_id?"Channel Added Successfully":"Channel Updateds Successfully"
		return _RS.ok(
			res,
			"Success",
			message,
			get,
			startTime
		);
	} catch (err) {
		next(err);
	}
    }
	static async DeleteChannel(req, res, next) {
		try {
			const startTime = new Date().getTime();
			let {
				_id
			} = req.body
			let remove = await Channel.deleteOne({_id:_id})
			let message = "Channel Removed Successfully"
			return _RS.ok(
				res,
				"Success",
				message,
				remove,
				startTime
			);
		} catch (err) {
			next(err);
		}
		}
}
