import { Link, useNavigate } from "react-router-dom"
import Header  from "../../comman/Header"
import { Footer } from "../../comman/Footer"
import { useContext, useState } from "react"
import useRequest from "../../hooks/useRequest";
import { AuthContext } from "../../context/AuthContext";
import { apiPath } from "../../constant/ApiRoutes";
import { Severty, ShowToast } from "../../helper/toast";
import { userInput, userInputError } from "../../Interface/login";
import { LoginVal } from "../../validation/LoginVal";



export const Login = () => {
  const [userInput, setUserInput] = useState<userInput>({
    mobile_number:"",
    password:""
  })
  const [userInputError, setUserInputError] = useState<userInputError>({
    mobile_numberError:"",
    passwordError:""
  })
  const navigate = useNavigate()
  const { request } = useRequest()
  const { setIsLoggedIn, setUserProfile,login,logout } = useContext(AuthContext)

  const handleChange = async(e:any) => {
      let { name,value } = e.target;
      const validation = await LoginVal(name, value)
      setUserInputError(prevError=>({
        ...prevError,
        [name+"Error"]:validation
      }))
      setUserInput(prevVal=>({
        ...prevVal,
        [name]:value
      }))
  }

  const handleSubmit = () => {
    for (const key in userInput) {
      if (userInput.hasOwnProperty(key)) {
        const validation = userInput[key as keyof userInput];
        if (!validation) {
          console.log(`Validation failed for ${key}`);
          setUserInputError((prevError) => ({
            ...prevError,
            [key + "Error"]: "This field is required",
          }));
        }
      }
    }
    if(userInputError.mobile_numberError || userInputError.passwordError ||!userInput.mobile_number ||!userInput.password){
      return false
    }

    request({
      url: apiPath.login,
      method: "POST",
      data: userInput,
      onSuccess: (data) => {
        // setLoading(false);
        if (data.status) {
          setIsLoggedIn(true);
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("userProfile", JSON.stringify(data.data.user));
          ShowToast(data.message, Severty.SUCCESS);
          setUserProfile(data.data);
          navigate("/wallet");
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
        <div className="login_page ">

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
      <Link className="nav-link" data-toggle="tab" to="/register">Register</Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link active" data-toggle="tab" to="/login">Login</Link>
      </li>
   
  </ul>
       <div className="tab-content">
        <div id="Login" className=" tab-pane">

                  <h2 className="mb-0 text-center fw700">Welcome Again!!</h2>
                              <p className="text-center">Please enter your details</p>
                             <hr/>
                           <div className="form-group ">
                            <img className="input_icon" src="img/call.svg" />
                            <input   type="text" name="mobile_number" className="form-control" value={userInput.mobile_number} onChange={handleChange} placeholder="Phone number" />
                              <span style={{color:"red"}}>{userInputError.mobile_numberError}</span>
                           </div>
                           <div className="form-group ">
                              <img className="input_icon" src="img/key.svg" />
                            <input   type="text" name="password"  className="form-control" value={userInput.password} onChange={handleChange} placeholder="Please enterPassword" />
                              <span style={{color:"red"}}>{userInputError.passwordError}</span>
                           </div>
                            

                              

                            <div className="form-group text-center">
                            <button  type="submit" onClick={handleSubmit} className="btn_man w100">Log in</button>
                           </div>
                           </div>
                           </div></div></div></div></div></div></div>
                     {/* <Footer/> */}
        </>
    )
}