import axios from 'axios';
import apiPath from '../constants/apiPath';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const client = axios.create({
	baseURL: apiPath.baseURL,
});

const useRequest = () => {
	const { logout } = useContext(AuthContext);
	const request = async ({
		url,
		method: tmethod,
		data,
		onSuccess,
		onError,
		header,
		onErrorSubmit,
	}) => {
		const method = tmethod.trim().toUpperCase();
		let token = localStorage.getItem('token')
			? localStorage.getItem('token')
			: '';
		console.log('datadaatdaat', apiPath.baseURL);
		const headers = {
			...header,
			Authorization: `Bearer ${token}`,
		};

		try {
			const response = await client({
				url,
				method,
				data,
				headers: { ...headers },
			});

			if (onSuccess) {
				onSuccess(response.data);
			} else {
				onErrorSubmit(response.data);
			}
			return response.data;
		} catch (err) {
			console.log('object', err);
			if (err.response.status === 401) {
				logout();
			}
			if (err.response.data.message === 'jwt expired') {
				logout();
			}
			if (onError) {
				onError(err);
			}
			// throw err;
		}
	};

	return { request };
};

export default useRequest;
