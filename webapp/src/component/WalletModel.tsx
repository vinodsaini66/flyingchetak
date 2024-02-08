import React, { useEffect, useState } from "react";
import WalletVal from "../validation/WalletVal";
import useRequest from "../hooks/useRequest";
import { apiPath } from "../constant/ApiRoutes";
import { Severty, ShowToast } from "../helper/toast";
 
const WalletModal = ({ onClose,setOpen, children }:any) => {
    const [balance, setBalance] = useState<number>(0)
    const [balanceError, setBalanceError] = useState<string>("")
    const [channelId, setChannelId] = useState<string>("")
    const [channelIdError, setChannelIdError] = useState<string>("")

    const [channelList, setChannelList] = useState<any>()

    const { request } = useRequest()
    
    useEffect(()=>{
      getChannel()
      },[])
      const getChannel = () => {
        request({
          url: apiPath.getChannels,
          method: "GET",
          onSuccess: (data) => {
            // setLoading(false);
            console.log("channelroutesget",data?.data?.data)
            if (data.status) {
              setChannelList(data?.data?.data)
            } else {
              ShowToast(data.message, Severty.ERROR);
            }
          },
          onError: (error) => {
            ShowToast(error.response.data.message, Severty.ERROR);
          },
        });
      }


    const handleChange = async(e:any) => {
        let {name,value} = e.target
        let validation = await WalletVal(name,value)
        setBalanceError(validation)
        setBalance(value)
    }

  

   const handleSubmit = () => {
    if(!balance) return setBalanceError("This field is required")
            if(Number(balance)<=0) return setBalanceError("Balance must be greater than 0")
                let userInput = {
                    balance:balance,
                    _id:channelId
                }

    if(!channelId || channelId == "")return setChannelIdError("This field is required")
            request({
                url: apiPath.thirdPartyBalanceRequest,
                method: "POST",
                data: userInput,
                onSuccess: (data) => {
                  // setLoading(false);
                  console.log("walletwallet",data)
                  if (data.status) {
                    ShowToast(data.message, Severty.SUCCESS);
                    let newWin = window.open(data.data.data.payment_url,"_blank")
                    newWin?.focus()
                    onClose()
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
                    height: "60%",
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
                            <div className="row">
                                <div className="col-md-6 m-auto">
                                     
                               <h3 className="mb-0">Balance</h3>
                                <hr/>
                            <div className="form-group ">
                              <label>Add balance</label>
                              <input id="noScrollInput"  type="number" name="balance" className="form-control"  onChange={handleChange} placeholder="Add balance" />
                              <span style={{color:"red"}}>{balanceError}</span>
                            </div>
                            <div className="form-group">
                            <select className="form-control channel_dropdown" onClick={(e:any)=>setChannelId(e.target.value)}>
                              <option  value="">Select</option>
                              {channelList?.length>0 && channelList.map((item:any)=>{
                                return <option value={item._id}>{item.name}</option>
                              })}
                            </select>
                            <span style={{color:"red"}}>{channelIdError}</span>
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
 
export default WalletModal;