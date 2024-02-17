import { USER_TYPE } from "../../constants/user-type.enum";

import _RS from "../../helpers/ResponseHelper";
import Wallet from "../../models/WalletSettings";
import Transaction from "../../models/TransactionSetting";
import axios from "axios";
import moment = require("moment");
import HistorySetting from "../../models/HistorySetting";
import WinningWallet from "../../models/WinningWallet";
import Channel from "../../models/Channel";
const { ObjectId } = require('mongodb');
import { env } from '../../environments/Env';

export class WalletController {
  /**
   * @api {post} /api/app/auth/login Login
   * @apiVersion 1.0.0
   * @apiName Login
   * @apiGroup Auth
   * @apiParam {String} country_code Country Code.
   * @apiParam {String} mobile_number Mobile Number.
   * @apiParam {String} password Password .
   * @apiParam {String} type User Type ("Customer, ServiceProvider").
   * @apiParam {String} device_token Device Token.
   * @apiParam {String} device_type Device Type.
   * @apiParam {String} latitude Latitude.
   * @apiParam {String} longitude Longitude.
   */

  static async addBalanceViaThirdParty(req, res, next) {
    const startTime = new Date().getTime();
    let {
      id,amount,txn
    } = req.query

    let userId = new ObjectId(id)
    let previousBalance = await Wallet.findOne({userId:userId})
    let newBalance = previousBalance?.balance && Number(previousBalance.balance)+Number(amount)
    console.log("thirdartyapi",previousBalance,newBalance,amount)

    try{
    let updateWallet = await Wallet.updateOne({userId:userId},{$set:{balance:newBalance}})
    let add = {
      payee:id,
      receiver:id,
      amount:Number(amount),
      transaction_mode:"User",
      transaction_type:"Credit",
      wallet_id:previousBalance._id,
      transaction_id:txn,
      status:"Pending"
    }
      if (updateWallet.nModified>0) {
        const historyTime = moment(startTime).format('MMMM Do YYYY, h:mm:ss a')
				let historypayload = {
				userId:id,
				type:"Credit",
				status:"Success",
				message:`Your account has been Credited to ${amount} at ${historyTime}`
			}
			let createhistory = await HistorySetting.create(historypayload)
        let addTransaction = await Transaction.create(add)
        return _RS.api(
          res,
          true,
          "Balance Update Successfully",
          {},
          startTime
        );
      }
      else{
        return _RS.api(
          res,
          false,
          "Some error occurs",
          {},
          startTime
        );
      }
    }catch(error){
      next(error)
    }
}


static async requestBalanceViaThirdParty(req, res, next) {
  const startTime = new Date().getTime();
  let {
      balance,_id
    }= req.body
    let getChannel = await Channel.findOne({_id:_id})
    if(getChannel?.key){
   let txnRefId = 'CHETAK' + new Date().getTime();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
console.log("redirect_url",`${env().redirection_url}?id=${req.user._id}&amount=${balance}&txn=${txnRefId}`)
    let data = JSON.stringify({
      "key": getChannel?.key,
      "client_txn_id": txnRefId,
      "amount": balance,
      "p_info": "Recharge",
      "customer_name": "Anil",
      "customer_email": "test@gmail.com",
      "customer_mobile": "9983732323",
      "redirect_url": `${env().redirection_url}?id=${req.user._id}&amount=${balance}&txn=${txnRefId}`,
      "udf1": "user defined field 1",
      "udf2": "user defined field 2",
      "udf3": "user defined field 3"
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.ekqr.in/api/create_order',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
      axios.request(config)
      .then((response) => {
        let result = response.data
        console.log("userId========>>>>>>",response)
        if(result.status){
          return _RS.api(
            res,
            true,
            "Balance Add Request Triggered Successfully",
            response.data,
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
      });}
      else{
        return _RS.api(
          res,
          false,
          "Channel Id is invalid",
          {},
          startTime
        );
      }
}

static async getBalance(req, res, next) {
  const startTime = new Date().getTime();
  let {
    _id
  } = req.user
  let userId = new ObjectId(_id)
  let find = await Wallet.findOne({userId:userId})
  if (find) {
    return _RS.api(
      res,
      true,
      "Balance Found Successfully",
      find,
      startTime
    );
  }
  else{
    return _RS.api(
      res,
      false,
      "Some error occurs",
      {},
      startTime
    );
  }
}

static async getWinningWalletBalance(req, res, next) {
  const startTime = new Date().getTime();
  let {
    _id
  } = req.user
  let userId = new ObjectId(_id)
  try{
    let find = await WinningWallet.findOne({userId:userId})
    if (find) {
      return _RS.api(
        res,
        true,
        "Winning Found Successfully",
        find,
        startTime
      );
    }
    else{
      return _RS.api(
        res,
        false,
        "Some error occurs",
        {},
        startTime
      );
    }
  }catch(error){
    next(error)
  }

}
}