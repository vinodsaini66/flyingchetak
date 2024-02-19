import { useEffect, useState } from "react"
import { Footer } from "../../comman/Footer"
import Header  from "../../comman/Header"
import { apiPath } from "../../constant/ApiRoutes"
import { Severty, ShowToast } from "../../helper/toast"
import useRequest from "../../hooks/useRequest"

export const Notification = () => {
  const [history, setHistory] = useState<any>([])
  const { request } = useRequest()

  useEffect(()=>{
        getHistory()
  },[])

  const getHistory = () => {
    request({
      url: apiPath.history,
      method: "GET",
      onSuccess: (data) => {
        // setLoading(false);
        if (data.status) {
          setHistory(data.data.history)
          // ShowToast(data.message, Severty.SUCCESS);
        } else {
          ShowToast(data.message, Severty.ERROR);
        }
      },
      onError: (error) => {
        ShowToast(error.response.data.message, Severty.ERROR);
      },
    });
  }
    return (<>
    <Header/>
    <div className="in_padding">
        <div className="container">
        <div className="sec-title text-center">
          <h2 className=" hadding fyo mb-md-5">Notification </h2>
        </div>  
         {history.length>0 && history.map((val:any,i:number)=>{
              return <>
        <div className="white_box mb-4 promotion_relitive">
          <i className="fa fa-trash-o delite_btn" ></i>
          <h5 className="massage_title">{val.type} NOTIFICATION </h5>
        <div  className="sysMessage__container-msgWrapper__item-time">Status:   {val.status}</div>
        <p className="m-0">{val.message}</p>

      </div>
              </>
         })}
           
                     </div>
                     </div>
            {/* <Footer/> */}
            </>)

}