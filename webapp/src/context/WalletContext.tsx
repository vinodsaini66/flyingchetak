import React, { createContext, useContext, useEffect, useState } from "react";
import useRequest from "../hooks/useRequest";
import { apiPath } from "../constant/ApiRoutes";
import { Severty, ShowToast } from "../helper/toast";
import { AuthContext } from "./AuthContext";

export const WalletContext = createContext<any>({})
const WalletProvider = ({children}:any) => {
    const [walletDetails, setWalaletDetails] = useState<object>({})
    const [again, setAgain] = useState<boolean>(false)


    const { isLoggedIn } = useContext(AuthContext)

    const { request }  = useRequest()

    
    useEffect(()=>{
        const token  = localStorage.getItem("token")
        if(!token){
            return
        }
        console.log("token",token)
          request({
             url: apiPath.getWalletBalance,
             method: "GET",
             onSuccess: (data) => {
               if (data.status) {
                setWalaletDetails(data.data)
                // setAgain(false)
               } else {
                 ShowToast(data.message, Severty.ERROR);
               }
             },
             onError: (error) => {
               ShowToast(error.response.data.message, Severty.ERROR);
             },
           });
       
    },[isLoggedIn,again])
    return (
      <>
      <WalletContext.Provider value={{
        walletDetails,
        again,
        setAgain
        }}>
          {children}
      </WalletContext.Provider>
    </>
    )
}

export default WalletProvider