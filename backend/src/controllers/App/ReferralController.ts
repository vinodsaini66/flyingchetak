import moment = require("moment");
import { USER_TYPE } from "../../constants/user-type.enum";
import _RS from "../../helpers/ResponseHelper";
import Transaction from "../../models/TransactionSetting";
import Wallet from "../../models/WalletSettings";
import HistorySetting from "../../models/HistorySetting";
import User from "../../models/User";
const { ObjectId } = require('mongodb');

export class ReferralController {
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

  static async getPromotionsData(req, res, next) {
    const startTime = new Date().getTime();
    const {
      transaction_type,
    } = req.body;
        try{
            let _id = req.user._id
            let depositeNumberArray = []
            let find_user = await User.findOne({_id:_id})
            let usersData = await User.find({referral_from_id:find_user.referral_id})
            let noOfUser = await User.countDocuments({referral_from_id:find_user.referral_id})
            let useDepositnumberArray = []
            let matchArray = usersData.map((val,i)=>{
              useDepositnumberArray.push({userId:ObjectId(val._id)})
              return  ObjectId(val._id)
            })
            console.log("totalBalance")

            let depositeAmount = await Wallet.aggregate([
             {$match:{userId:{$in: matchArray}}},
              {
                $group: {
                  _id:null,
                  totalBalance: { $sum: "$balance" }
                }
              }
            ])
            
            let depositeUserNumber = await Transaction.aggregate([
              {$match:{payee:{$in: matchArray}}},
              {$match:{transaction_type:"Credit"}},
              {
                $group: {
                  _id: "$payee",
                  entries: { $push: "$$ROOT" },
                },
              },
              {
                $project: {
                  selectedEntries: { $slice: ["$entries", 1] },
                },
              },
              {
                $unwind: "$selectedEntries",
              },
              {
                $replaceRoot: { newRoot: "$selectedEntries" },
              },
            ]);

            let firstDepositeUser = await Transaction.aggregate([
              {
                $match:{payee:{$in: matchArray}},
              },
              {
                $group: {
                  _id: "$payee",
                  entryCount: { $sum: 1 }
                }
              },
              {
                $match: {
                  entryCount: 1
                }
              },
              {
                $group: {
                  _id: null,
                  usersWithOneEntry: { $sum: 1 }
                }
              }
            ]);
            console.log("totalBalance",depositeAmount)
            let finalArray = []
            finalArray.push({no_of_register:noOfUser || 0})
            finalArray.push({deposite_number:depositeUserNumber?.length || 0})
            finalArray.push({deposite_amount:depositeAmount[0]?.totalBalance || 0})
            finalArray.push({user_no_with_first_deposite:firstDepositeUser[0]?.usersWithOneEntry || 0})

            return _RS.api(
                res,
                true,
                "Promotion Data Found Successfully",
                finalArray,
                startTime
              );
        }catch(err){
            next(err)
        }
  
  }

     
        
      }
