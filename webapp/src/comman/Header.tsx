import { memo, useContext, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const Header = () => {
  const [icon, setIcon] = useState<boolean>(false)
  const {isLoggedIn, userProfile,logout} = useContext(AuthContext)
  let location = useLocation()
  let url = location?.pathname
    return (
        <nav className="navbar navbar-expand-lg in_nav">
        <div className="container">
          <Link className="navbar-brand mr-md-5" to="/">
            <img src="../../img/logo.png" alt="header-Logo" className="logo" /></Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" onClick={()=>setIcon(!icon)} data-target="#navbarText">
            <span className="icon-bar"><i className="fa fa-bars fa-2x"></i></span>
          </button>
          <div className={icon ? "collapse navbar-collapse show":"collapse navbar-collapse"} id="navbarText">
            <ul className="navbar-nav ml-auto line">
       
              <li className="nav-item">
                <Link className={url == "/"?"nav-link active":"nav-link"} to="/" >Home</Link>
              </li>
              <li className="nav-item">
                <Link className={url == "/promotion"?"nav-link active":"nav-link"} to="/promotion" >Promotion</Link>
              </li>
              <li className="nav-item">
                <Link className={url == "/wallet"?"nav-link active":"nav-link"} to="/wallet" >Wallet</Link>
              </li>
              <li className="nav-item">
                <Link className={url == "/account"?"nav-link active":"nav-link"} to="/account" >Account </Link>
              </li>
               <li className="nav-item">
                <Link className={url == "/game"?"nav-link active":"nav-link"} target="_blank" to="/game" >Game Play </Link>
              </li>
            </ul>
       
          </div>
          
            <div className="top_button d-flex">
         {isLoggedIn?<><div className="btn_man  ml-3 ml-md-5">{userProfile?.name?userProfile?.name:userProfile?.mobile_number} </div>
         <div className="btn_man  ml-3" onClick={logout}>Logout</div></>: <><Link className="btn_man  ml-3 ml-md-5" to="/login"> Login</Link>
          <Link className="btn_man  ml-3" to="/register"> Register</Link></> }      
        </div>
        </div>
       
       </nav>
    )
}

export default memo(Header)