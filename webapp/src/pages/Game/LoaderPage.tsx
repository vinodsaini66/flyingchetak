import Loader from "../../component/Loader"

export const LoaderPage = () => {
    return (
        <>
        <div className="loading-page">
            <div >
                <img src="../../img/horse-running.gif" width={200} height={100}/>
            </div>
         <h3>
            Game Is Loading ...
         </h3>
         <Loader/>
        </div>
         
        </>
    )
}