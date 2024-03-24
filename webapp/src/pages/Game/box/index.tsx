import { useState } from "react";
import { IncButton } from "./IncButton";
import { Manual } from "./Manual";
import { Auto } from "./Auto";

export const SingleBetBox = ({Deposite,bets,x,Withdrawal,buttonType,loading,autoDeposite,futureBet}:any) => {
    const [boxType, setBoxType] = useState<string>("Manual")
    const [betAmount, setBetAmount] = useState<number>(10)
    console.log("sjbsddjhfbsfhs",futureBet)

    const handleAmountClick = (type:string,amnt:number) => {
        // amount+amnt>8000 ? setError("Amount should be less than 8000"):setError("")
        if(type == 'Dec' && betAmount>=10){
            setBetAmount(betAmount-amnt)
        }
        else{
        setBetAmount(betAmount+amnt)
        }
        
    }

    const handleAmountChange = (e:any) => {
        let value = Number(e.target.value)
        if(value>8000){
            // setError("Amount should be less than 8000")
        }
        else{
            // setError("")
        }
        setBetAmount(value)
    
    }

    return (
        <>
        <div className="col-md-6 mb-mb-0 mb-4">
     <div className="game_box game_box_2">
         <ul className="nav nav_btn mb-4 d-block text-center">
									<li className='d-inline-block'>
										<a data-toggle='tab'  className={boxType == "Manual"?'active':""} onClick={()=>setBoxType("Manual")} href='#'>
											Bet
										</a>
									</li>
									<li className='d-inline-block'>
										<a data-toggle='tab' className={boxType == "Auto"?'active':""} onClick={()=>setBoxType("Auto")} href='#'>
											Auto
										</a>
									</li>
        			</ul>

									<div className="tab-content">
									{/* {bets &&
									bets?.deposit_amount && 
									x ? (
										<div id='Bet' className='tab-pane  in active'>
											<div className='bet-block d-flex flex-column'>
												<label>{bets[1]?.deposit_amount}</label>
												<button
													className='btn btn-success bet ng-star-inserted'
													onClick={() => {
														Withdrawal({
															betId: bets?._id,
															amount: bets?.deposit_amount * x,
														});
													}}
												>
													<span className='d-flex flex-column justify-content-center align-items-center'>
														<label className='label text-uppercase'>
															Withdraw
														</label>
														<label className='amount'>
															<span>{bets?.deposit_amount * x}</span>
														</label>
													</span>
												</button>
											</div>
										</div>
									) : ( */}
        {boxType === "Manual" && <Manual
        amount={betAmount}
        handleChange={handleAmountChange}
        handleClick={handleAmountClick}
        buttonType={buttonType}
        Deposite={Deposite}
        loading={loading}
        x={x}
        bets={bets}
        Withdrawal={Withdrawal}
        futureBet={futureBet}
        />}
		{/* )} */}
            {boxType === "Auto" && <Auto
               handleChange={handleAmountChange}
               handleClick={handleAmountClick}
               amount={betAmount}
               buttonType={buttonType}
               Deposite={autoDeposite}
               x={x}
               bets={bets}
               Withdrawal={Withdrawal}
               futureBet={futureBet}
            />}
			</div>

</div>
</div>
        </>
    )
}