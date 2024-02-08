import { Navigate, Route, RouterProvider, createBrowserRouter } from "react-router-dom"
import { Home } from "../pages/Home"
import { NotFound } from "../pages/NotFound"
import { Login } from "../pages/Login"
import { Register } from "../pages/Register"
import { Promotion } from "../pages/Promotion"
import { Wallet } from "../pages/Wallet"
import { Account } from "../pages/Account"
import { Game } from "../pages/Game"
import { Suspense, useContext } from "react"
import Loader from "../component/Loader"
import { Notification } from "../pages/Notification"
import { AuthContext, AuthProvider } from "../context/AuthContext"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import SettingProvider from "../context/SettingContext"
import WalletProvider from "../context/WalletContext"

const PrivateRoute = ({ element: Element }:any) => {
    const { isLoggedIn } = useContext(AuthContext);
    const token = localStorage.getItem("token")
  
    return isLoggedIn || token ? <Element /> : <Navigate to="/login" replace />;
  };

export const Routes = () => {
    const token = localStorage.getItem("token")
    const navigate = <Navigate to="/login"/>
    const router = createBrowserRouter([
        {
            path:"/",
            element:<Home/>
        },
        {
            path:"/login",
            element:<Login/>
        },
        {
            path:"/register",
            element:<Register/>
        },
        {
            path:"/register/referral/:rfCode",
            element:<Register/>
        },
        {
            path:"/promotion",
            element:<PrivateRoute element={Promotion} />
        },
        {
            path:"/wallet",
            element:<PrivateRoute element={Wallet} />
        },
        {
            path:"/account",
            element:<PrivateRoute element={Account}/>
        },
        {
            path:"/game",
            element:<PrivateRoute element={Game} />
        },
        {
            path:"/notification",
            element:<PrivateRoute element={Notification}/>
        },
        {
            path:"/*",
            element:<NotFound/>
        }
    ])

    return (
        <>
        <AuthProvider>
            <SettingProvider>
                <WalletProvider>
                    <Suspense fallback={<Loader />}>
                        <RouterProvider router={router} />
                    </Suspense>
                </WalletProvider>
            </SettingProvider>
        </AuthProvider>
         <ToastContainer/>
        </>
        
    )
}