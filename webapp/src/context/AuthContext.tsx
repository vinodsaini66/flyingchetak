import { ReactNode, createContext, memo, useEffect, useState } from "react"
import useRequest from "../hooks/useRequest"
import { apiPath } from "../constant/ApiRoutes"
import { Severty, ShowToast } from "../helper/toast"
import { useNavigate } from "react-router-dom"
export const AuthContext = createContext<any>({})

export const AuthProvider = memo(({children}:any) => {
    const[isLoggedIn,setIsLoggedIn] = useState<Boolean>(false)
    const[apiReCall,setApiReCall] = useState<Boolean>(false)
    const[userProfile,setUserProfile] = useState<Object>({})
    
    const { request } = useRequest()

    useEffect(()=>{
        const token  = localStorage.getItem("token")
        if(!token){
            return
        }
        getProfile()
       
    },[isLoggedIn,apiReCall])
    const getProfile = () => {
      request({
        url: apiPath.userprofile,
        method: "GET",
        onSuccess: (data) => {
          if (data.status) {
            setIsLoggedIn(true);
            console.log("dfsdjfbsdjhbsdfhjds",data)
            localStorage.setItem("userId", data.data._id);
            setUserProfile(data.data);
          } else {
            ShowToast(data.message, Severty.ERROR);
          }
        },
        onError: (error) => {
          ShowToast(error.response.data.message, Severty.ERROR);
        },
      });
    }
    const login = () => {
            
    }
    const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    setIsLoggedIn(false);
    setUserProfile({});
    ShowToast("Logout Successfully", Severty.SUCCESS);
    }
    return (
        <>
        <AuthContext.Provider value={{
            isLoggedIn,
            userProfile,
            setIsLoggedIn,
            setUserProfile,
            login,
            logout,
            getProfile
        }}>
        {children}
        </AuthContext.Provider>
        </>
    )
})