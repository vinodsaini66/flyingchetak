import React, { useContext, useEffect, useState } from "react";

 
const QrCodeModels = ({qrData,setQrCodeModelsOpen}:any) => {

    const handleQrOpen = (e:any) => {
        console.log("eeeeeeeeeeee",e)
        let newWin = window.open(e,"_blank")
            newWin?.focus()
    }

 
    return (
        <div
            // onClick={onClose}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    backgroundColor: "#16142a",
                    height: "60%",
                    width: "60%",
                    margin: "auto",
                    padding: "2%",
                    border: "2px solid #000",
                    borderRadius: "10px",
                    boxShadow: "2px solid black",
                    opacity:1
                }}
            >
                    <div className="container">
                        <h3 className="mb-0">Qr Codes</h3>
                            <div className="row ">
                                <div className="col-md-4 m-auto"> 
                                    <label>Gpay</label>
                                    <button className="btn_man w100" onClick={()=>handleQrOpen(qrData?.gpay_link)} >Gpay</button>
                                </div>
                                <div className="col-md-4 m-auto">
                                    <label>Paytm</label>
                                    <button className="btn_man w100" onClick={()=>handleQrOpen(qrData?.paytm_link)} >Paytm</button>
                                </div>
                            </div>
                            <div className="row ">
                                <div className="col-md-4 m-auto">
                                    <label>Phonepay</label>
                                    <button className="btn_man w100" onClick={()=>handleQrOpen(qrData?.phonepe_link)} >Bhim</button>
                                </div>
                                <div className="col-md-4 m-auto">
                                    <label>Bhim</label>
                                    <button className="btn_man w100" onClick={()=>handleQrOpen(qrData?.bhim_link)} >Bhim</button>
                                </div>
                    </div>
                    <div className="row">
                    <div className="col-md-2 m-auto">
                                    <button className="btn_man w100" onClick={()=>setQrCodeModelsOpen(false)} >Cancel</button>
                                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
 
export default QrCodeModels;