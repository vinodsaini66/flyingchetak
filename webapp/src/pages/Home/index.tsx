import { useState } from "react"
import { Footer } from "../../comman/Footer"
import Header from "../../comman/Header"

export const Home = () => {
  const [show, setShow] = useState<string>("collapseOne1")
 
    return (
        <>
        <Header/>
<header className="home" id="home" data-scroll-index="1" >
  <div className="container">
 <div id="demo" className="carousel slide" data-ride="carousel" data-pause="false">
   <ul className="carousel-indicators">
     <li data-target="#demo" data-slide-to="0" className="active"></li>
     <li data-target="#demo" data-slide-to="1"></li>
   </ul>

   <div className="carousel-inner">
     <div className="carousel-item active">
       <img src="img/banner.jpg" alt="Sortby Stays" />
     </div>
     <div className="carousel-item">
       <img src="img/banner.jpg" alt="Sortby Stays" />
     </div>
    
   </div>

   <a className="carousel-control-prev" href="javascript:void(0)" data-slide="prev">
     <span className="carousel-control-prev-icon"></span>
   </a>
   <a className="carousel-control-next" href="javascript:void(0)" data-slide="next">
     <span className="carousel-control-next-icon"></span>
   </a>
 </div>
 </div>

</header>

<div id="scroll-to-top"><i className="fa fa-arrow-up fa-fw"></i></div>
<div className="about-section ps text-center" data-scroll-index="2" id="about">
 
 <div className="container">
   <div className="row ">
     <div className="text-column col-lg-12 col-md-12 col-sm-12 order-md-2">
       <div className="inner">
         <div className="sec-title fyo">
           <h1 className="hadding">Welcome to Game</h1>
         </div>
         <p className="text">Located near Anjuna Beach which is regarded as the "Heart of Goa". Here you will be getting the alluring experience with the perfect blend of luxury and comfort. Sort By Stays is a backpacker hostel in North Goa, known for its finest hospitality services. Indulge yourself in the party vibes of Goa and feel the real essence with this best hostel in Anjuna. Meet with other like-minded travellers and explore the party capital of India with much more enthusiasm. </p>
         <p className="text">We offer private rooms as well as dormitories in North Goa which are not only affordably priced but also equipped with advanced amenities. Refresh your body and inner soul with the soothing ambience and play different indoor games. Socialize with your friends and other travellers while enjoying the mouthwatering dishes at our in-house cafe cum bar. 
         </p>
       </div>
     </div>
    
   </div>
 </div>
</div>
<div className="ps text-center bg_light" data-scroll-index="2" id="how-to-play">
                     <div className="container">
                       
                          <div className="sec-title text-center">
     <h2 className=" hadding fyo mb-md-5">How to Play </h2>
   </div>
                         <div className="row">
                             <div className="col-md-4">
                             <div className="work_box ">
                                  <img src="img/signup.png" className="mb-2 mb-md-4" alt="signup" />
                                 <h4>Sign Up</h4>
                                  
                             </div>
                             </div>
                             <div className="col-md-4">
                             <div className="work_box">
                                  <img src="img/game.png" className=" mb-2 mb-md-4" alt="Rooms" />
                                 <h4>Start Game</h4>
                                 
                             </div>
                             </div>
                             <div className="col-md-4">
                             <div className="work_box">
                                 <img src="img/win.png" className=" mb-2 mb-md-4" alt="Rooms" />
                                 <h4>Win Prize</h4>
                                 
                             </div>
                             </div>
                         </div>
                     </div>
                 </div>
<section className="faq ps" data-scroll-index="7" id="faq">
 <div className="container ">
   <div className="sec-title  text-center">
     <h3 className=" hadding fyo">FAQs</h3>
   </div>
   <div className="row">
     <div className="col-lg-10 col-md-12 m-auto">
       <div className="accordion md-accordion style-2" id="accordionEx" role="tablist" aria-multiselectable="true">
         <div className="card">
           <div className="card-header" role="tab" id="headingOne1">
             <a data-toggle="collapse" data-parent="#accordionEx" onClick={()=>{setShow("collapseOne1")}} href="javascript:void(0)" aria-expanded="true"
               aria-controls="collapseOne1">
               What is SortByStays?
             </a>
           </div>
           <div id="collapseOne1" className={show == "collapseOne1"?"collapse show":"collapse"}  role="tabpanel" aria-labelledby="headingOne1"
             data-parent="#accordionEx">
             <div className="card-body">
               SortByStays is a hostel that offers a variety of accommodation options, including private rooms and
               dormitories, with the unique feature of sorting stays based on different durations.
             </div>
           </div>
         </div>

         <div className="card">
           <div className="card-header" role="tab" id="headingTwo2">
             <a className="collapsed" id="dp2" data-toggle="collapse" onClick={()=>{setShow("collapseTwo2")}} data-parent="#accordionEx" href="javascript:void(0)"
               aria-expanded="false" aria-controls="collapseTwo2">
               How do I book a stay at SortByStays?</a>
           </div>
           <div id="collapseTwo2" className={show == "collapseTwo2"?"collapse show":"collapse"} role="tabpanel" aria-labelledby="headingTwo2"
             data-parent="#accordionEx">
             <div className="card-body">Booking a stay at SortByStays is easy. we are available on Booking.com, Make my
               trip, Agoda or You can visit our website, choose your preferred accommodation type, select your
               desired stay duration, and complete the booking process online.
             </div>
           </div>
         </div>
         <div className="card">
           <div className="card-header" role="tab" id="headingTwo3">
             <a className="collapsed" data-toggle="collapse" onClick={()=>{setShow("collapseTwo3")}} data-parent="#accordionEx" href="javascript:void(0)"
               aria-expanded="false" aria-controls="collapseTwo3">

               What types of accommodation are available at SortByStays? </a>
           </div>
           <div id="collapseTwo3" className={show == "collapseTwo3"?"collapse show":"collapse"} role="tabpanel" aria-labelledby="headingTwo3"
             data-parent="#accordionEx">
             <div className="card-body"> SortByStays provides both private rooms and dormitory options. Private rooms are
               ideal for individuals or couples seeking more privacy, while dormitories are great for
               budget-conscious travelers and groups.
             </div>
           </div>
         </div>
         <div className="card">
           <div className="card-header" role="tab" id="headingTwo4">
             <a className="collapsed" data-toggle="collapse" onClick={()=>{setShow("collapseTwo4")}} data-parent="#accordionEx" href="javascript:void(0)"
               aria-expanded="false" aria-controls="collapseTwo4">
               Are there any discounts for longer stays?</a>
           </div>
           <div id="collapseTwo4" className={show == "collapseTwo4"?"collapse show":"collapse"} role="tabpanel" aria-labelledby="headingTwo2"
             data-parent="#accordionEx">
             <div className="card-body"> Yes, we offer special discounts for guests who choose to stay for an extended
               period. The longer you stay, the more you save! Contact our reservations team for more information.
             </div>
           </div>
         </div>

         <div className="card">
           <div className="card-header" role="tab" id="headingTwo5">
             <a className="collapsed" data-toggle="collapse" onClick={()=>{setShow("collapseTwo5")}} data-parent="#accordionEx" href="javascript:void(0)"
               aria-expanded="false" aria-controls="collapseTwo5">
               Is breakfast included with the stay?</a>
           </div>
           <div id="collapseTwo5" className={show == "collapseTwo5"?"collapse show":"collapse"} role="tabpanel" aria-labelledby="headingTwo5"
             data-parent="#accordionEx">
             <div className="card-body"> Breakfast is inclusive if you book for a package. We have rates with and without
               breakfast please check availability and any associated fees when making your reservation.

             </div>
           </div>
         </div>

         <div className="card">
           <div className="card-header" role="tab" id="headingTwo6">
             <a className="collapsed" data-toggle="collapse" onClick={()=>{setShow("collapseTwo6")}} data-parent="#accordionEx" href="javascript:void(0)"
               aria-expanded="false" aria-controls="collapseTwo6">
               What amenities are available at SortByStays?
             </a>
           </div>
           <div id="collapseTwo6" className={show == "collapseTwo6"?"collapse show":"collapse"} role="tabpanel" aria-labelledby="headingTwo6"
             data-parent="#accordionEx">
             <div className="card-body">SortBy Stays provides a range of amenities, including free Wi-Fi, communal
               kitchen facilities, laundry services, 24/7 reception, and more. Check our website or contact our staff
               for a comprehensive list of amenities.
             </div>
           </div>
         </div>

       </div>
     </div>

   </div>
 </div>
</section>

        <Footer/>
        </>
    )
}