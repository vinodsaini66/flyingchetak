import { useEffect, useState } from 'react';

import { apiPath, baseURL } from '../constant/ApiRoutes';
import { Severty, ShowToast } from '../helper/toast';
import useRequest from './useRequest';
import io from 'socket.io-client';
const socket = io('http://localhost:8002',{
	auth: {
	  token: localStorage.getItem("token"),
	},
  });;

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
				socket.emit("token","23tgejbfsdjf")
			}
			else{
				socket.emit("token","23tgejbfsdjf")
				let local:any = localStorage.getItem("FirstBoxFutureBet")
					let local1  =JSON.parse(local)
					let local2:any = localStorage.getItem("SecondBoxFutureBet")
					let local3  =JSON.parse(local2)
					fetchData()
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
		// const createInterval = setInterval(async()=>{
			socket.on("gameData",(gameData:any)=>{
				console.log("gameDatagameData",gameData)
				// console.log("jbsdjfbsdfbsdf",data)
				// setFallHistory(gameData?.data?.fallrate);
				if (gameData?.data?.allBets) {
					setBets(gameData.data.allBets);
				}
				if(gameData?.data?.userBets?.length>0){
					setUserBets(gameData?.data?.userBets)
				}
			})

			socket.emit("token","23tgejbfsdjf")
		// },1000)

		
	 
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

	const fetchData = () => {
		request({
			url: apiPath.gameInitialData,
			method: 'GET',
			onSuccess: ({ data, status }) => {
				if (status) {
					setBalance(data?.balance);
					setBets(data?.bets);
					// setUserBets(data?.userBets);
					setMinBetAmount(data?.minBetAmount);
					setGameData(data?.ongoingGame);
				}
			},
			onError: (error) => {
				ShowToast(error, Severty.ERROR);
			},
		});
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
					console.log("sdjhfbsdjhfbsjfhsd",data)
					setUserBets(data);
				}
			},
			onError: (error) => {
				ShowToast(error, Severty.ERROR);
			},
		});
	};

	const handleDeposit = (amount: number,type:string,betType:string) => {
		if (balance < amount) {
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
						fetchData();
					}
				},
				onError: (error) => {
					ShowToast(error, Severty.ERROR);
				},
			});
		}
	};
	const handleAutoDeposit = (amount: number,type:string,betType:string,x:number) => {
		if (balance < amount) {
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
						fetchData();
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
					fetchData();
				}
			},
		});
	};

	useEffect(() => {
		const token = localStorage.getItem("token")
		const source = new EventSource(`${baseURL}handle-game/${token}`);

		source.addEventListener('open', () => {
			console.log('SSE opened!');
		});

		source.addEventListener('message', (e) => {
			console.log(e.data);
			const data = JSON.parse(e.data);
			if (data?.status) {
				setIsLoading(false)
				if (data?.data?.timer>1) {
					// setX(data.data.timer);
					// setIsGameEnd(false);
				}
				else {
					let local:any = localStorage.getItem("FirstBoxFutureBet")
					let local1  =JSON.parse(local)
					let local2:any = localStorage.getItem("SecondBoxFutureBet")
					let local3  =JSON.parse(local2)
					if(local1){
						handleDeposit(local1.amount,local1.type,local1.betType)
						localStorage.removeItem("FirstBoxFutureBet")
					}
					if(local3){
						handleDeposit(local1.amount,local1.type,local1.betType)
						localStorage.removeItem("SecondBoxFutureBet")
					}
					// setIsGameEnd(true);
					// setX(data.data.timer);
					// fetchData()
					// source.close();
				}
				
				if (data?.data?.allBets) {
					setBets(data.data.allBets);
				}
				if(data?.data?.userBets.length>0){
					setUserBets(data?.data?.userBets)
				}
			}
		});
		source.addEventListener('error', (e) => {
			console.error('Error: ', e);
		});

		return () => {
			if (source.readyState !== EventSource.CLOSED) {
			  source.close(); // Close only if not already closed
			}
		};
	}, []);

	return {
		handleDeposit,
		handleAutoDeposit,
		fetchData,
		fetchFallRate,
		setBets,
		isLoading,
		fixData: {
			minBetAmount,
			balance,
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
