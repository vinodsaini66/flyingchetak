import { createContext, useEffect, useState } from "react"

import {  baseURL } from '../constant/ApiRoutes';
import io from 'socket.io-client';
import useGame from "../hooks/useGame";
import { Severty, ShowToast } from "../helper/toast";

const BETS=[
    {
      "game_id": "b29fe987-1d11-47d3-8512-ee7b79a09e7b",
      "user_id": "b8d98c21-d9a1-46b5-88d4-b4766548c2e4",
      "status": "Placed",
      "deposit_amount": 317,
      "betType": "Auto",
      "boxType": "box2",
      "xValue": 2.02,
      "withdraw_amount": 0,
      "withdraw_at": "2022-09-21T20:21:07.537Z"
    },
    {
      "game_id": "779c0b09-85a3-4724-8d80-eeeb5d1500e7",
      "user_id": "6811f7af-92ee-4386-bbc7-dcbce2f1b960",
      "status": "Placed",
      "deposit_amount": 50,
      "betType": "Auto",
      "boxType": "box3",
      "xValue": 1.33,
      "withdraw_amount": 0,
      "withdraw_at": "2023-09-15T08:22:11.121Z"
    },
    {
      "game_id": "b3cbde27-c4fd-4e7a-9974-9de5f9cadd14",
      "user_id": "1b1d3802-d23b-4891-9723-b54151bb75b3",
      "status": "Placed",
      "deposit_amount": 65,
      "betType": "Auto",
      "boxType": "box3",
      "xValue": 2.76,
      "withdraw_amount": 0,
      "withdraw_at": "2023-07-17T18:24:52.151Z"
    },
    {
      "game_id": "6f1a3b3f-8742-4e3d-b9a9-d6bebe047c6b",
      "user_id": "e34377c8-3f6b-4384-8b4a-bb019bd8a4d6",
      "status": "Placed",
      "deposit_amount": 139,
      "betType": "Auto",
      "boxType": "box1",
      "xValue": 1.27,
      "withdraw_amount": 0,
      "withdraw_at": "2023-06-20T07:05:15.032Z"
    },
    {
      "game_id": "4f044ae1-70a7-4909-a3aa-2daa692a8ee4",
      "user_id": "34d59c8c-5b7e-48c1-b372-39c9203acbd1",
      "status": "Placed",
      "deposit_amount": 989,
      "betType": "Auto",
      "boxType": "box3",
      "xValue": 2.86,
      "withdraw_amount": 0,
      "withdraw_at": "2022-10-15T20:20:18.282Z"
    },
    {
      "game_id": "4f044ae1-70a7-4909-a3aa-2daa692a8ee4",
      "user_id": "34d59c8c-5b7e-48c1-b372-39c9203acbd1",
      "status": "Placed",
      "deposit_amount": 20,
      "betType": "Auto",
      "boxType": "box3",
      "xValue": 1.88,
      "withdraw_amount": 0,
      "withdraw_at": "2022-10-15T20:20:18.282Z"
    },
    {
      "game_id": "4f044ae1-70a7-4909-a3aa-2daa692a8ee4",
      "user_id": "34d59c8c-5b7e-48c1-b372-39c9203acbd1",
      "status": "Placed",
      "deposit_amount": 50,
      "betType": "Auto",
      "boxType": "box3",
      "xValue": 4.89,
      "withdraw_amount": 0,
      "withdraw_at": "2022-10-15T20:20:18.282Z"
    }
  ]
  

export const socket = io(baseURL,{
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
    const[bets,setBets] = useState<any[]>(BETS)
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
                console.log("xvalue>>>>>>>>>>>>>",data?.data)
                setIsLoading(false)
                if (data?.data?.timer>1) {
                    setX(data.data.timer);
                    setIsGameEnd(false);
                }
                else{
                    // setX(data.data.timer);
                    // setIsGameEnd(true);
                    setTimeout(()=>{setIsGameEnd(true)},4000);
                    setTimeout(()=>{setX(data.data.timer)},4000);
                            
                }
            }) 
            socket.on("betPlaced",(response)=>{
                console.log("socketsocket===>>>betPlaced",response)
                if(response.status){
                    ShowToast(response.message, Severty.SUCCESS);
                }
                else{
                    ShowToast(response.message, Severty.ERROR);
                }
            })
            socket.on("WithdrawalPlaced",(response)=>{
                console.log("socketsocket===>>>WithdrawalPlaced",response)
                if(response.status){
                    ShowToast(response.message, Severty.SUCCESS);
                }
                else{
                    ShowToast(response.message, Severty.ERROR);
                }
            })
            socket.on("autoBetPlaced",(response)=>{
                console.log("socketsocket===>>>autoBetPlaced",response)
                if(response.status){
                    ShowToast(response.message, Severty.SUCCESS);
                }
                else{
                    ShowToast(response.message, Severty.ERROR);
                }
            })

                socket.on("gameData",(gameData:any)=>{
                    const userId = localStorage.getItem("userId")
                    console.log(gameData,"gameData");
                    
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
           secondBoxFutureBet,
           setBets
        }}>
        {children}
        </SocketContext.Provider>
        </>
    )
}