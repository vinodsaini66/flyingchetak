import React, { createContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ShowToast, Severty } from '../helper/toast';
import useRequest from '../hooks/useRequest';
export const AppStateContext = createContext();

export const AppContextProvider = ({ children }) => {
	const { request } = useRequest();

	const [bannerList, setBannnerList] = useState([]);

	return (
		<AppStateContext.Provider
			value={{
				bannerList,
			}}
		>
			{children}
		</AppStateContext.Provider>
	);
};
