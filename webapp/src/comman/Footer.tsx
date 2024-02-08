import { Link } from "react-router-dom"
import { SettingContext } from "../context/SettingContext"
import { useContext } from "react"

export const Footer = () => {
  const { settingDetails } = useContext(SettingContext)
  console.log("settingDetails",settingDetails)
        return (
            <section className="contact  footer" id="contact" data-scroll-index="8">
 <div className="container">
   <div className="row">
     <div className="col-md-4">
       <img src="../../img/logo.png" alt="Logo" className="logo" />
       <p>Nestled in the heart of North Goa, Sort by stays offers an unparalleled experience that combines the best
         of coastal living with the excitement of a lively beach town.</p>
       <div className="social-links wow fadeInDown  animated" data-wow-delay="0.1s">
         <ul>
           <li><Link rel="nofollow" target="_blank" to={settingDetails?.facebook}><i
                 className="fa fa-facebook"></i></Link></li>
           <li><Link rel="nofollow" target="_blank" to={settingDetails?.instagram}><i className="fa fa-instagram"></i></Link>
           </li>
         </ul>
       </div>
     </div>
     <div className="col-md-3 ml-auto">
       <div className="nav_link">
         <h4>Quick Link</h4>
         <ul className="">

           <li className="">
             <Link className="" to="/" >Home</Link>
           </li>
           <li className="">
             <Link className="" to="/promotion">Promotion</Link>
           </li>
           <li className="">
             <Link className="" to="/wallet" >Wallet</Link>
           </li>
           <li className="">
             <Link className=" " to="/account" >Account</Link>
           </li>
          

         </ul>
       </div>
     </div>
     <div className="col-lg-4 col-md-6 footer-links footer_address">
       <h4>Contact Us</h4>
       <ul>
         <li><i className="fa fa-map"></i>{settingDetails?.address}</li>
         <li>
           <a href="tel:+919561325483"><i className="fa fa-phone"></i> +91 {settingDetails?.mobile_number}</a></li>
         <li> <a href="#">
             <i className="fa fa-envelope"></i>{settingDetails?.email}</a></li>
       </ul>
     </div>
 
   </div>
   <div className="copyright ">
     © Copyright 2024 game. All Rights Reserved,
   </div>
 </div>

</section>
        )
}