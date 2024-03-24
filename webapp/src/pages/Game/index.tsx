import { Button, Form, InputNumber, Tag } from 'antd';
import { useContext, useEffect, useState } from 'react';

import useGame from '../../hooks/useGame';
import { Graph } from './Graph';
import { Footer } from '../../comman/Footer';
import { AuthContext } from '../../context/AuthContext';
import { BetBox } from './BetBox';
import { LoaderPage } from './LoaderPage';
import Loader from '../../component/Loader';
import { SingleBetBox } from './box';

export const Game = () => {
	const [selectedBetTab, setSelectedBetTab] = useState<number>(0);
	const [selectedBets, setSelectedBets] = useState<any[]>([]);


	const { userProfile } = useContext(AuthContext)

		const {
			handleDeposit,
			handleAutoDeposit,
			fetchData,
			fetchFallRate,
			isLoading,
			fixData,
			bets,
			userBets,
			x,
			isGameEnd,
			setBets,
			handleWithdraw,
		} = useGame();
	let bet1 = localStorage.getItem("FirstBoxFutureBet")
	let firstBoxBet = bet1 && JSON.parse(bet1)
    let bet2 = localStorage.getItem("SecondBoxFutureBet")
	let secondBoxBet = bet2 && JSON.parse(bet2)
	console.log("isGameEndisGameEnd",isGameEnd)

	const [form] = Form.useForm();

	const formWatchedValues = Form.useWatch([], form);

	const handleDepositFormSubmit = (amount: number,type:string,betType:string) => {
		if(!isGameEnd ){
			let betConfig:any = {
				amount:amount,
				type:type,
				betType:betType
			} 
			let val= JSON.stringify(betConfig)
			if(type == "First"){
				localStorage.setItem("FirstBoxFutureBet",val)
			}
			if(type == "Second"){
				localStorage.setItem("SecondBoxFutureBet",val)
			}
			
		}
		else{
			handleDeposit(amount,type,betType);
		}
	};
	const handleAutoDepositFormSubmit = (amount: number,type:string,betType:string,x:number) => {
		if(!isGameEnd ){
			let betConfig:any = {
				amount:amount,
				type:type,
				betType:betType
			} 
			let val= JSON.stringify(betConfig)
			if(type == "First"){
				localStorage.setItem("FirstBoxFutureBet",val)
			}
			if(type == "Second"){
				localStorage.setItem("SecondBoxFutureBet",val)
			}
		}
		else{
			handleAutoDeposit(amount,type,betType,x);
		}
	};
	const handleBetChange = async(e:number) => {
		setSelectedBetTab(e)
		if(e === 1){
			let bettttt = await bets.filter((item:any,i:number)=>{return userProfile?._id === item?.user_id })
			setSelectedBets(bettttt)
		}
		else{
			setSelectedBets(bets)

		}
	}

	useEffect(() => {
		fetchData();
		fetchFallRate()
	}, []);
	useEffect(()=>{
		handleBetChange(0)
	},[bets])

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
								onClick={()=>handleBetChange(0)}
							>
								All Bets
							</a>
						</li>
						<li className='d-inline-block'>
							<a
								data-toggle='tab'
								className={selectedBetTab === 1 ? 'active' : ''}
								onClick={()=>handleBetChange(1)}
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
												<th className='text-center'>Name </th>
												<th className='text-center'> Bet, ₹ </th>
												<th className='text-right'> Cash out, ₹ </th>
											</tr>
										</thead>
										<tbody>
											{bets?.map((bet: any) => (
												<tr key={bet?._id}>
													<td>
														<span className=''>
															<img src='img/user.jpg' className='user_w' />
														</span>
													</td>
													<td>
														<span className=''>
															{bet?.name}
														</span>
													</td>
													<td className='text-center'>{bet?.deposit_amount}</td>
													<td className='text-right'>
														{bet?.withdraw_amount ? bet?.withdraw_amount : 0}
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
												<th className='text-center'>Name </th>
												<th className='text-center'> Bet, ₹ </th>
												<th className='text-right'> Cash out, ₹ </th>
											</tr>
										</thead>
										<tbody>
											{bets?.map((bet: any) => (
												<tr key={bet?._id}>
													<td>
														<span className=''>
															<img src='img/user.jpg' className='user_w' />
														</span>
													</td>
													<td>
														{bet?.name}
													</td>
													<td className='text-center'>{bet?.deposit_amount}</td>
													<td className='text-right'>
														{bet?.withdraw_amount ? bet?.withdraw_amount : 0}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className='game_right'>
					<div className='top_scor'>
						{fixData?.fallHistory?.map((item) => (
							<span>{item.fall_rate.toFixed(2)}x</span>
						))}
					</div>
					{!isGameEnd || !x ? (
						<div>
						<div className='game_box mt-3 mb-3 h50 d-flex flex-column position-relative'>
							<h1 className='m-auto'>{x?.toFixed(2)}X</h1>
							{/* <h1 className='m-auto'>Game End</h1> */}
						<img src="../../img/horse-running.gif"  width={200} height={100} style={{marginLeft:"40%"}}/>
						{/* <source src="../../img/horseringtone.mp3" type="audio/mpeg" /> */}
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
	bets={userBets && userBets[0]}
	Deposite={handleDepositFormSubmit}
	x={x}
	Withdrawal={handleWithdraw}
	buttonType={"First"}
	autoDeposite={handleAutoDepositFormSubmit}
	futureBet={firstBoxBet}
	/>
	<SingleBetBox 
	bets={userBets && userBets[1]}
	Deposite={handleDepositFormSubmit}
	x={x}
	buttonType={"Second"}
	Withdrawal={handleWithdraw}
	autoDeposite={handleAutoDepositFormSubmit}
	futureBet={secondBoxBet}
	/>
      </div>
				</div>
			</div></>}
			{/* <Footer/> */}
		</>
	);
};
