import User from "../models/User";
import Wallet from "../models/Wallet";
import Helper from "./Helper";
import * as moongose from "mongoose";
import axios from "axios";
import { USER_TYPE } from "../constants/user-type.enum";
import WalletTransaction from "../models/WalletTransaction";

export const updateBalance = async ({
  id,
  balance,
  total_balance,
  data,
  transaction_id,
}: any) => {
  if (id == "admin") {
    id = Helper.admin._id;
  }

  console.log(balance, total_balance, id, data, transaction_id);

  const user = await User.findById(id);
  if (!user) return;

  const wallet = await Wallet.findOne({ user_id: user._id });

  console.log(wallet, "wallet");

  if (!wallet) {
    await new Wallet({
      user_id: user._id,
      balance: balance,
      total_balance: total_balance,
    }).save();

    console.log("new wallet created");
    return;
  }

  console.log("line 38");

  wallet.balance = !!balance ? wallet.balance + parseInt(balance) : 0;

  console.log("line 42");
  if (user.type === USER_TYPE.admin) {
    wallet.total_balance = !!total_balance
      ? Math.round((+wallet.total_balance + +total_balance) * 100) / 100
      : 0;
    console.log("line 46");
    wallet.revenue = !!wallet.revenue
      ? Math.round((+wallet.revenue + +total_balance) * 100) / 100
      : 0;
  }

  console.log("line 49");

  wallet.save();

  console.log("will create new transaction");

  await WalletTransaction.create({
    wallet_id: wallet._id,
    type: "credit",
    amount: total_balance,
    remaining: wallet.total_balance,
    transaction_id: transaction_id ? transaction_id : null,
    data,
  });

  return;
};
