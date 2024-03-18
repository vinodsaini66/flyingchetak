export const BetBox = ({string1,string2,error,setError,localType,localBetType,boxType,setBoxType,bets,x,Withdrawal,amount,setAmount,Deposite,autoDeposite,setBoxChecked,boxChecked,boxX,setBoxX}:any) => {
    console.log("handleamountchnge",localType,localBetType)

const handleAmountClick = (type:string,amnt:number) => {
    amount+amnt>8000 ? setError("Amount should be less than 8000"):setError("")
    if(type == 'Dec' && amount>=10){
        setAmount(amount-amnt)
    }
    else{
    setAmount(amount+amnt)
    }
    
}
const handleAmountChange = (e:any) => {
    let value = Number(e.target.value)
    if(value>8000){
        setError("Amount should be less than 8000")
    }
    else{
        setError("")
    }
    setAmount(value)

}
        return (
            <div className="col-md-6 mb-mb-0 mb-4">
            <div className="game_box game_box_2">
                <ul className="nav nav_btn mb-4 d-block text-center" >
                                           <li className='d-inline-block' >
                                              {!boxChecked ? <a data-toggle='tab' className={boxType == string1?'active':""}  onClick={()=>setBoxType(string1)} href='#'>
                                                   Bet
                                               </a>: <a data-toggle='tab' className=""  href='#'>
                                                   Bet
                                               </a>}
                                           </li>
                                           <li className='d-inline-block'>
                                               <a data-toggle='tab' className={boxType == string2?'active':""} onClick={()=>setBoxType(string2)} href='#'>
                                                   Auto
                                               </a>
                                           </li>
                           </ul>
       
                                           <div className="tab-content">
                                           {bets &&
                                           bets?.deposit_amount && bets.
                                           status !== "Placed" && 
                                           x ? (
                                               <div id='Bet' className='tab-pane  in active'>
                                                   <div className='bet-block d-flex flex-column'>
                                                       <label>{bets?.deposit_amount}</label>
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
                                           ) : (
                                            (boxType === string1) && <div id="Bet" className="tab-pane  in active"> 
       
       <div  className="first-row auto-game-feature auto-game">
          <div  className="bet-block">
             <div   className="spinner ng-untouched ng-valid ng-dirty">
                <div  className="spinner big">
                   <div  className="buttons"><button  type="button" className="minus ng-star-inserted"onClick={()=>{handleAmountClick("Dec",10)}}><i className="fa fa-minus" ></i></button></div>
                   <div  className="input full-width"><input  type="number" min={0} max={8000} className="font-weight-bold"
                                                               value={amount}
                                                               onChange={handleAmountChange}/></div>
                                                              <span style={{color:"red"}}>{error}</span>
                   <div  className="buttons"><button  type="button" className="plus ng-star-inserted" onClick={()=>{handleAmountClick("Inc",10)}}><i className="fa fa-plus" ></i></button></div>
                </div>
                
             </div>
             <div  className="bets-opt-list">
               <button  className="btn btn-secondary bet-opt" onClick={()=>{handleAmountClick("Inc",10)}}><span > 10 </span></button>
               <button  className="btn btn-secondary bet-opt" onClick={()=>{handleAmountClick("Inc",100)}}><span > 100 </span></button>
               <button  className="btn btn-secondary bet-opt" onClick={()=>{handleAmountClick("Inc",500)}}><span > 500 </span></button>
               <button  className="btn btn-secondary bet-opt" onClick={()=>{handleAmountClick("Inc",1000)}}><span > 1000 </span></button>
             </div>
          </div>
          <div  className="buttons-block">
          {(localType == "FIRST" || localType == "SECOND") && localBetType == "Manual"?<button className="btn btn-danger" onClick={()=>{localStorage.removeItem("betConfig")}}>Cancel</button>: <button  className="btn btn-success bet ng-star-inserted" onClick={()=>Deposite(amount,string1 == "Bet1"?"FIRST":"SECOND","Manual",x)}>
               <span  className="d-flex flex-column justify-content-center align-items-center">
                 <label  className="label text-uppercase"> Bet </label>
                  <label  className="amount"><span >{amount}₹</span></label></span></button>}
          </div>
       </div>
       </div>
       )}
       
        {boxType === string2 && <div id="Auto" className="tab-pane">
       <div  className="first-row auto-game-feature auto-game">
          <div  className="bet-block">
             <div   className="spinner ng-untouched ng-valid ng-dirty">
                <div  className="spinner big">
                   <div  className="buttons"><button  type="button" onClick={()=>{handleAmountClick("Dec",10)}} className="minus ng-star-inserted"><i className="fa fa-minus" ></i></button></div>
                   <div  className="input full-width"><input  type="number" min={0} max={8000}  className="font-weight-bold"
                                                               value={amount}
                                                               onChange={handleAmountChange} />
                                                                 <span style={{color:"red"}}>{error}</span></div>
                                                             
                   <div  className="buttons"><button  type="button" onClick={()=>{handleAmountClick("Inc",10)}} className="plus ng-star-inserted"><i className="fa fa-plus" ></i></button></div>
                </div>
                
             </div>
             <div  className="bets-opt-list">
                 <button className="btn btn-secondary bet-opt" onClick={()=>{handleAmountClick("Inc",10)}}><span> 10 </span></button>
               <button className="btn btn-secondary bet-opt" onClick={()=>{handleAmountClick("Inc",100)}}><span> 100 </span></button>
               <button className="btn btn-secondary bet-opt" onClick={()=>{handleAmountClick("Inc",500)}}><span> 500 </span></button>
               <button className="btn btn-secondary bet-opt" onClick={()=>{handleAmountClick("Inc",1000)}}><span> 1000 </span></button>
             </div>
          </div>
          <div  className="buttons-block">
             <button  className="btn btn-success bet ng-star-inserted" onClick={()=>autoDeposite(amount,string1 == "Bet1"?"FIRST":"SECOND","Auto",boxX,x)}>
               <span  className="d-flex flex-column justify-content-center align-items-center">
                 <label className="label text-uppercase"> Bet </label>
                  <label className="amount"><span >{amount}₹</span></label></span></button> 
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
         <input type="checkbox" onClick={()=>{setBoxChecked(!boxChecked)}} checked={boxChecked} />
         <span className="slider round"></span>
       </label>
        <label className="pl-2 m-0"><div className="input full-width"><input type='number' className="form-control" onChange={(e:any)=>{setBoxX(Number(e.target.value))}} value={boxX} /> x </div></label> 
                       </div>
                     </div>  
                   </div>
                   </div>
                   </div>}
                   </div>
       
       </div>
       </div>
        )
}