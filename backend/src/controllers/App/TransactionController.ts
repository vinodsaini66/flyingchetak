import moment = require("moment");
import { USER_TYPE } from "../../constants/user-type.enum";
import _RS from "../../helpers/ResponseHelper";
import Transaction from "../../models/TransactionSetting";
import Wallet from "../../models/WalletSettings";
import HistorySetting from "../../models/HistorySetting";
import User from "../../models/User";
import AdminSetting from "../../models/AdminSetting";
const { ObjectId } = require('mongodb');

export class TransactionController {
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

  static async getTransaction(req, res, next) {
    const startTime = new Date().getTime();
    const {
      transaction_type,
    } = req.body;
    
    let transactions = await Transaction.find({payee:req.user._id,transaction_type:transaction_type})
      if (transactions) {
        return _RS.api(
          res,
          true,
          "Transaction Found Successfully",
          transactions,
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

static async addWithdrawal(req, res, next) {
  const startTime = new Date().getTime();
  const {
    amount,
  } = req.body;
      let txnRefId = 'CHETAK' + new Date().getTime();
      let userId = new ObjectId(req.user._id)
      let getUserByuserId = await User.findOne({_id:userId})
      let adminsetting = await AdminSetting.findOne()
      if(!getUserByuserId.withdrawal_status){
        return _RS.api(
          res,
          false,
          "Your withdrawal is not active! Please contact to admin",
          {},
          startTime
        );
      }
      if(!adminsetting.withdrawal){
        return _RS.api(
          res,
          false,
          "Withdrawal is not active! Please contact to admin",
          {},
          startTime
        );
      }

      let walletBalance = await Wallet.findOne({userId:userId})
      if(walletBalance && walletBalance.balance && walletBalance.balance>amount){
        let actualbalance = Number(walletBalance.balance)-amount

        let updateWalletbalance = await Wallet.updateOne({userId:userId},{$set:{balance:actualbalance}}) 
        let add = {
          payee:req.user._id,
          receiver:req.user._id,
          amount:Number(amount),
          transaction_mode:"User",
          transaction_type:"Debit",
          wallet_id:walletBalance._id,
          transaction_id:txnRefId,
          status:"Pending"
        }
          
          try{
            let transactions = await Transaction.create(add)
            if (transactions) {
              const historyTime = moment(startTime).format('MMMM Do YYYY, h:mm:ss a')
              const history = {
              userId:req.user._id,
              type:"Debit",
              status:"Pending",
              message:`Amount ${amount} has been debited from your account at ${historyTime}`
            }
              let createHis =  await HistorySetting.create(history)
              return _RS.api(
                res,
                true,
                "Withdrawal Request Send Successfully",
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
          }catch(err){
            return _RS.api(
              res,
              false,
              "Some error occurs",
              err,
              startTime
            );
          }
      }
      
      else{
        return _RS.api(
          res,
          false,
          "Not enough balance",
          {},
          startTime
        );
      }
      }
     
        
      }
