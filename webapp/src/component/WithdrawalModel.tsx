import React, { useContext, useEffect, useState } from "react";
import WalletVal from "../validation/WalletVal";
import useRequest from "../hooks/useRequest";
import { apiPath } from "../constant/ApiRoutes";
import { Severty, ShowToast } from "../helper/toast";
import { SettingContext } from "../context/SettingContext";
import { AuthContext } from "../context/AuthContext";
 
const WithdrawalModel = ({  setWOpen,onClose,balanceApi,getTransaction, children }:any) => {
    const [balance, setBalance] = useState<number>(0)
    const [balanceError, setBalanceError] = useState<string>("")
    const [winningAmount, setWinningAmount] = useState<number>(0)
    const { request } = useRequest()
    const { settingDetails } = useContext(SettingContext)
    const { userProfile } = useContext(AuthContext)

    useEffect(()=>{
        Winningamount()
    },[])

    const handleChange = async(e:any) => {
        let {name,value} = e.target
        let validation = await WalletVal(name,value)
        setBalanceError(validation)
        setBalance(value)
    }

    let Winningamount = () => {
      request({
         url: apiPath.winningAmount,
         method: "GET",
         onSuccess: (data) => {
          console.log("winningAMount===============>>>>>>>>>>>>>>",data)
           if (data.status) {
            setWinningAmount(data.data.amount)
           } else {
             ShowToast(data.message, Severty.ERROR);
           }
         },
         onError: (error) => {
           ShowToast(error.response.data.message, Severty.ERROR);
         },
       });
   }

   const handleSubmit = () => {
            if(balance && Number(balance)<=0) return setBalanceError("Balance must be greater than 0")
                let userInput = {
                    amount:Number(balance)
                }
              if(Number(balance<settingDetails.min_withdrawal))return setBalanceError(`${settingDetails.min_withdrawal} is minimum withdrawal amount`)
            request({
                url: apiPath.withdrawalRequest,
                method: "POST",
                data: userInput,
                onSuccess: (data) => {
                  if (data.status) {
                    ShowToast(data.message, Severty.SUCCESS);
                    onClose(setWOpen)
                    balanceApi(true)
                    getTransaction("Debit")
                  } else {
                    ShowToast(data.message, Severty.ERROR);
                  }
                },
                onError: (error) => {
                  ShowToast(error.response.data.message, Severty.ERROR);
                },
              });
            

    }
 
    return (
        <div
            // onClick={onClose}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    backgroundColor: "#16142a",
                    height: "60%",
                    width: "60%",
                    margin: "auto",
                    padding: "2%",
                    border: "2px solid #000",
                    borderRadius: "10px",
                    boxShadow: "2px solid black",
                    opacity:1
                }}
            >
                <>
                    {/* <h1>Add Wallet Balance</h1> */}
                    <div className="container">
                            <div className="row ">
                                <div className="col-md-10 m-auto">
                               <h3 className="mb-0">Withdrawal</h3>
                                <hr/>
                            <div className="form-group ">
                              <label>Withdrawal balance</label>
                              <input   type="number" name="balance" className="form-control"  onChange={handleChange} placeholder="Add balance" />
                              <span style={{color:"red"}}>{balanceError}</span>
                            </div>

                             {userProfile?.bank_info ?
                                     <div className="row" style={{display:"flex !improtant"}}>
                                        <div className="form-group col-md-4"><label>Name :- {userProfile?.bank_info?.account_holder}</label></div>
                                        <div className="form-group col-md-4"><label>IFSC :- {userProfile?.bank_info?.ifsc_code}</label></div>
                                        <div className="form-group col-md-4"><label>Acc No. :-  {userProfile?.bank_info?.account_number}</label></div>
                               </div>:<div className=" form-group w100"><span>Please Add Bank Detail First For Withdrawal</span></div>}
                               <div className="row">
                                {console.log("wingwingwing",winningAmount)}
                            {winningAmount === 0 ? userProfile?.bank_info && <div className="form-group col-md 2">
                              <button  type="submit" onClick={handleSubmit}  className="btn_man w50">Withdrawal</button>
                              </div>:<div>Please Play Game For All Your Deposite Amount</div>}
                            <div className="form-group col-md-2">
                              <button  type="button" onClick={()=>{onClose(setWOpen)}} className="btn_man w50">Close</button>
                            </div>
                            </div>
                            </div>
                    </div>
                     </div>
                </>
            </div>
        </div>
    );
};
 
export default WithdrawalModel;