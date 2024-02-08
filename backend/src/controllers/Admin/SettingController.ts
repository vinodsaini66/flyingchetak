import _RS from "../../helpers/ResponseHelper";
import AdminSetting from "../../models/AdminSetting";
const express = require("express");

const app = express();

export class AdminSettingController {
  static async update(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const { email, mobile_number, country_code, bet_commission,min_bet,min_withdrawal,referral_bonus, address, facebook, instagram } = req.body;
      const adminSettingFind = await AdminSetting.findOne();
      let newObj = {
        country_code:country_code,
        mobile_number:mobile_number,
        email:email,
        min_bet:min_bet,
        address:address,
        facebook:facebook,
        instagram:instagram,
        min_withdrawal:min_withdrawal,
        referral_bonus:referral_bonus,
        bet_commission:bet_commission
      }
      let adminSetting;
      if(!adminSettingFind || adminSettingFind == null){
        adminSetting = await AdminSetting.create(newObj)
      }
      else{
        adminSetting = await AdminSetting.updateOne({_id:adminSettingFind._id},{$set:newObj})
      }
      return _RS.api(
        res,
        true,
        "Setting Updated Successfully",
        adminSetting,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async get(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const setting = await AdminSetting.findOne();
      return _RS.api(
        res,
        true,
        "Admin Setting Get Successfully",
        setting,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }
}
