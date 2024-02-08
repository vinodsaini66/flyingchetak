import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import Header from "../../comman/Header"
import { Footer } from "../../comman/Footer"
import { useContext, useState } from "react"
import { RegisterVal } from "../../validation/RegisterVal";
import { Severty, ShowToast } from "../../helper/toast";
import { apiPath } from "../../constant/ApiRoutes";
import useRequest from "../../hooks/useRequest";
import { UserInput, UserInputError } from "../../Interface/Register";
import { AuthContext } from "../../context/AuthContext";

export const Register = () => {
  const params = useParams()
  let RFcode = params.rfCode
  const[userInput, setUserInput] = useState<UserInput>({
    name:"",
    email:"",
    mobile_number:"",
    password:"",
    Cpassword:"",
    referral_from_id:RFcode?RFcode:"",
    country_code:"91",
    type:"Customer" 
  })
  const[userInputError, setUserInputError] = useState<UserInputError>({
    nameError:"",
    emailError:"",
    mobile_numberError:"",
    passwordError:"",
    CpasswordError:"",
    referral_from_idError:""
  })
  const { setIsLoggedIn, setUserProfile,login,logout } = useContext(AuthContext)
  const navigate = useNavigate();
  const { request } = useRequest()

  const handleChange = async(e:any) => {
    let {name,value} = e.target
    const validation = await RegisterVal(name, value)
    console.log("validation",validation);
    name != "referral_from_id" && setUserInputError(prevError=>({
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
    if(!userInput.password && !userInput.Cpassword && !userInput.mobile_number){
          return false
    }
    if(userInput.password !== userInput.Cpassword) {
      setUserInputError((prevState) => ({
        ...prevState,
        CpasswordError: "Password And Confirm Password Must Match",
      }));
      return false
    }
    const payload = userInput
    request({
      url: apiPath.signup,
      method: "POST",
      data: payload,
      onSuccess: (data) => {
        if (data.status) {
          ShowToast(data.message, Severty.SUCCESS);
          localStorage.setItem("token",data.data.token)
          setIsLoggedIn(true)
          navigate("/wallet");
        } else {
          ShowToast(data.message, Severty.ERROR);
        }
      },
      onError: (error) => {
        ShowToast(error.response.data.message, Severty.ERROR);
      },
    });
  };

    return (
        <>
        <Header/>


        <div className="login_page">

<img src="img/777win.png" alt="Logo" className="i_img1" />
<img src="img/cardsandtokens.png" alt="Logo" className="i_img2" />
<img src="img/ezgif1.png" alt="Logo" className="i_img3" />

<div className="login_page2 pt-5">
<div className="in_padding mt-md-5">
                     <div className="container">
                         <div className="row ">
                             <div className="col-md-4">
 <ul className="nav navtabs2">
 <li className="nav-item">
   <Link className="nav-link active" data-toggle="tab" to="/register">Register</Link>
 </li>
 <li className="nav-item">
   <Link className="nav-link" data-toggle="tab" to="/login">Login</Link>
   </li>

</ul>
    <div className="tab-content">
 <div id="Register" className="tab-pane active">
                            <h2 className="mb-0 text-center fw700">Welcome!</h2>
                            <p className="text-center">Please enter your details</p>
                           <hr/>
                           <div className="form-group ">
                          <img className="input_icon" src="img/name1.png" />
                          <input type="text" name="name"  className="form-control" value={userInput.name} placeholder="Enter name" onChange={handleChange} />
                              <span style={{color:"red"}}>{userInputError.nameError}</span>
                         </div>
                         <div className="form-group ">
                          <img className="input_icon" src="img/email.png" />
                          <input type="text" name="email" className="form-control" value={userInput.email} placeholder="Enter email" onChange={handleChange} />
                          <span style={{color:"red"}}>{userInputError.emailError}</span>
                         </div>
                         <div className="form-group ">
                          <img className="input_icon" src="img/call.svg" />
                          <input type="text" name="mobile_number" className="form-control" value={userInput.mobile_number} placeholder="Phone number" onChange={handleChange} />
                          <span style={{color:"red"}}>{userInputError.mobile_numberError}</span>
                         </div>
                         <div className="form-group ">
                            <img className="input_icon" src="img/key.svg" />
                            <input type="text" name="password" className="form-control" value={userInput.password} placeholder="Please enterPassword" onChange={handleChange} />
                            <span style={{color:"red"}}>{userInputError.passwordError}</span>
                         </div>
                          <div className="form-group ">
                           <img className="input_icon" src="img/key.svg" />
                           <input type="text" name="Cpassword" className="form-control" value={userInput.Cpassword} placeholder="Please enterConfirm password" onChange={handleChange} />
                            <span style={{color:"red"}}>{userInputError.CpasswordError}</span>
                         </div>
                          <div className="form-group ">
                            <img className="input_icon" src="img/star_rate.svg" />
                            <input type="text" name="referral_from_id" className="form-control" value={userInput.referral_from_id} placeholder="Please enter the invitation code" disabled={RFcode?true:false} onChange={handleChange} />
                         </div>

                            

                          <div className="form-group text-center">
                           <button  type="submit" className="btn btn2 ">Register</button>
                         </div>
                        
                         </div>
                         </div>
                         </div>
                         </div>
                         </div>
                         </div>
                         </div>
                         </div>
                     <Footer/>
        </>
    )
}