import { Button, Form, InputNumber, Tag } from 'antd';
import { useContext, useEffect, useState } from 'react';

import useGame from '../../hooks/useGame';
import { Graph } from './Graph';
import { Footer } from '../../comman/Footer';
import { AuthContext } from '../../context/AuthContext';
import { BetBox } from './BetBox';

export const Game = () => {
	const [selectedBetTab, setSelectedBetTab] = useState<number>(0);
	const [firstBoxBetAmount, setFirstBoxBetAmount] = useState<number>(10);
	const [secondBoxBetAmount, setSecondBoxBetAmount] = useState<number>(10);
	const [selectedBets, setSelectedBets] = useState<any[]>([]);
	const [firstBoxType, setFirstBoxType] = useState<string>("Bet1")
	const [secondBoxType, setSecondBoxType] = useState<string>("Bet2")
	const [firstBoxX, setFirstBoxX] = useState<number>(2.01)
	const [secondBoxX, setSecondBoxX] = useState<number>(2.01)
	const [firstBoxChecked, setFirstBoxChecked] = useState<boolean>(false)
	const [secondBoxChecked, setSecondBoxChecked] = useState<boolean>(false)

	const { userProfile } = useContext(AuthContext)

	const {
		handleDeposit,
		handleAutoDeposit,
		fetchData,
		fixData,
		bets,
		userBets,
		x,
		isGameEnd,
		setBets,
		handleWithdraw,
	} = useGame();
	console.log(selectedBetTab);
	console.log("userBets===>>>",userBets)


	const [form] = Form.useForm();

	const formWatchedValues = Form.useWatch([], form);

	const handleDepositFormSubmit = (amount: number,type:string,betType:string) => {
		handleDeposit(amount,type,betType);
	};
	const handleAutoDepositFormSubmit = (amount: number,type:string,betType:string,x:number) => {
		handleAutoDeposit(amount,type,betType,x);
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
	}, []);
	useEffect(()=>{
		handleBetChange(0)
	},[bets])

	return (
		<>
			<div className='game_top d-flex in_nav align-items-center'>
				<img
					src='img/logo.png'
					alt='header-Logo '
					className='logo in_nav_logo'
				/>
				<div className='ml-auto'>
					<i className='fa fa-inr'></i> {fixData?.balance}
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
						{fixData?.fallHistory.map((item) => (
							<span>{item}x</span>
						))}
					</div>
					{/* <div className="game_box mt-3 mb-3 h50 d-flex position-relative"> */}
					<Graph x={x}/>
{/* </div> */}
					
					{/* {isGameEnd && (
						<div className='game_box mt-3 mb-3 h50 d-flex flex-column position-relative'>
							<h1 className='m-auto'>{x}X</h1>
							<h1 className='m-auto'>Game End</h1>
						</div>
					)} */}
					<div className="row">
  {/* <div className="col-md-6 mb-mb-0 mb-4">
     <div className="game_box game_box_2">
         <ul className="nav nav_btn mb-4 d-block text-center">
									<li className='d-inline-block'>
										<a data-toggle='tab' className={firstBoxType == "Bet1"?'active':""} onClick={()=>setFirstBoxType("Bet1")} href='#'>
											Bet
										</a>
									</li>
									<li className='d-inline-block'>
										<a data-toggle='tab' className={firstBoxType == "Auto1"?'active':""} onClick={()=>setFirstBoxType("Auto1")} href='#'>
											Auto
										</a>
									</li>
        			</ul>

									<div className="tab-content">
									{userBets &&
									userBets[0] &&
									userBets[0].deposit_amount && 
									x ? (
										<div id='Bet' className='tab-pane  in active'>
											<div className='bet-block d-flex flex-column'>
												<label>{userBets[0]?.deposit_amount}</label>
												<button
													className='btn btn-success bet ng-star-inserted'
													onClick={() => {
														handleWithdraw({
															betId: userBets[0]?._id,
															amount: userBets[0]?.deposit_amount * x,
														});
													}}
												>
													<span className='d-flex flex-column justify-content-center align-items-center'>
														<label className='label text-uppercase'>
															Withdraw
														</label>
														<label className='amount'>
															<span>{userBets[0]?.deposit_amount * x}</span>
														</label>
													</span>
												</button>
											</div>
										</div>
									) : (
 firstBoxType === "Bet1" && <div id="Bet" className="tab-pane  in active"> 

<div  className="first-row auto-game-feature auto-game">
   <div  className="bet-block">
      <div   className="spinner ng-untouched ng-valid ng-dirty">
         <div  className="spinner big">
            <div  className="buttons"><button  type="button" className="minus ng-star-inserted" onClick={()=>{setFirstBoxBetAmount(firstBoxBetAmount-10)}}><i className="fa fa-minus" ></i></button></div>
            <div  className="input full-width"><input  type="text" className="font-weight-bold"
														value={firstBoxBetAmount}
														onChange={(e:any) => {
															setFirstBoxBetAmount(e?.target.value)
														}} /></div>
            <div  className="buttons"><button  type="button" className="plus ng-star-inserted" onClick={()=>{setFirstBoxBetAmount(firstBoxBetAmount+10)}}><i className="fa fa-plus" ></i></button></div>
         </div>
         
      </div>
      <div  className="bets-opt-list">
        <button  className="btn btn-secondary bet-opt " onClick={()=>{setFirstBoxBetAmount(10)}}><span > 10 </span></button>
        <button  className="btn btn-secondary bet-opt " onClick={()=>{setFirstBoxBetAmount(100)}}><span > 100 </span></button>
        <button  className="btn btn-secondary bet-opt " onClick={()=>{setFirstBoxBetAmount(500)}}><span > 500 </span></button>
        <button  className="btn btn-secondary bet-opt " onClick={()=>{setFirstBoxBetAmount(1000)}}><span > 1000 </span></button>
      </div>
   </div>
   <div  className="buttons-block">
      <button  className="btn btn-success bet ng-star-inserted" onClick={()=>handleDepositFormSubmit(firstBoxBetAmount,"FIRST")}>
        <span  className="d-flex flex-column justify-content-center align-items-center">
          <label  className="label text-uppercase"> Bet </label>
           <label  className="amount"><span >{firstBoxBetAmount}₹</span></label></span></button> 
   </div>
</div>
</div>
)}

 {firstBoxType === "Auto1" && <div id="Auto" className="tab-pane">
<div  className="first-row auto-game-feature auto-game">
   <div  className="bet-block">
      <div   className="spinner ng-untouched ng-valid ng-dirty">
         <div  className="spinner big">
            <div  className="buttons"><button  type="button" className="minus ng-star-inserted"><i className="fa fa-minus" ></i></button></div>
            <div  className="input full-width"><input  type="text" className="font-weight-bold"
														value={firstBoxBetAmount}
														onChange={(e:any) => {
															setFirstBoxBetAmount(e?.target.value)
														}} /></div>
            <div  className="buttons"><button  type="button" className="plus ng-star-inserted"><i className="fa fa-plus" ></i></button></div>
         </div>
         
      </div>
      <div  className="bets-opt-list">
      	<button className="btn btn-secondary bet-opt" onClick={()=>{setFirstBoxBetAmount(10)}}><span> 10 </span></button>
        <button  className="btn btn-secondary bet-opt" onClick={()=>{setFirstBoxBetAmount(100)}}><span> 100 </span></button>
        <button  className="btn btn-secondary bet-opt" onClick={()=>{setFirstBoxBetAmount(500)}}><span> 500 </span></button>
        <button  className="btn btn-secondary bet-opt" onClick={()=>{setFirstBoxBetAmount(1000)}}><span> 1000 </span></button>
      </div>
   </div>
   <div  className="buttons-block">
      <button  className="btn btn-success bet ng-star-inserted" onClick={()=>handleDepositFormSubmit(firstBoxBetAmount,"FIRST")}>
        <span  className="d-flex flex-column justify-content-center align-items-center">
          <label className="label text-uppercase"> Bet </label>
           <label className="amount"><span >{firstBoxBetAmount}₹</span></label></span></button> 
   </div>
</div>

<div  className="text-center">
<div  className="second-row d-md-inline-flex mt-3 align-items-center">
  <div  className="auto-bet-wrapper">
      <div  className="auto-bet pl-2">
           <button  className="btn btn-sm btn-primary auto-play-btn text-uppercase ng-star-inserted">
              AUTO PLAY</button>
            </div>
          </div>
               <div className="cashout-block">
                <div className="cash-out-switcher d-flex align-items-center">
                  <label className="pl-2 m-0 pr-2"> Auto Cash Out </label> 
              <label className="switch m-0">
  <input type="checkbox" onClick={()=>{setFirstBoxChecked(!firstBoxChecked)}} checked={firstBoxChecked} />
  <span className="slider round"></span>
</label>
 <label className="pl-2 m-0"> <div  className="input full-width"><input type='number' className="font-weight-bold" onChange={(e:any)=>{setFirstBoxX(e.target.value)}} value={firstBoxX} /> x </div></label> 
                </div>
              </div>  
			</div>
			</div>
			</div>}
			</div>

</div>
</div> */}
<BetBox 
	string1={"Bet1"}
	string2={"Auto1"}
	boxType={firstBoxType}
	setBoxType={setFirstBoxType}
	bets={userBets && userBets[0]}
	x={x}
	Withdrawal={handleWithdraw}
	amount={firstBoxBetAmount}
	setAmount={setFirstBoxBetAmount}
	Deposite={handleDepositFormSubmit}
	autoDeposite={handleAutoDepositFormSubmit}
	boxChecked={firstBoxChecked}
	setBoxChecked={setFirstBoxChecked}
	boxX={firstBoxX}
	setBoxX={setFirstBoxX} />

	<BetBox 
	string1={"Bet2"}
	string2={"Auto2"}
	boxType={secondBoxType}
	setBoxType={setSecondBoxType}
	bets={userBets && userBets[1]}
	x={x}
	Withdrawal={handleWithdraw}
	amount={secondBoxBetAmount}
	setAmount={setSecondBoxBetAmount}
	Deposite={handleDepositFormSubmit}
	boxChecked={secondBoxChecked}
	setBoxChecked={setSecondBoxChecked}
	boxX={secondBoxX}
	setBoxX={setSecondBoxX} />

{/* <div className="col-md-6 mb-mb-0 mb-4">
     <div className="game_box game_box_2">
         <ul className="nav nav_btn mb-4 d-block text-center">
									<li className='d-inline-block'>
										<a data-toggle='tab' className={firstBoxType == "Bet2"?'active':""} onClick={()=>setSecondBoxType("Bet2")} href='#'>
											Bet
										</a>
									</li>
									<li className='d-inline-block'>
										<a data-toggle='tab' className={firstBoxType == "Auto2"?'active':""} onClick={()=>setSecondBoxType("Auto2")} href='#'>
											Auto
										</a>
									</li>
        			</ul>

									<div className="tab-content">
									{userBets &&
									userBets[1] &&
									userBets[1].deposit_amount && 
									x ? (
										<div id='Bet' className='tab-pane  in active'>
											<div className='bet-block d-flex flex-column'>
												<label>{userBets[1]?.deposit_amount}</label>
												<button
													className='btn btn-success bet ng-star-inserted'
													onClick={() => {
														handleWithdraw({
															betId: userBets[1]?._id,
															amount: userBets[1]?.deposit_amount * x,
														});
													}}
												>
													<span className='d-flex flex-column justify-content-center align-items-center'>
														<label className='label text-uppercase'>
															Withdraw
														</label>
														<label className='amount'>
															<span>{userBets[1]?.deposit_amount * x}</span>
														</label>
													</span>
												</button>
											</div>
										</div>
									) : (
		secondBoxType === "Bet2" && <div id="Bet" className="tab-pane  in active">
		<div  className="first-row auto-game-feature auto-game">
		<div  className="bet-block">
			<div   className="spinner ng-untouched ng-valid ng-dirty">
				<div  className="spinner big">
					<div  className="buttons"><button  type="button" className="minus ng-star-inserted" onClick={()=>{setSecondBoxBetAmount(secondBoxBetAmount-10)}}><i className="fa fa-minus" ></i></button></div>
					<div  className="input full-width"><input  type="text" className="font-weight-bold"
																value={secondBoxBetAmount}
																onChange={(e:any) => {
																	setSecondBoxBetAmount(e?.target.value)
																}} /></div>
					<div  className="buttons"><button  type="button" className="plus ng-star-inserted" onClick={()=>{setSecondBoxBetAmount(secondBoxBetAmount+10)}}><i className="fa fa-plus" ></i></button></div>
				</div>
				
			</div>
			<div  className="bets-opt-list">
				<button  className="btn btn-secondary bet-opt " onClick={()=>{setSecondBoxBetAmount(10)}}><span > 10 </span></button>
				<button  className="btn btn-secondary bet-opt " onClick={()=>{setSecondBoxBetAmount(100)}}><span > 100 </span></button>
				<button  className="btn btn-secondary bet-opt " onClick={()=>{setSecondBoxBetAmount(500)}}><span > 500 </span></button>
				<button  className="btn btn-secondary bet-opt " onClick={()=>{setSecondBoxBetAmount(1000)}}><span > 1000 </span></button>
			</div>
		</div>
		<div  className="buttons-block">
			<button  className="btn btn-success bet ng-star-inserted"  onClick={()=>handleDepositFormSubmit(secondBoxBetAmount,"SECOND")}>
				<span  className="d-flex flex-column justify-content-center align-items-center">
				<label  className="label text-uppercase"> Bet </label>
				<label  className="amount"><span >{secondBoxBetAmount}₹</span></label></span></button> 
		</div>
		</div>
		</div>
		)}

 {secondBoxType === "Auto2" && <div id="Auto" className="tab-pane">
<div  className="first-row auto-game-feature auto-game">
   <div  className="bet-block">
      <div   className="spinner ng-untouched ng-valid ng-dirty">
         <div  className="spinner big">
            <div  className="buttons"><button  type="button" className="minus ng-star-inserted"><i className="fa fa-minus" ></i></button></div>
            <div  className="input full-width"><input  type="text" className="font-weight-bold"
														value={secondBoxBetAmount}
														onChange={(e:any) => {
															setSecondBoxBetAmount(e?.target.value)
														}} /></div>
            <div  className="buttons"><button  type="button" className="plus ng-star-inserted"><i className="fa fa-plus" ></i></button></div>
         </div>
         
      </div>
      <div  className="bets-opt-list">
      	<button className="btn btn-secondary bet-opt" onClick={()=>{setSecondBoxBetAmount(10)}}><span> 10 </span></button>
        <button  className="btn btn-secondary bet-opt" onClick={()=>{setSecondBoxBetAmount(100)}}><span> 100 </span></button>
        <button  className="btn btn-secondary bet-opt" onClick={()=>{setSecondBoxBetAmount(500)}}><span> 500 </span></button>
        <button  className="btn btn-secondary bet-opt" onClick={()=>{setSecondBoxBetAmount(1000)}}><span> 1000 </span></button>
      </div>
   </div>
   <div  className="buttons-block">
      <button  className="btn btn-success bet ng-star-inserted"  onClick={()=>handleDepositFormSubmit(secondBoxBetAmount,"SECOND")}>
        <span  className="d-flex flex-column justify-content-center align-items-center">
          <label className="label text-uppercase"> Bet </label>
           <label className="amount"><span >{secondBoxBetAmount}₹</span></label></span></button> 
   </div>
</div>

<div  className="text-center">
<div  className="second-row d-md-inline-flex mt-3 align-items-center">
  <div  className="auto-bet-wrapper">
      <div  className="auto-bet pl-2">
           <button  className="btn btn-sm btn-primary auto-play-btn text-uppercase ng-star-inserted">
              AUTO PLAY</button>
            </div>
          </div>
               <div className="cashout-block">
                <div className="cash-out-switcher d-flex align-items-center">
                  <label className="pl-2 m-0 pr-2"> Auto Cash Out </label> 
              <label className="switch m-0">
  <input type="checkbox" onClick={()=>{setSecondBoxChecked(!secondBoxChecked)}} checked={secondBoxChecked}/>
  <span className="slider round"></span>
</label>
 <label className="pl-2 m-0"> <div  className="input full-width"><input type='number' className="font-weight-bold" onChange={(e:any)=>{setSecondBoxX(e.target.value)}} value={secondBoxX} /> x </div></label> 
                </div>
              </div>  
			</div>
			</div>
			</div>}
			</div>

</div>
</div> */}
      </div>





					{/* <div className='row'>
						<div className='col-md-6 mb-mb-0 mb-4'>
							<div className='game_box game_box_2'>
								<ul className='nav nav_btn mb-4 d-block text-center'>
									<li className='d-inline-block'>
										<a data-toggle='tab' className={firstBoxType == "Bet1"?'active':""} onClick={()=>setFirstBoxType("Bet1")} href='#'>
											Bet
										</a>
									</li>
									<li className='d-inline-block'>
										<a data-toggle='tab' className={firstBoxType == "Auto1"?'active':""} onClick={()=>setFirstBoxType("Auto1")} href='#'>
											Auto
										</a>
									</li>
								</ul>

								<div className='tab-content'>
									{userBets &&
									userBets[0] &&
									userBets[0].deposit_amount &&
									x ? (
										<div id='Bet' className='tab-pane  in active'>
											<div className='bet-block d-flex flex-column'>
												<Tag>{userBets[0]?.deposit_amount}</Tag>
												<Button
													className='btn btn-success bet ng-star-inserted'
													onClick={() => {
														handleWithdraw({
															betId: userBets[0]?._id,
															amount: userBets[0]?.deposit_amount * x,
														});
													}}
												>
													<span className='d-flex flex-column justify-content-center align-items-center'>
														<label className='label text-uppercase'>
															Withdraw
														</label>
														<label className='amount'>
															<span>{userBets[0]?.deposit_amount * x}</span>
														</label>
													</span>
												</Button>
											</div>
										</div>
									) : (
										<div id='Bet' className='tab-pane  in active'>
											<Form
												form={form}
												onFinish={handleDepositFormSubmit}
												autoComplete='off'
												layout='vertical'
												name='setting_form'
												className='first-row auto-game-feature auto-game'
											>
												<div className='bet-block'>
													<div className='spinner ng-untouched ng-valid ng-dirty bets-opt-list input full-width'>
													<Form.Item name='bet_amount' initialValue={10}>
														<InputNumber
														className="font-weight-bold"
														addonBefore='+'
														// style={{ background: '#2c274f', width: '100%',color:"#2c274f" }}
														onChange={(e) => {
															form.setFieldValue('bet_amount', e);
														}}
														/>
													</Form.Item>
													
													</div>
													<div className='bets-opt-list'>
														<Tag
															className='btn btn-secondary bet-opt'
															onClick={() => {
																form.setFieldValue('bet_amount', 10);
															}}
														>
															<span> 10 </span>
														</Tag>
														<Tag
															className='btn btn-secondary bet-opt'
															onClick={() => {
																form.setFieldValue('bet_amount', 100);
															}}
														>
															<span> 100 </span>
														</Tag>
														<Tag
															className='btn btn-secondary bet-opt'
															onClick={() => {
																form.setFieldValue('bet_amount', 500);
															}}
														>
															<span> 500 </span>
														</Tag>
														<Tag
															className='btn btn-secondary bet-opt'
															onClick={() => {
																form.setFieldValue('bet_amount', 1000);
															}}
														>
															<span> 1000 </span>
														</Tag>
													</div>
												</div>
												<div className='buttons-block'>
													<Button
														htmlType='submit'
														className='btn btn-success bet ng-star-inserted'
													>
														<span className='d-flex flex-column justify-content-center align-items-center'>
															<label className='label text-uppercase'>
																Bet
															</label>
															<label className='amount'>
																<span>{formWatchedValues?.bet_amount}</span>
															</label>
														</span>
													</Button>
												</div>
											</Form>
											<div id='Auto' className='tab-pane fade'>
												<div className='first-row auto-game-feature auto-game'>
													<div className='bet-block'>
														<div className='spinner ng-untouched ng-valid ng-dirty'>
															<div className='spinner big'>
																<div className='buttons'>
																	<button
																		type='button'
																		className='minus ng-star-inserted'
																	>
																		<i className='fa fa-minus'></i>
																	</button>
																</div>
																<div className='input full-width'>
																	<input
																		type='text'
																		value='10.10'
																		className='font-weight-bold'
																	/>
																</div>
																<div className='buttons'>
																	<button
																		type='button'
																		className='plus ng-star-inserted'
																	>
																		<i className='fa fa-plus'></i>
																	</button>
																</div>
															</div>
														</div>
														<div className='bets-opt-list'>
															<button className='btn btn-secondary bet-opt '>
																<span> 10 </span>
															</button>
															<button className='btn btn-secondary bet-opt '>
																<span> 100 </span>
															</button>
															<button className='btn btn-secondary bet-opt '>
																<span> 500 </span>
															</button>
															<button className='btn btn-secondary bet-opt '>
																<span> 1000 </span>
															</button>
														</div>
													</div>
													<div className='buttons-block'>
														<button className='btn btn-success bet ng-star-inserted'>
															<span className='d-flex flex-column justify-content-center align-items-center'>
																<label className='label text-uppercase'>
																	Bet
																</label>
																<label className='amount'>
																	<span>10.00₹</span>
																</label>
															</span>
														</button>
													</div>
												</div>

												<div className='text-center'>
													<div className='second-row d-md-inline-flex mt-3 align-items-center'>
														<div className='auto-bet-wrapper'>
															<div className='auto-bet pl-2'>
																<button className='btn btn-sm btn-primary auto-play-btn text-uppercase ng-star-inserted'>
																	AUTO PLAY
																</button>
															</div>
														</div>
														<div className='cashout-block'>
															<div className='cash-out-switcher d-flex align-items-center'>
																<label className='pl-2 m-0 pr-2'>
																	Auto Cash Out
																</label>
																<label className='switch m-0'>
																	<input type='checkbox' checked />
																	<span className='slider round'></span>
																</label>
																<label className='pl-2 m-0  '> 10.00 x </label>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
								
							</div>
						</div>

						<div className='col-md-6 mb-mb-0 mb-4'>
							<div className='game_box game_box_2'>
								<ul className='nav nav_btn mb-4 d-block text-center'>
									<li className='d-inline-block'>
										<a data-toggle='tab' className={secondBoxType == "Bet2"?'active':""} onClick={()=>setSecondBoxType("Bet2")} href='#'>
											Bet
										</a>
									</li>
									<li className='d-inline-block'>
										<a data-toggle='tab' className={secondBoxType == "Auto2"?'active':""} onClick={()=>setSecondBoxType("Auto2")} href='#'>
											Auto
										</a>
									</li>
								</ul>

								<div className='tab-content'>
									{userBets &&
									userBets[1] &&
									userBets[1].deposit_amount &&
									x ? (
										<div id='Bet' className='tab-pane  in active'>
											<div className='bet-block d-flex flex-column'>
												<Tag>{userBets[1]?.deposit_amount}</Tag>
												<Button
													className='btn btn-success bet ng-star-inserted'
													onClick={() => {
														handleWithdraw({
															betId: userBets[1]?._id,
															amount: userBets[1]?.deposit_amount * x,
														});
													}}
												>
													<span className='d-flex flex-column justify-content-center align-items-center'>
														<label className='label text-uppercase'>
															Withdraw
														</label>
														<label className='amount'>
															<span>{userBets[1]?.deposit_amount * x}</span>
														</label>
													</span>
												</Button>
											</div>
										</div>
									) : (
										<div id='Bet' className='tab-pane  in active'>
											<Form
												form={form}
												onFinish={handleDepositFormSubmit}
												autoComplete='off'
												layout='vertical'
												name='setting_form'
												className='first-row auto-game-feature auto-game'
											>
												<div className='bet-block'>
													<div className='spinner ng-untouched ng-valid ng-dirty bets-opt-list' style={{background:"none",width:"100%",height:"100%"}}>
													<Form.Item name='bet_amount' initialValue={10}>
														<InputNumber
														// addonBefore='+'
														style={{ background: '#2c274f', width: '100%',color:"#2c274f" }}
														onChange={(e) => {
															form.setFieldValue('bet_amount', e);
														}}
														/>
													</Form.Item>
													</div>
													<div className='bets-opt-list'>
														<Tag
															className='btn btn-secondary bet-opt'
															onClick={() => {
																form.setFieldValue('bet_amount', 10);
															}}
														>
															<span> 10 </span>
														</Tag>
														<Tag
															className='btn btn-secondary bet-opt'
															onClick={() => {
																form.setFieldValue('bet_amount', 100);
															}}
														>
															<span> 100 </span>
														</Tag>
														<Tag
															className='btn btn-secondary bet-opt'
															onClick={() => {
																form.setFieldValue('bet_amount', 500);
															}}
														>
															<span> 500 </span>
														</Tag>
														<Tag
															className='btn btn-secondary bet-opt'
															onClick={() => {
																form.setFieldValue('bet_amount', 1000);
															}}
														>
															<span> 1000 </span>
														</Tag>
													</div>
												</div>
												<div className='buttons-block'>
													<Button
														htmlType='submit'
														className='btn btn-success bet ng-star-inserted'
													>
														<span className='d-flex flex-column justify-content-center align-items-center'>
															<label className='label text-uppercase'>
																Bet
															</label>
															<label className='amount'>
																<span>{formWatchedValues?.bet_amount}</span>
															</label>
														</span>
													</Button>
												</div>
											</Form>
											<div id='Auto' className='tab-pane fade'>
												<div className='first-row auto-game-feature auto-game'>
													<div className='bet-block'>
														<div className='spinner ng-untouched ng-valid ng-dirty'>
															<div className='spinner big'>
																<div className='buttons'>
																	<button
																		type='button'
																		className='minus ng-star-inserted'
																	>
																		<i className='fa fa-minus'></i>
																	</button>
																</div>
																<div className='input full-width'>
																	<input
																		type='text'
																		value='10.10'
																		className='font-weight-bold'
																	/>
																</div>
																<div className='buttons'>
																	<button
																		type='button'
																		className='plus ng-star-inserted'
																	>
																		<i className='fa fa-plus'></i>
																	</button>
																</div>
															</div>
														</div>
														<div className='bets-opt-list'>
															<button className='btn btn-secondary bet-opt '>
																<span> 10 </span>
															</button>
															<button className='btn btn-secondary bet-opt '>
																<span> 100 </span>
															</button>
															<button className='btn btn-secondary bet-opt '>
																<span> 500 </span>
															</button>
															<button className='btn btn-secondary bet-opt '>
																<span> 1000 </span>
															</button>
														</div>
													</div>
													<div className='buttons-block'>
														<button className='btn btn-success bet ng-star-inserted'>
															<span className='d-flex flex-column justify-content-center align-items-center'>
																<label className='label text-uppercase'>
																	Bet
																</label>
																<label className='amount'>
																	<span>10.00₹</span>
																</label>
															</span>
														</button>
													</div>
												</div>

												<div className='text-center'>
													<div className='second-row d-md-inline-flex mt-3 align-items-center'>
														<div className='auto-bet-wrapper'>
															<div className='auto-bet pl-2'>
																<button className='btn btn-sm btn-primary auto-play-btn text-uppercase ng-star-inserted'>
																	AUTO PLAY
																</button>
															</div>
														</div>
														<div className='cashout-block'>
															<div className='cash-out-switcher d-flex align-items-center'>
																<label className='pl-2 m-0 pr-2'>
																	Auto Cash Out
																</label>
																<label className='switch m-0'>
																	<input type='checkbox' checked />
																	<span className='slider round'></span>
																</label>
																<label className='pl-2 m-0  '> 10.00 x </label>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
								
							</div>
						</div>
					</div> */}
				</div>
			</div>
			{/* <Footer/> */}
		</>
	);
};
