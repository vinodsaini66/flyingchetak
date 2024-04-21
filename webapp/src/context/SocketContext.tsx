import { createContext, useEffect, useState } from "react"

import {  baseURL } from '../constant/ApiRoutes';
import io from 'socket.io-client';
import useGame from "../hooks/useGame";

const socket = io(baseURL,{
	auth: {
	  token: localStorage.getItem("token"),
	},
  });
  interface betbox {
    betType:string;
    boxType:string;
    amount:number;
    x:number
  }

export const SocketContext = createContext<any>({})
export const SocketProvider = ({children}:any) => {
    const[isLoading,setIsLoading] = useState<Boolean>(false)
    const[x,setX] = useState<Number>(1)
    const[isGameEnd,setIsGameEnd] = useState<Boolean>(false)
    const[userCurrentBets,setUserCurrentBets] = useState<any[]>([])
    const[fallHistory,setFallHistory] = useState<any[]>([])
    const[bets,setBets] = useState<any[]>([])
    const[userBets,setUserBets] = useState<any[]>([])
    const[firstBoxFutureBet,setFirstBoxFutureBet] =  useState<any>({})
    const[secondBoxFutureBet,setSecondBoxFutureBet] =  useState<any>({})
    const {
        handleDeposit,handleAutoDeposit
    } = useGame();



        useEffect(() => { 
            setIsLoading(true)
            socket.on("connection",(val)=>{
                console.log('connected:',val)
            })  
            socket.on('xValue',(data:any)=>{
                setIsLoading(false)
                if (data?.data?.timer>1) {
                    setX(data.data.timer);
                    setIsGameEnd(false);
                }
                else{
                    setTimeout(()=>{setIsGameEnd(true)},4000);
                    setTimeout(()=>{setX(data.data.timer)},4000);
                            
                }
            })
                
                socket.on("gameData",(gameData:any)=>{
                    const userId = localStorage.getItem("userId")
                    let data = gameData?.data?.allBets?.filter((item:any,i:number)=>{return item?.user_id?._id == userId});
                    if (data) {
                        data.sort((a:any, b:any) => {
                          if (a.boxType < b.boxType) {
                            return -1;
                          }
                          if (a.boxType > b.boxType) {
                            return 1;
                          }
                          return 0;
                        });
                    }
                    if(data){
                        // setFirstBoxFutureBet({})
                        // setSecondBoxFutureBet({})
                    }
                    
                    setUserCurrentBets(data)
                    setFallHistory(gameData?.data?.fallrate)
                    if (gameData?.data?.allBets) {
                        setBets(gameData.data.allBets);
                    }
                    if(gameData?.data?.userBets?.length>0){
                        setUserBets(gameData?.data?.userBets)
                    }
                })
    
         
            // return () => {
            //   if (socket) {
            // 	socket.disconnect();
            //   }
            // };

          }, []);
          useEffect(()=>{
            console.log("boxbetamount====>>>first",firstBoxFutureBet,secondBoxFutureBet)

            if(x===1 && Object.keys(firstBoxFutureBet).length !== 0){
                
                if(firstBoxFutureBet?.betType == "Manual"){ handleDeposit(firstBoxFutureBet)}
                if(firstBoxFutureBet?.betType == "Auto" ){ handleAutoDeposit(firstBoxFutureBet)}
                setTimeout(()=>{ setFirstBoxFutureBet({})},3000)
            }
            if(x===1 && Object.keys(secondBoxFutureBet).length !== 0){
                secondBoxFutureBet?.betType == "Manual" && handleDeposit(secondBoxFutureBet)
                secondBoxFutureBet?.betType == "Auto" && handleAutoDeposit(secondBoxFutureBet)
                setTimeout(()=>{setSecondBoxFutureBet({})},3000)
            }
          },[isGameEnd])
        
    return (
        <>
        <SocketContext.Provider value={{
           isLoading,
           x,
           userBets,
           bets,
           fallHistory,
           userCurrentBets,
           isGameEnd,
           setFirstBoxFutureBet,
           setSecondBoxFutureBet,
           firstBoxFutureBet,
           secondBoxFutureBet
        }}>
        {children}
        </SocketContext.Provider>
        </>
    )
}