import { useContext, useEffect, useState } from "react"
import { Footer } from "../../comman/Footer"
import Header from "../../comman/Header"
import { apiPath } from "../../constant/ApiRoutes"
import { Severty, ShowToast } from "../../helper/toast"
import useRequest from "../../hooks/useRequest"
import { AuthContext } from "../../context/AuthContext"
import { WalletContext } from "../../context/WalletContext"

export const Promotion = () => {
  const[list, setList] = useState<any[]>([])
  let { userProfile } = useContext(AuthContext)
  const { request } = useRequest()
  const { walletDetails } = useContext(WalletContext)
  useEffect(()=>{
    getPromotionData()
  },[])

const getPromotionData = () => {
  request({
    url: apiPath.promotionData,
    method: "GET",
    onSuccess: (data) => {
      // setLoading(false);
      if (data.status) {
        // ShowToast(data.message, Severty.SUCCESS);
        setList(data.data);
      } else {
        ShowToast(data.message, Severty.ERROR);
      }
    },
    onError: (error) => {
      ShowToast(error.response.data.message, Severty.ERROR);
    },
  });
}

        return (
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
                                    <h2 className="text-white mb-0 mt-4"><i className="fa fa-inr" ></i>{walletDetails?.balance}</h2>
                                    <p> Total Balance</p>
                                   </div>

                                   
                                    
                                   </div>
                                   </div>
                              
                                <div className="col-md-8 mb-4">
                                  <div className="row">
                                    <div className="col-md-6 mb-4">
                                      <div className="white_box d_box h100">
                                       <p > Number of register</p>
                                       <h2 className=""> {list?.length>0 && list[0]?.no_of_register}</h2>
                                      <i className="fa fa-money" ></i>
                                    </div>
                                  </div>
                                  <div className="col-md-6 mb-4">
                                      <div className="white_box d_box h100">
                                      <p >  Deposit number</p>
                                       <h2 className=""> {list?.length>0 && list[1]?.deposite_number}</h2>
                                      <i className="fa fa-inr" ></i>
                                    </div>
                                  </div>
                                  <div className="col-md-6 mb-4">
                                      <div className="white_box d_box h100">
                                       <p >  Deposit amount</p>
                                       <h2 className="">{list?.length>0 && list[2]?.deposite_amount}</h2>
                                      <i className="fa fa-inr" ></i>
                                    </div>
                                  </div>
                                  <div className="col-md-6 mb-4">
                                      <div className="white_box d_box h100">
                                      <p >  Number of people<br/>making first deposit</p>
                                       <h2 className="">{list?.length>0 && list[3]?.user_no_with_first_deposite}</h2>
                                      <i className="fa fa-university" ></i>
                                    </div>
                                  </div>
                                  </div>

                                    <div className="white_box">
                                    <h5 className=" mb-3">Invitation code</h5>
                                                                      
                                    
                                        <div className="form-group ">
                                          <div className="copy_input"><input id="user-update-mobile" type="text" className="form-control" disabled={true} value={userProfile?.referral_id} /><i className="fa fa-copy"></i></div>
                                        
                                    </div>
  
      
   </div>
</div>
                        </div>


    
             
                      </div>
                    </div>
                    {/* <Footer/> */}
                    </>
        )
}