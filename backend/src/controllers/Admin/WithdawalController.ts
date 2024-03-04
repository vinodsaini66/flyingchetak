import _RS from "../../helpers/ResponseHelper";
import AdminSetting from "../../models/AdminSetting";
import Transaction from "../../models/TransactionSetting";
import User from "../../models/User";
import WalletSettings from "../../models/WalletSettings";
const express = require("express");

const app = express();

export class WithdrawalController {
  static async get(req, res, next) {
    let {
      page,
      limit,
      status,
      search,
      start_date,
      end_date} = req.query
    try {
      const startTime = new Date().getTime();
      let date = {
        $gte: new Date(start_date),
        $lte: new Date(end_date)
      }

      const matchStage:any = {
        status: status,
        transaction_type: 'Debit',
      };
      if(start_date && end_date){
        matchStage.created_at = date;
      }
      
      const orConditions:any = [];
      
      // Add conditions for fields with search terms
      if (search) {
        orConditions.push(
          { "customerInfo.email": { $regex: search, $options: 'i' } },
          { "customerInfo.name": { $regex: search, $options: 'i' } },
          { "customerInfo.mobile_number": { $regex: search, $options: 'i' } }
          // Add more fields as needed
        );
      }
      // Combine match conditions with $or conditions
      if (orConditions.length > 0) {
        matchStage.$or = orConditions
      }
      
      const withdrawal = await Transaction.aggregate([
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
          $match: matchStage,
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
        // {
        //   $limit: Number(limit),
        // },
      ]).sort({ created_at: -1 });
    
      return _RS.api(
        res,
        true,
        "Withdrawal Found Successfully",
        withdrawal,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }
  static async _changeStatus(req, res, next) {
    let {
      _id,
      amount,
      status,
      type
      } = req.body
    try {
      console.log("amountamountamount",type,status,_id)
      
      const startTime = new Date().getTime();
        let statusChange = await Transaction.updateOne({_id:_id},{$set:{status:status}})
        if((type == "Credit" && status == "Success") || (type == "Debit" && status == "Reject")){
          let getTra = await Transaction.findOne({_id:_id})
          let reSendMoney = await WalletSettings.updateOne({userId:getTra.payee},{$inc:{balance:getTra.amount}})
          let userWithRefer = await User.findOne({_id:getTra.payee})
          if(userWithRefer.referral_from_id && type == "Credit"){
            let getAll = await Transaction.find({payee:getTra.payee,status:"Success"})
            console.log("userWithRefer++++++.>>>>>>>>>",getAll.length)
            if(getAll.length == 1){
              let txnRefId = 'CHETAK' + new Date().getTime();
              let getAdminSetting = await AdminSetting.findOne()
              let getFromUser = await User.findOne({referral_id:userWithRefer.referral_from_id})
              let walletUpdate = await WalletSettings.updateOne({userId:getFromUser._id},{$inc:{balance:Number(getAdminSetting.referral_bonus)}})
              let add = {
                payee:getFromUser._id,
                receiver:getFromUser._id,
                amount:Number(getAdminSetting.referral_bonus),
                transaction_mode:"Referral",
                transaction_type:"Credit",
                // wallet_id:previousBalance._id,
                transaction_id:txnRefId,
                status:"Success"
              }
              let createTra = await Transaction.create(add)

            console.log("userWithRefer++++++.>>>>>>>>>",getFromUser,getAdminSetting)
            }
          }

        }
        if(statusChange){
          return _RS.api(
            res,
            true,
            "Withdrawal Status Updated Successfully",
            {},
            startTime
          );
        }
        else{
          return _RS.api(
            res,
            true,
            "Some Error Occurs",
            {},
            startTime
          );
        }
     
    } catch (error) {
      next(error);
    }
  }
}
