export const IncButton = ({handleClick}:any) => {
    return (
        <div  className="bets-opt-list">
        <button  className="btn btn-secondary bet-opt" onClick={()=>{handleClick("Inc",10)}}><span > 10 </span></button>
        <button  className="btn btn-secondary bet-opt" onClick={()=>{handleClick("Inc",100)}}><span > 100 </span></button>
        <button  className="btn btn-secondary bet-opt" onClick={()=>{handleClick("Inc",500)}}><span > 500 </span></button>
        <button  className="btn btn-secondary bet-opt" onClick={()=>{handleClick("Inc",1000)}}><span > 1000 </span></button>
      </div>
    )
}