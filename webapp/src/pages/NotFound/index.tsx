import { Footer } from "../../comman/Footer"
import Header  from "../../comman/Header"

export const NotFound = () => {
    return (
        <>
        <Header/>
        <div className="not-found">
        <img src="../../img/not-found.jpg" width={1000} height={500}/>
        </div>
        {/* <Footer/> */}
        </>
    )
}