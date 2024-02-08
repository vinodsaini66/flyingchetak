import React, { createContext, useContext, useEffect, useState } from "react";
import useRequest from "../hooks/useRequest";
import { apiPath } from "../constant/ApiRoutes";
import { Severty, ShowToast } from "../helper/toast";
import { AuthContext } from "./AuthContext";

export const SettingContext = createContext<any>({})
const SettingProvider = ({children}:any) => {
    const [settingDetails, setSettingDetails] = useState<object>({})
    const [again, setAgain] = useState<boolean>(false)

    const { isLoggedIn } = useContext(AuthContext)

    const { request }  = useRequest()

    
    useEffect(()=>{
        request({
            url: apiPath.adminDetails,
            method: "GET",
            onSuccess: (data) => {
              if (data.status) {
                setSettingDetails(data.data)
              } else {
                ShowToast(data.message, Severty.ERROR);
              }
            },
            onError: (error) => {
              ShowToast(error.response.data.message, Severty.ERROR);
            },
          });
    },[isLoggedIn])
    return (
      <>
        <SettingContext.Provider value={{
            settingDetails
        }}>
        {children}
        </SettingContext.Provider>
        </>
    )
}

export default SettingProvider