import { Link } from "react-router-dom"
import { Footer } from "../../comman/Footer"
import Header from "../../comman/Header"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { ProfileUserInput, ProfileUserInputError } from "../../Interface/Profile"
import { ProfileVal } from "../../validation/ProfileVal"
import useRequest from "../../hooks/useRequest"
import { apiPath, baseURL } from "../../constant/ApiRoutes"
import { Severty, ShowToast } from "../../helper/toast"
import BankModel from "../../component/BankModel"
import { WalletContext } from "../../context/WalletContext"
import { AvatarGenerate } from "../../component/Avtar"

export const Account = () => {
   const[userInput, setUserInput] = useState<ProfileUserInput>({
      name:"",
      email:"",
      mobile_number:"",
      gender:"",
      dob:"",
    })
    const[userInputError, setUserInputError] = useState<ProfileUserInputError>({
      nameError:"",
      emailError:"",
      mobile_numberError:"",
      genderError:"",
      dobError:"",
    })
    const [open, setOpen] = useState<boolean>(false)
    const [imageVisibility, setImageVisibility] = useState<string>("")
    const { isLoggedIn, userProfile,logout ,getProfile } = useContext(AuthContext)
    const { walletDetails } = useContext(WalletContext)
    console.log("object",isLoggedIn,userProfile);
    const { request } = useRequest()
   useEffect(()=>{
         if(userProfile){
            setUserInput({
               name: userProfile.name || "",
               email: userProfile.email || "",
               mobile_number: userProfile.mobile_number || "",
               gender: userProfile.gender || "",
               dob: userProfile.dob || "",
             });
         }
   },[isLoggedIn])
   const handleClose = (set:any) => {
    set(false);
};
    const handleOpen = () => {
      setOpen(true)
    }

      const handleChange = async(e:any) => {
         let {name,value} = e.target
         const validation = await ProfileVal(name, value)
         setUserInputError(prevError=>({
           ...prevError,
           [name+"Error"]:validation
         }))
         setUserInput(prevState=>({
           ...prevState,
           [name]:value
         }
         ))
       }

       const handleSubmit = () => {
         if(userInputError.dobError || userInputError.emailError || userInputError.genderError ||userInputError.mobile_numberError || userInputError.nameError) return false
      const payload = userInput
      request({
        url: apiPath.updateProfile,
        method: "POST",
        data: payload,
        onSuccess: (data) => {
          if (data.status) {
            ShowToast(data.message, Severty.SUCCESS);
          } else {
            ShowToast(data.message, Severty.ERROR);
          }
        },
        onError: (error) => {
          ShowToast(error.response.data.message, Severty.ERROR);
        },
      });

       }

       const handleWhatsAppChange = (url:string,message:string) => {
         const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`;
         let whatsapp = window.open(whatsappUrl, '_blank');
         whatsapp?.focus()
       }

    return (
        <>
        <Header />
        <div className="in_padding">
                        <div className="container">
                            <div className="row ">
                                <div className="col-md-4 ">
                                  <div className="white_box ">
                                  <div className="d-flex align-items-center pb-3">
                                    <div className="uploader">
                                      {/* <label htmlFor="file-upload" id="file-drag"></label> */}
                                    <div id="start">
                                      <span className="fasi"><AvatarGenerate name={userProfile?.name}/></span>
                                    </div>
                                    </div>
                                    <div className="pl-3">
                                     <h4 className="text-white">{userInput?.name}</h4>
                                    <h5 className="text-white">UID | 2535225 </h5>
                                    </div>                            
                                  </div>
                                    <hr/>
                                     <div className="text-center">
                                   <h2 className="text-white mb-0 mt-4"><i className="fa fa-inr" ></i>{walletDetails?.balance || 0}</h2>
                                    <p> Total Balance</p>
                                   </div>

                                    <hr/>
                                    <Link className="d-flex  align-items-center" to="/notification"><i className="fa fa-bell mr-2" ></i> Notification <i className="fa fa-angle-right ml-auto" ></i>
                        </Link>
                                   </div>
                                   </div>
                              
                                <div className="col-md-8 mt-md-0 mt-4">
                               <div className="white_box mb-4">
                                <div style={{display:"flex", justifyContent:"space-between"}}>
                               <h5 className=" mb-3">Personal Data</h5>
                               {(!userProfile?.bank_info || Object.keys(userProfile?.bank_info).length === 0) && <button className="btn btn_man" type="button" onClick={handleOpen}  >+Add Bank</button>}
                               </div>
                               <form id="update-user">
                                  <div className="">
                                     <div className="row">
                                        <div className="form-group col-md-6"><label>Name</label><input id="user-update-name" name="name" type="text" className="form-control" value={userInput.name} onChange={handleChange}/><span className="text-danger" >{userInputError.nameError}</span></div>
                                        <div className="form-group col-md-6"><label>Email</label><input id="user-update-email" name="email" type="text" className="form-control" value={userInput.email} onChange={handleChange} /><span className="text-danger" >{userInputError.emailError}</span></div>
                                     </div>
                                     <div className="row">
                                        <div className="form-group col-md-6"><label>Date of Birth</label><input id="user-update-dob" name="dob" type="date" max-length="8" className="form-control" value={userInput.dob} onChange={handleChange} /><span className="text-danger">{userInputError.dobError}</span></div>
                                        <div className="form-group col-md-6">
                                           <label>Gender</label>
                                           <select className="form-control" style={{background:"#29254a",height:"auto"}} name="gender" value={userInput.gender} onChange={handleChange} id="user-update-gender">
                                              <option value="">Select</option>
                                              <option value="Male">Male</option>
                                              <option value="Female">Female</option>
                                              <option value="Eunuch">Eunuch</option>
                                           </select>
                                           <span className="text-danger">{userInputError.genderError}</span>
                                        </div>
                                     </div>
                                     <div className="row">
                                        <div className="form-group col-md-6"><label>Mobile Number</label><input id="user-update-mobile_number" name="mobile_number" type="number" className="form-control" value={userInput.mobile_number} onChange={handleChange} /><span className="text-danger" >{userInputError.mobile_numberError}</span></div>
                                     </div>
                                     <button className="btn btn_man" type="button" onClick={handleSubmit}
                                     disabled={!userInput.name || !userInput.dob || !userInput.email || !userInput.gender || !userInput.mobile_number?true:false}
                                     >Save</button>
                                  </div>
                               </form>
                            </div>
                            
                               <div className="white_box mb-4">
                               <h5 className=" mb-3">Bank Detail</h5>
                            <form id="update-user">
                                  <div className="">
                                     <div className="row">
                                        <div className="form-group col-md-6"><label>Account Holder Name :- {userProfile?.bank_info?.account_holder} </label></div>
                                        </div>
                                        <div className="row">
                                        <div className="form-group col-md-6"><label>IFSC Code :- {userProfile?.bank_info?.ifsc_code} </label></div>
                                     </div>
                                     <div className="row">
                                        <div className="form-group col-md-6"><label>Account Number :-  {userProfile?.bank_info?.account_number}</label></div>
                                     </div>
                                  </div>
                               </form>
                               </div>

                            <div className="white_box">
   <label>Referral Code</label>
   
      <div className="form-group ">
         <div className="copy_input"><input id="user-update-mobile" type="text" className="form-control"  value={userProfile?.referral_id} /><i className="fa fa-copy" onClick={()=>navigator.clipboard.writeText(userProfile?.referral_id)}></i></div>
       
   </div>
   <label>Referral Link</label>
   
      <div className="form-group " onClick={()=>handleWhatsAppChange(`${baseURL}referral/${userProfile?.referral_id}`,`Hey!

Love DamanClub! 📱💙 Join me & let's both get rewards. 🎁 Use my code ${userProfile?.referral_id} at ${baseURL}referral/${userProfile?.referral_id}. Can't wait to see you onboard!`)}>
         <div className="copy_input"><input id="user-update-mobile" type="text" className="form-control" disabled={true} value={`${baseURL}referral/${userProfile?.referral_id}`} /><i className="fa fa-copy" onClick={()=>navigator.clipboard.writeText(`${baseURL}referral/${userProfile?.referral_id}`)}></i></div>
      
   </div>
</div>
                        </div>
                    </div>
                     </div>
                     </div>
                     <BankModel  isOpen={open} setOpen={setOpen} onClose={handleClose} getProfile={getProfile}/>
        {/* <Footer/> */}
        </>
    )
}