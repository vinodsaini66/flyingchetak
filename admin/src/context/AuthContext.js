import React, { createContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { default as ConfirmLogout } from '../components/ConfirmLogoutModal';
import { Severty, ShowToast } from '../helper/toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [session, setSession] = useState({ token: null });

	const [userProfile, setUserProfile] = useState();

	useEffect(() => {
		let token = localStorage.getItem('token');
		if (!token) return;
		let user = localStorage.getItem('userProfile')
		if(user && user !=="undefined" ){
			user = JSON.parse(user)
		}
		if (user) {
			setUserProfile(user);
		}
		setIsLoggedIn(true);
		setSession({ token: token });
	}, []);

	useEffect(() => {
		if (!userProfile) return;
		// localStorage.setItem('userProfile',JSON.stringify(userProfile))
	}, [userProfile]);

	useEffect(() => {
		if (!isLoggedIn) return;
	}, [isLoggedIn]);

	const login = () => {
		setIsLoggedIn(true);
		return <Navigate to='/dashboard' />;
	};

	const { showConfirm } = ConfirmLogout();

	const logout = () => {
		showConfirm({ onLogout: handleLogout });
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('userProfile');
		setIsLoggedIn(false);
		setSession({ token: null });
		setUserProfile();
		ShowToast('Logout Successfully', Severty.SUCCESS);
	};

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn,
				setIsLoggedIn,
				session,
				setSession,
				userProfile,
				setUserProfile,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
