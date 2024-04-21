import { useContext } from "react"
import Loader from "../../../component/Loader"
import { IncButton } from "./IncButton"
import { SocketContext } from "../../../context/SocketContext"

export const Manual = ({amount,handleChange,handleClick,buttonType,Deposite,bets,Withdrawal,futureBet,setFutureBet}:any) => {
	const {x,setFirstBoxFutureBet} = useContext(SocketContext)
    console.log("futureBetfutureBet",futureBet,bets)
    return (
        <div id="Bet" className="tab-pane  in active">
		<div  className="first-row auto-game-feature auto-game">
		<div  className="bet-block">
        <div   className="spinner ng-untouched ng-valid ng-dirty">
                <div  className="spinner big">
                   <div  className="buttons"><button  type="button" className="minus ng-star-inserted"onClick={()=>{handleClick("Dec",1)}}><i className="fa fa-minus" ></i></button></div>
                   <div  className="input full-width"><input  type="number" min={0} max={8000} className="font-weight-bold"
                                                               value={amount}
                                                               onChange={handleChange}/></div>
                                                              {/* <span style={{color:"red"}}>{error}</span> */}
                   <div  className="buttons"><button  type="button" className="plus ng-star-inserted" onClick={()=>{handleClick("Inc",1)}}><i className="fa fa-plus" ></i></button></div>
                </div>
             </div>
			<IncButton
            handleClick={handleClick}
            />
		</div>
		<div  className="buttons-block">
        {(futureBet?.type === buttonType && futureBet?.betType === "Manual") || (bets?.betType
			=== "Manual" && bets?.boxType == buttonType && x === 1)?<><button className="btn btn-danger" style={{backgroundColor:"red"}} onClick={()=>{setFutureBet({})}}>Cancel</button>
            <h6>Waiting for the next round</h6>
            </>
                                    : bets &&
									bets?.deposit_amount && 
									bets?.status == "Active" &&
									bets?.betType=== "Manual" &&
									x !== 1 ?
                                        <>
										<div id='Bet' className='tab-pane  in active'>
											<div className='bet-block d-flex flex-column'>
												{/* <label>{bets?.deposit_amount}</label> */}
												<button
													className='btn btn-success bet ng-star-inserted'
													onClick={() => {
														Withdrawal({
															betId: bets?._id,
															amount: bets?.deposit_amount * x,
															xVal:x
														});
													}}
												>
													<span className='d-flex flex-column justify-content-center align-items-center'>
														<label className='label text-uppercase'>
															Withdraw
														</label>
														<label className='amount'>
															<span>{(bets?.deposit_amount * x).toFixed(2)}</span>
														</label>
													</span>
												</button>
											</div>
										</div></>:<button  className="btn btn-success bet ng-star-inserted" onClick={()=>Deposite(amount,buttonType,"Manual")}>
				<span  className="d-flex flex-column justify-content-center align-items-center">
				<label  className="label text-uppercase">Bet </label>
				<label  className="amount"><span >{amount}₹</span></label></span></button> }
		</div>
		</div>
		</div>
    )
}