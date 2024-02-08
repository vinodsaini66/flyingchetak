import _RS from "../../helpers/ResponseHelper";
import AdminSetting from "../../models/AdminSetting";
import Transaction from "../../models/TransactionSetting";
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
      ]);
    
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
      status
      } = req.body
    try {
      const startTime = new Date().getTime();
        let statusChange = await Transaction.updateOne({_id:_id},{$set:{status:status}})
        if(status == "Rejected"){
          let getTra = await Transaction.findOne({_id:_id})
          let reSendMoney = await WalletSettings.updateOne({userId:getTra.payee},{$inc:{balance:getTra.amount}})
          console.log("elseelseelse",reSendMoney)
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
