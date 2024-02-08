import React, { Suspense, useContext } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './assets/styles/main.css';
import './assets/styles/responsive.css';

import { Loader, PrivateRoute, ScrollToTop } from './components';
import { AppContextProvider, AuthContext, AuthProvider } from './context';
import { Error, Home, Profile, SignIn, User, Setting, Game } from './pages';
import Withdrawal from './pages/Withdraw/Index';
import Transaction from './pages/Transaction';
import View from './pages/User/View';
import UserTransaction from './pages/User/Transaction';
import Channel from "./pages/Channel/index"

window.Buffer = window.Buffer || require('buffer').Buffer;
function App() {
	return (
		<AuthProvider>
			<AppContextProvider>
				<Suspense fallback={<Loader />}>
					<BrowserRouter>
						<ScrollToTop />
						<ToastContainer closeOnClick={false} />
						<AppRoutes />
					</BrowserRouter>
				</Suspense>
			</AppContextProvider>
		</AuthProvider>
	);
}

const AppRoutes = () => {
	const { isLoggedIn } = useContext(AuthContext);

	return (
		<Routes>
			<Route path='/login' element={<SignIn />} />

			<Route
				path='/'
				element={
					<PrivateRoute>
						<Layout />
					</PrivateRoute>
				}
			>
				{/* Auth Routes */}
				<Route exact path='/' element={<Home />} />
				<Route exact path='/dashboard' element={<Home />} />
				<Route exact path='/profile' element={<Profile />} />

				{/* user manager */}
				<Route exact path='/users' element={<User />} />
				<Route exact path='/user/view/:id' element={<View />} />
				<Route exact path='/user/view/transactions/:id' element={<UserTransaction />} />


				{/* admin settings */}
				<Route exact path='/settings' element={<Setting />} />
				<Route exact path='/withdrawal' element={<Withdrawal />} />
				<Route exact path='/transactions' element={<Transaction />} />
				<Route exact path='/channel' element={<Channel />} />




				{/* <Route exact path="/test" element={<TestImage/>}/> */}

				{/* EmailTemplate Routes
        <Route exact path='/email-template' element={<EmailTemplate />} />
        <Route
          exact
          path='/email-template/update/:id?'
          element={<EmailTemplateEdit />}
        />
        <Route
          exact
          path='/email-template/view/:id'
          element={<EmailTemplateView />}
        /> */}

				{/* EmailTemplate Routes */}
				<Route exact path='/game' element={<Game />} />
			</Route>

			<Route path='*' element={<Error />} />
		</Routes>
	);
};

const Layout = () => {
	return (
		<>
			<Outlet />
		</>
	);
};

export default App;
