import _RS from '../../helpers/ResponseHelper';
import User from '../../models/User';
import { USER_TYPE } from '../../constants/user-type.enum';
import Helper from '../../helpers/Helper';
import AdminInfo from '../../models/AdminInfo';
import Transaction from "../../models/TransactionSetting"
import Channel from '../../models/Channel';
import Utr from '../../models/Utr';
import axios from 'axios';
const { ObjectId } = require('mongodb');

export class ChannelController {

	static async getChannels(req, res, next) {
		try {
			const startTime = new Date().getTime();

			const get = await Channel.find().sort({ created_at: -1 })

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

static async getUtr(req, res, next) {
	try {
		const startTime = new Date().getTime();

		const get = await Utr.find()

		return _RS.ok(
			res,
			"Success",
			'Utr Info Found Successfully',
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

	static async AddEditUtr(req, res, next) {
		try {
			const startTime = new Date().getTime();
			let {
				name,key,_id,url
			} = req.body
			let get
			if(_id){
				get = await Utr.updateOne({_id:_id},{$set:req.body})
			}
			else{
				get = await Utr.create(req.body)
			}
			let message = !_id?"Utr Info Added Successfully":"Utr Info Updateds Successfully"
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

		static async CheckStatusViaUtr(req, res, next) {
				const startTime = new Date().getTime();
				let {
					client_txn_id,txn_date
				} = req.body
				let getUtr = await Utr.findOne()
				if(getUtr?.key){
					var myHeaders = new Headers();
					myHeaders.append("Content-Type", "application/json")
					
					let data = JSON.stringify({
					  "key": getUtr?.key,
					  "client_txn_id": client_txn_id,
					  "txn_date": txn_date
					});
					
					let config = {
					  method: 'post',
					  maxBodyLength: Infinity,
					  url: getUtr.url,
					  headers: { 
						'Content-Type': 'application/json'
					  },
					  data : data
					};
					  axios.request(config)
					  .then((result) => {
						console.log("userId========>>>>>>",result)
						if(result.status){
						  return _RS.api(
							res,
							result.data.status,
							result.data.msg,
							result.data,
							startTime
						  );
						}
						else{
						  return _RS.api(
							res,
							false,
							"Error occurred during Balance Add Request",
							{},
							startTime
						  );
						}
					   
					  })
					  .catch((error) => {
						console.log(error);
						return _RS.api(
						  res,
						  false,
						  "Error occurred during Balance Add Request",
						  error,
						  startTime
						);
					  });
				}
				else{
					return _RS.api(
						res,
						false,
						"Please add utr details first",
						{},
						startTime
					  );
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
