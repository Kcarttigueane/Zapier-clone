import axios from 'axios';

export const BASE_URL = 'http://0.0.0.0:8080/api/v2';

export const apiV2 = axios.create({
  baseURL: 'http://0.0.0.0:8080/api/v2',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getApiHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});
