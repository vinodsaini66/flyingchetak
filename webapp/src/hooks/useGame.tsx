import { useContext, useEffect, useState } from 'react';

import { apiPath, baseURL } from '../constant/ApiRoutes';
import { Severty, ShowToast } from '../helper/toast';
import useRequest from './useRequest';
import io from 'socket.io-client';
import { WalletContext } from '../context/WalletContext';
const socket = io('http://34.123.238.205',{
	auth: {
	  token: localStorage.getItem("token"),
	},
  });

const useGame = () => {
	const [gameData, setGameData] = useState<any>();
	const [bets, setBets] = useState<any[]>([]);
	const [userBets, setUserBets] = useState<any[]>([]);
	const [balance, setBalance] = useState<number>(0);
	const [x, setX] = useState<number>(0);
	const [fallHistory, setFallHistory] = useState<any[]>([]);
	const [betAmount, setBetAmount] = useState<number>(10);
	const [minBetAmount, setMinBetAmount] = useState<number>(10);
	const [isGameEnd, setIsGameEnd] = useState<boolean>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [fallRate, setFallRate] = useState<any[]>([]);
	const [userCurrentBets, setUserCurrentBets] = useState<any[]>([])
	const { walletDetails,walletData} = useContext(WalletContext)
	console.log("walletdetails",walletDetails)
	useEffect(() => { 
		getUserBets()
		setIsLoading(true)
		socket.on("connection",(val)=>{
			console.log('connected:',val)
		})  
		socket.on('xValue',(data:any)=>{
			setIsLoading(false)
			if (data?.data?.timer>1) {
				setX(data.data.timer);
				setIsGameEnd(false);
			console.log("handlegamedata",balance);

			}
			else{
				let local:any = localStorage.getItem("FirstBoxFutureBet")
					let local1  =JSON.parse(local)
					let local2:any = localStorage.getItem("SecondBoxFutureBet")
					let local3  =JSON.parse(local2)
					walletData()
					if(local1){
						handleDeposit(local1.amount,local1.type,local1.betType)
						localStorage.removeItem("FirstBoxFutureBet")
					}
					if(local3){
						handleDeposit(local1.amount,local1.type,local1.betType)
						localStorage.removeItem("SecondBoxFutureBet")
					}
				setIsGameEnd(true);
				setX(data.data.timer);
				
					
			}
			
		})
		
			socket.on("gameData",(gameData:any)=>{
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
	

	const { request } = useRequest();

	const changeBetAmount = (type: string) => {
		if (type == 'inc') {
			setBetAmount(betAmount + 1);
		} else if (type == 'dec') {
			setBetAmount(betAmount - 1);
		}
	};
	const fetchFallRate = () => {
		request({
			url: apiPath.fallrate,
			method: 'GET',
			onSuccess: ({ data, status }) => {
				if (status) {
					setFallHistory(data);
				}
			},
			onError: (error) => {
				ShowToast(error, Severty.ERROR);
			},
		});
	};
	const getUserBets = () => {
		request({
			url: apiPath.getBets,
			method: 'GET',
			onSuccess: ({ data, status }) => {
				if (status) {
					setUserBets(data);
				}
			},
			onError: (error) => {
				ShowToast(error, Severty.ERROR);
			},
		});
	};

	const handleDeposit = (amount: number,type:string,betType:string) => {
		if (walletDetails?.balance < amount) {
			ShowToast("You Don't have sufficient balance", Severty.ERROR);
		} else if (amount < minBetAmount) {
			ShowToast(`Min Bet should be of ${minBetAmount}`, Severty.ERROR);
		} else {
			let payload: any = {
				amount: amount,
				boxType:type,
				betType:betType
			};
			request({
				url: apiPath.gameDeposit,
				method: 'POST',
				data: payload,
				onSuccess: ({ data, message, status }) => {
					if (status) {
						ShowToast(message, Severty.SUCCESS);
						walletData()
					}
				},
				onError: (error) => {
					ShowToast(error, Severty.ERROR);
				},
			});
		}
	};
	const handleAutoDeposit = (amount: number,type:string,betType:string,x:number) => {
		if (walletDetails?.balance < amount) {
			ShowToast("You Don't have sufficient balance", Severty.ERROR);
		} else if (x<0) {
			ShowToast(`X Can't be negative or zero`, Severty.ERROR);
		}else if (amount < minBetAmount) {
			ShowToast(`Min Bet should be of ${minBetAmount}`, Severty.ERROR);
		} else {
			let payload: any = {
				amount: amount,
				boxType:type,
				betType:betType,
				xValue:x
			};
			request({
				url: apiPath.gameAutoDeposite,
				method: 'POST',
				data: payload,
				onSuccess: ({ data, message, status }) => {
					if (status) {
						ShowToast(message, Severty.SUCCESS);
						walletData();
					}
				},
				onError: (error) => {
					ShowToast(error, Severty.ERROR);
				},
			});
		}
	};

	const handleWithdraw = ({
		betId,
		amount,
		xVal,
	}: {
		betId: string;
		amount: number;
		xVal:number;
	}) => {
		let requestedAmount = {
			requestedAmount:amount,
			xValue:xVal
		}
		request({
			url: apiPath.gameWithdraw + '/' + betId,
			method: 'POST',
			data: requestedAmount ,
			onSuccess: ({ data, status }) => {
				if (status) {
					walletData();
				}
			},
		});
	};

	return {
		handleDeposit,
		handleAutoDeposit,
		walletData,
		fetchFallRate,
		setBets,
		isLoading,
		fixData: {
			minBetAmount,
			balance:walletDetails?.balance,
			fallHistory,
		},
		betAmount,
		x,
		bets,
		userBets,
		changeBetAmount,
		isGameEnd,
		handleWithdraw,
	};
};

export default useGame;
