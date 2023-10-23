import axios from 'axios';

export const api = axios.create({
	baseURL: 'http://127.0.0.1:8080/api/v2',
	timeout: 10000, // 10 seconds
	headers: {
		'Content-Type': 'application/json',
	},
});

export const getApiHeaders = (accessToken: string) => ({
	Authorization: `Bearer ${accessToken}`,
});
