import { useContext, useEffect, useState } from "react";
import { Footer } from "../../comman/Footer"
import Header from "../../comman/Header"
import WalletModal from "../../component/WalletModel";
import WithdrawalModel from "../../component/WithdrawalModel"
import useRequest from "../../hooks/useRequest";
import { apiPath } from "../../constant/ApiRoutes";
import { Severty, ShowToast } from "../../helper/toast";
import moment from "moment";
import { WalletContext } from "../../context/WalletContext";

export const Wallet = () =>{
   const [open, setOpen] = useState<boolean>(false);
   const [withdrawalOpen, setWithdrawalOpen] = useState<boolean>(false);
   const [transactionsList, setTransactionsList] = useState<any>([]);
   const [buttonClass, setButtonClass] = useState<string>("")
   const { walletDetails, setAgain } = useContext(WalletContext)


   const { request } = useRequest()
 
   const handleClose = (set:any) => {
       set(false);
   };
   const handleWithdrawalOpen = () => {
    setWithdrawalOpen(true)
   }
   useEffect(()=>{
      setAgain(true)
   },[])

   const handleDepositeOpen = () => {
       setOpen(true);
   };
   useEffect(()=>{
         handleClick("Credit")
   },[])

  

 
   const handleClick = (type:string) => {
    setButtonClass(type)
      let data = {
         transaction_type:type
      }
      request({
         url: apiPath.transactions,
         method: "POST",
         data: data,
         onSuccess: (data) => {
           // setLoading(false);
           if (data.status) {
            console.log("transactions",data)
            setTransactionsList(data.data)
           } else {
             ShowToast(data.message, Severty.ERROR);
           }
         },
         onError: (error) => {
           ShowToast(error.response.data.message, Severty.ERROR);
         },
       });


   }
    return(
        <>
        <Header/>
        <div className="in_padding">
                        <div className="container">
                            <div className="row ">
                                <div className="col-md-4 mb-4">
                                  <div className="white_box ">
                                    <h5 className=" mb-3">Wallet</h5>
                                    <hr/>
                                     <div className="text-center">
                                    <h2 className="text-white mb-0 mt-4"><i className="fa fa-inr" ></i>{walletDetails?.balance || 0.00}</h2>
                                    <p>Total Balance</p>
                                   </div>

                                   
                                    
                                   </div>
                                   </div>
                              
                                <div className="col-md-8 mb-4">
                                    <div className="white_box ">
                                <div className="row ">
                                <div className="col-md-6 mb-md-0 mb-4">
                             <div className="progressBarsL d-flex     align-items-center">
                              <div className="van-circle">
                              <svg viewBox="0 0 1100 1100"><defs><linearGradient id="van-circle-12" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#FA5A5A"></stop><stop offset="100%" stop-color="#FF998D"></stop></linearGradient></defs><path className="van-circle__layer" d="M 550 550 m 0, -500 a 500, 500 0 1, 1 0, 1000 a 500, 500 0 1, 1 0, -1000" style={{fill: "none", stroke: "rgb(216, 216, 216)", strokeWidth: "100px"}}></path><path d="M 550 550 m 0, -500 a 500, 500 0 1, 1 0, 1000 a 500, 500 0 1, 1 0, -1000" className="van-circle__hover" stroke="url(#van-circle-12)" style={{stroke:"url(&quot,#van-circle-12&quot;)", strokeWidth:"101px", strokeLinecap: "butt", strokeDasharray: "3140px, 3140px;"}}></path>
                              </svg>
                              <div className="van-circle__text">100%</div>
                            </div>
                             <div className="pl-3">
                              <h3 data-v-fe2fea6f=""><i className="fa fa-inr" ></i>{walletDetails?.balance || 0.00}</h3>
                              <p data-v-fe2fea6f="">Main wallet</p>
                            </div>
                            </div>
                            </div>
                            </div>
                            </div>

                        </div>
                        </div>

     <div className="white_box">
         <ul className="nav nav_btn mb-4 w-100" style={{display:"flex",justifyContent:"space-between"}}>
          <div className="button-class d-flex">
      <li><a data-toggle="tab" type="Credit" className={buttonClass == "Credit"?"active":""} href="#Deposithistory" onClick={()=>handleClick("Credit")}>Deposit history</a></li>
      <li><a data-toggle="tab" type="Debit"className={buttonClass == "Debit"?"active":""} href="#Withdrawalhistory" onClick={()=>handleClick("Debit")}>Withdrawalhistory</a></li>
      </div>
      <div className="button-class d-flex">
      <li > <button className="btn_man  ml-3 ml-md-5"  type="button" onClick={handleDepositeOpen}>+Add Balance</button></li>
      <li> <button className="btn_man  ml-3 ml-md-5"  type="button" onClick={handleWithdrawalOpen}>Withdrawal</button></li>
      </div>
   </ul>

  <div className="tab-content">
    <div id="Deposit" className="tab-pane  in active">
     <div className="table-responsive">
   <table className="table table-striped table-striped" id="as-react-datatable">
      <thead className="">
         <tr>
            <th className="sortable  text-left" >Transaction Id</th>
            <th className="sortable  text-left" >Amount</th>
            <th className="sortable  text-left" >Status</th>
            <th className="sortable  text-left" >Regard To</th>
            <th className="sortable  text-left" >Tx Type</th>
            <th className="sortable  text-left" >Date</th>
         </tr>
      </thead>
      <tbody>
         {transactionsList.length>0 && transactionsList.map((data:any,i:number)=>{return  <tr>
            <td className="upcase">{data._id}</td>
            <td className="upcase">{data.amount}</td>
            <td className="upcase">{data.status}</td>
            <td className="upcase">{data.transaction_mode}</td>
            <td className="upcase">{data.transaction_type}</td>
            <td className="upcase">{moment(data.created_at).format('MMMM Do YYYY, h:mm:ss a')}</td>
         </tr>})}
      </tbody>
   </table>
</div>
       </div>
    </div>
   </div>
   </div>
   </div>
                    {open && <WalletModal setOpen={setOpen} onClose={handleClose} />}
                     {withdrawalOpen && <WithdrawalModel setWOpen={setWithdrawalOpen} onClose={handleClose} 
                     balanceApi = {setAgain} getTransaction={handleClick}/>}
             
        <Footer/>

        </>
    )
}