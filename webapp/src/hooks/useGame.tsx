import { useEffect, useState } from 'react';

import { apiPath, baseURL } from '../constant/ApiRoutes';
import { Severty, ShowToast } from '../helper/toast';
import useRequest from './useRequest';

const useGame = () => {
	const [gameData, setGameData] = useState<any>();
	const [bets, setBets] = useState<any[]>([]);
	const [userBets, setUserBets] = useState<any[]>([]);
	const [balance, setBalance] = useState<number>(0);
	const [x, setX] = useState<number>();
	const [fallHistory, setFallHistory] = useState<any[]>([]);
	const [betAmount, setBetAmount] = useState<number>(10);
	const [minBetAmount, setMinBetAmount] = useState<number>(10);
	const [isGameEnd, setIsGameEnd] = useState<boolean>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [fallRate, setFallRate] = useState<any[]>([]);


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
					setUserBets(data?.userBets);
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
				console.log("sdbsdfbsdhfsdshf",data,status)
				if (status) {
					setFallHistory(data);
				}
			},
			onError: (error) => {
				ShowToast(error, Severty.ERROR);
			},
		});
	};

	const handleDeposit = (amount: number,type:string,betType:string) => {
		console.log("beterror====>>>>",balance,amount)
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
				amount: amount*x,
				boxType:type,
				betType:betType
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
	}: {
		betId: string;
		amount: number;
	}) => {
		request({
			url: apiPath.gameWithdraw + '/' + betId,
			method: 'POST',
			data: { amount },
			onSuccess: ({ data, status }) => {
				if (status) {
					fetchData();
				}
			},
		});
	};

	useEffect(() => {
		const source = new EventSource(`${baseURL}handle-game`);

		source.addEventListener('open', () => {
			console.log('SSE opened!');
		});

		source.addEventListener('message', (e) => {
			console.log(e.data);
			const data = JSON.parse(e.data);
			if (data?.status) {
				setIsLoading(false)
				if (data?.data?.timer>-1) {
					let local:any = localStorage.getItem("betConfig")
					let local1  =JSON.parse(local)
					if(local1){
						handleDeposit(local1.amount,local1.type,local1.betType)
						localStorage.removeItem("betConfig")
					}
					setX(data.data.timer);
					setIsGameEnd(false);
				}
				else {
					setIsGameEnd(true);
					// source.close();
				}
				if (data?.data?.allBets) {
					setBets(data.data.allBets);
				}
			}
		});
		source.addEventListener('error', (e) => {
			console.error('Error: ', e);
		});

		return () => {
			console.log("jbsdjfsbdjhbdfhj",source.readyState,EventSource.CLOSED)
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
