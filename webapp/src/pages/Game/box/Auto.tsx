import { useState } from "react"
import { IncButton } from "./IncButton"

export const Auto = ({handleChange,handleClick,amount,buttonType,Deposite,x,bets,Withdrawal,futureBet}:any) => {
    const [autoX ,setAutoX] = useState<number>(1.0)
    const [checked ,setChecked] = useState<boolean>(false)
    return (
        <div id="Auto" className="tab-pane">
<div  className="first-row auto-game-feature auto-game">
   <div  className="bet-block">
      <div   className="spinner ng-untouched ng-valid ng-dirty">
         <div  className="spinner big">
            <div  className="buttons"><button  type="button" onClick={()=>{handleClick("Dec",1)}}><i className="fa fa-minus" ></i></button></div>
            <div  className="input full-width"><input  type="text" className="font-weight-bold"
														value={amount}
														onChange={handleChange}/></div>
            <div  className="buttons"><button  type="button" onClick={()=>{handleClick("Inc",1)}}><i className="fa fa-plus" ></i></button></div>
         </div>
         
      </div>
      <IncButton
            handleClick={handleClick}
            />
   </div>
   <div  className="buttons-block">
   {(futureBet?.type === buttonType && futureBet?.betType === "Auto")?<><button className="btn btn-danger" style={{backgroundColor:"red"}} onClick={()=>{localStorage.removeItem(`${buttonType+"BoxFutureBet"}`)}}>Cancel</button><h6>Waiting for next round</h6></>
     : bets &&
     bets?.deposit_amount && 
     bets.status == "Pending" &&
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
         </div></>: <button  className="btn btn-success bet ng-star-inserted" disabled={checked?false:true}   onClick={()=>Deposite(amount,buttonType,"Auto",autoX,x)}>
               <span  className="d-flex flex-column justify-content-center align-items-center">
                 <label  className="label text-uppercase"> Bet </label>
                  <label  className="amount"><span >{amount}₹</span></label></span></button>}
   </div>
</div>

<div  className="text-center">
       <div  className="second-row d-flex mt-3 justify-content-s-between align-items-center form-group">
         <div  className="auto-bet-wrapper">
             <div  className="auto-bet pl-2">
                  <button  className="btn btn-sm btn-primary auto-play-btn text-uppercase ng-star-inserted">
                     AUTO PLAY</button>
                   </div>
                 </div>
                      <div className="cashout-block">
                       <div className="cash-out-switcher d-flex align-items-center">
                         <label className="pl-2 m-0 pr-2"> Auto Cash Out </label> 
                     <label className="switch">
         <input type="checkbox" onClick={()=>{setChecked(!checked)}} checked={checked} />
         <span className="slider round"></span>
       </label>
        <label className="pl-2 ">
        <div   className="spinner ng-untouched ng-valid ng-dirty" style={{width:"60%"}}>
         <div  className="spinner big">
            <div className="input "><input type='number' className="font-weight-bold" onChange={(e:any)=>{setAutoX(Number(e.target.value))}} value={autoX} />  </div></div>x</div></label> 
                       </div>
                     </div>  
                   </div>
                   </div>
			</div>
    )
}