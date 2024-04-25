import { Button, Form, InputNumber, Tag } from 'antd';
import {  useContext, useEffect, useRef, useState } from 'react';

import useGame from '../../hooks/useGame';
import { Graph } from './Graph';
import { Footer } from '../../comman/Footer';
import { AuthContext } from '../../context/AuthContext';
import { BetBox } from './BetBox';
import { LoaderPage } from './LoaderPage';
import Loader from '../../component/Loader';
import { SingleBetBox } from './box';
import { SocketContext } from '../../context/SocketContext';

export const Main = () => {
	const [selectedBetTab, setSelectedBetTab] = useState<number>(0);
	const [selectedBets, setSelectedBets] = useState<any[]>([]);
	const audioRef = useRef<HTMLAudioElement>(null);
	const {x,isLoading,bets,
		userBets,
		userCurrentBets,
		isGameEnd,
		firstBoxFutureBet,
		secondBoxFutureBet,
		setSecondBoxFutureBet,
		setFirstBoxFutureBet
			} = useContext(SocketContext)

		const {
			handleDeposit,
			handleAutoDeposit,
			walletData,
			fetchFallRate,
			fixData,
			handleWithdraw,
		}:any = useGame();
	let bet1 = localStorage.getItem("FirstBoxFutureBet")
	let firstBoxBet = bet1 && JSON.parse(bet1)
    let bet2 = localStorage.getItem("SecondBoxFutureBet")
	let secondBoxBet = bet2 && JSON.parse(bet2)

	const [form] = Form.useForm();
	console.log("userCurrentBetsuserCurrentBets===>>>",userCurrentBets)

	const formWatchedValues = Form.useWatch([], form);
	// useEffect(()=>{
	// 	togglePlay()
	// },[isGameEnd])
	const togglePlay = () => {
		if (isGameEnd) {
			audioRef?.current?.pause();
		  } if(!isGameEnd) {
			audioRef?.current?.play();
		  }
	  };


	const handleDepositFormSubmit = (amount: number,type:string,betType:string) => {
		let betConfig:any = {
			amount:amount,
			type:type,
			betType:betType
		} 
		if(!isGameEnd ){
			console.log("sdkfjbsdjhhfbsdhj")
			if(type == "First"){
				setFirstBoxFutureBet(betConfig)
			}
			if(type == "Second"){
				setSecondBoxFutureBet(betConfig)
			}
		}
		else{
			handleDeposit(betConfig);
		}
	};
	const handleAutoDepositFormSubmit = (amount: number,type:string,betType:string,x:number) => {
		let betConfig:any = {
			amount:amount,
			type:type,
			betType:betType,
			x:x
		}
		if(!isGameEnd ){
			if(type == "First"){
				setFirstBoxFutureBet(betConfig)
			}
			if(type == "Second"){
				setSecondBoxFutureBet(betConfig)
			}
		}
		else{
			// betConfig.x=x
			handleAutoDeposit(betConfig);
		}
	};
	useEffect(() => {
		// walletData();
		fetchFallRate()
	}, []);
	return (
		<>

			{isLoading?<LoaderPage/>:
			<>
			<div className='game_top d-flex in_nav align-items-center'>
				<img
					src='img/logo.png'
					alt='header-Logo '
					className='logo in_nav_logo'
				/>
				<div className='ml-auto'>
					<i className='fa fa-inr'></i> {fixData?.balance?.toFixed(2)}
				</div>
				<div className='ml-4'>
					<span className='user_img mr-3'>
						<img src='img/user.jpg' />
					</span>
					8proc_4596093
				</div>
			</div>
			<div className='game_page'>
				<div className='game_left'>
					<ul className='nav nav_btn mb-2 d-block text-center'>
						<li className='d-inline-block'>
							<a
								data-toggle='tab'
								className={selectedBetTab === 0 ? 'active' : ''}
								onClick={()=>setSelectedBetTab(0)}
							>
								All Bets
							</a>
						</li>
						<li className='d-inline-block'>
							<a
								data-toggle='tab'
								className={selectedBetTab === 1 ? 'active' : ''}
								onClick={()=>setSelectedBetTab(1)}
							>
								My Bets
							</a>
						</li>
					</ul>

					<div className='tab-content'>
						{selectedBetTab == 0 && (
							<div
								id='AllBets'
								className={`tab-pane ${
									selectedBetTab === 0 ? 'in active' : 'fade'
								}`}
							>
								{/* <div className='mb-2'> All Bets 610406</div> */}
								<div className='game_left_s '>
									<table className='table'>
										<thead className=''>
											<tr>
												<th>User</th>
												<th className='text-center'> Bet, ₹ </th>
												<th className='text-center'>X</th>
												<th className='text-right'> Cash out, ₹ </th>
											</tr>
										</thead>
										<tbody>
											{bets?.map((bet: any) => (
												<tr style={bet?.status === "Placed" ? {background:"green"}:{}} key={bet?._id}>
													<td>
														<span className=''>
															<img src='img/user.jpg' className='user_w' />
														</span>
													</td>
													<td className='text-center'>{bet?.deposit_amount}</td>
													<td>
														{bet?.status === "Placed" && <span className=''>
															{bet?.xValue.toFixed(2)}
														</span>}
													</td>
													<td className='text-right'>
														{bet?.withdraw_amount ? bet?.withdraw_amount.toFixed() : 0}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}

						{selectedBetTab == 1 && (
							<div
								id='MyBets'
								className={`tab-pane ${
									selectedBetTab === 1 ? 'in active' : 'fade'
								}`}
							>
								<div className='game_left_s '>
									<table className='table'>
										<thead className=''>
											<tr>
												<th>User</th>
												<th className='text-center'> Bet, ₹ </th>
												<th className='text-center'>X</th>
												<th className='text-right'> Cash out, ₹ </th>
											</tr>
										</thead>
										<tbody>
											{userBets?.map((bet: any) => (
												<tr key={bet?._id}>
													<td>
														<span className='d-flex'>
															<img src='img/user.jpg' className='user_w' />
															<h6>{bet?.name}</h6>
														</span>
														
													</td>
													<td className='text-center'>{bet?.deposit_amount?.toFixed(2)}</td>
													<td>
													{bet?.status === "Placed" ? <span className='text-right'>
															{bet?.xValue?.toFixed(2) || "-"}
														</span>:<span className='text-right'></span>}
													</td>
													<td className='text-right'>
														{bet?.withdraw_amount ? bet?.withdraw_amount?.toFixed(2) : 0}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
						{/* <audio ref={audioRef}>
							<source src="../../img/horseringtone.mp3" type="audio/mpeg" />
							Your browser does not support the audio element.
						</audio> */}
					</div>
				</div>
				

				<div className='game_right'>
					<div className='top_scor'>
						{fixData?.fallHistory?.map((item:any) => (
							<span>{item.fall_rate.toFixed(2)}x</span>
						))}
					</div>
					{!isGameEnd || x !== 1 ? (
						<div>
						<div className='game_box mt-3 mb-3 h50 d-flex flex-column position-relative'>
							<h1 className='m-auto'>{x?.toFixed(2)}X</h1>
							{/* <h1 className='m-auto'>Game End</h1> */}
						<img src="../../img/horse-running.gif"  width={200} height={100} style={{marginLeft:"40%"}}/>
						{/* <div>
							<audio ref={audioRef} loop>
								<source src="../../img/horseringtone.mp3" type="audio/mpeg" />
								Your browser does not support the audio element.
							</audio>
    					</div> */}
						</div>
						</div>
					):<div>
					<div className='game_box mt-3 mb-3 h50 d-flex flex-column position-relative'>
					<h1 className='m-auto'><Loader/></h1>
					<h3 className='m-auto'>Game Is Starting...</h3>
					</div>
					</div>}
					<div className="row">
  
	<SingleBetBox 
	bets={userCurrentBets && userCurrentBets[0]}
	Deposite={handleDepositFormSubmit}
	x={x}
	Withdrawal={handleWithdraw}
	buttonType={"First"}
	autoDeposite={handleAutoDepositFormSubmit}
	futureBet={firstBoxFutureBet}
	setFutureBet={setFirstBoxFutureBet}
	/>
	<SingleBetBox 
	bets={userCurrentBets && userCurrentBets[1]}
	Deposite={handleDepositFormSubmit}
	x={x}
	buttonType={"Second"}
	Withdrawal={handleWithdraw}
	autoDeposite={handleAutoDepositFormSubmit}
	futureBet={secondBoxFutureBet}
	setFutureBet={setSecondBoxFutureBet}
	/>
      </div>
				</div>
			</div></>}
		</>
	);
};
