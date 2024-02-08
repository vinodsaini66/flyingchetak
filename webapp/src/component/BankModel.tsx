import React, { useContext, useEffect, useState } from "react";
import useRequest from "../hooks/useRequest";
import { apiPath } from "../constant/ApiRoutes";
import { Severty, ShowToast } from "../helper/toast";
import { BankInfo, BankInfoError } from "../Interface/Bank";
import BankValidation from "../validation/BankVal";
import { AuthContext } from "../context/AuthContext";
 
const BankModel = ({ isOpen, onClose,setOpen,getProfile, children }:any) => {
    const [bankInfo, setBankInfo] = useState<BankInfo>({
        account_holder:"",
        ifsc_code:"",
        account_number:""
    })
    const [error, setError] = useState<BankInfoError>({
        account_holderError:"",
        ifsc_codeError:"",
        account_numberError:""
    })
    const { request } = useRequest()
    const { userProfile } = useContext(AuthContext)
    console.log("userProfile",userProfile.bank_info)
    useEffect(()=>{
      if(userProfile?.bank_info){
        setBankInfo({
          account_holder:userProfile?.bank_info?.account_holder || "",
          ifsc_code:userProfile?.bank_info?.ifsc_code || "",
          account_number:userProfile?.bank_info?.account_number || "",
        })
      }
    },[])
    if (!isOpen) return null;

   

    

    const handleChange = async(e:any) => {
        let {name,value} = e.target
        let validation = await BankValidation(name,value)
        setError(prevError=>({
            ...prevError,
            [name+"Error"]:validation
          }))
          setBankInfo(prevState=>({
            ...prevState,
            [name]:value
          }
          ))
    }

   const handleSubmit = () => {
    if(error.account_holderError || error.account_numberError || error.ifsc_codeError)return false
    if(!bankInfo.account_holder || !bankInfo.account_number || !bankInfo.ifsc_code)return false
            request({
                url: apiPath.bankInfo,
                method: "POST",
                data: bankInfo,
                onSuccess: (data) => {
                  // setLoading(false);
                  console.log("walletwallet",data)
                  if (data.status) {
                    ShowToast(data.message, Severty.SUCCESS);
                    getProfile()
                    onClose(setOpen)
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
                    background: "#16142a",
                    height: "80%",
                    width: "60%",
                    margin: "auto",
                    padding: "2%",
                    border: "2px solid #000",
                    borderRadius: "10px",
                    boxShadow: "2px solid black",
                }}
            >
                <>
                    {/* <h1>Add Wallet Balance</h1> */}
                    <div className="container">
                            <div className="row ">
                                <div className="col-md-8 m-auto">
                                     
                               <h3 className="mb-0">bank Details</h3>
                                <hr/>
                            <div className="row">
                              <div className="form-group col-md-6">
                              <label>Account Holder Name</label>
                              <input id="noScrollInput"  type="text" name="account_holder" className="form-control" value={bankInfo?.account_holder}  onChange={handleChange} placeholder="Account Holder Name" />
                              <span style={{color:"red"}}>{error?.account_holderError}</span>
                              </div>
                              <div className="form-group col-md-6">
                              <label>IFSC Code</label>
                              <input id="noScrollInput"  type="text" name="ifsc_code" className="form-control" value={bankInfo?.ifsc_code}  onChange={handleChange} placeholder="IFSC Code" />
                              <span style={{color:"red"}}>{error?.ifsc_codeError}</span>
                              </div>
                              <div className="form-group col-md-6">
                              <label>Account Number</label>
                              <input id="noScrollInput"  type="number" name="account_number" className="form-control" value={bankInfo?.account_number}  onChange={handleChange} placeholder="Account Number" />
                              <span style={{color:"red"}}>{error?.account_numberError}</span>
                              </div>
                            </div>

                             <div className="form-group">
                              <button  type="submit" onClick={handleSubmit}  className="btn_man w100">+Add</button>
                            </div>
                            <div className="form-group">
                              <button  type="button" onClick={()=>onClose(setOpen)} className="btn_man w100">Close</button>
                            </div>
                            </div>
                    </div>
                     </div>
                </>
            </div>
        </div>
    );
};
 
export default BankModel;