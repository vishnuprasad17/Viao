import axios from 'axios';
import { getToken, getRefreshToken, refreshAuthToken } from './authToken';

// Function to create an Axios instance with interceptors
export const createAxiosInstance = (role: string) => {
  const baseUrl = `${import.meta.env.VITE_BASE_URL}/${role}`;

  const instance = axios.create({
    baseURL: baseUrl,
  });

  // Request interceptor to add the Authorization header
  instance.interceptors.request.use(
    (config) => {
      const token = getToken(role);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle token refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && error.response?.data?.message === 'Invalid token') {
        try {
          const refreshToken = getRefreshToken(role);
          if (refreshToken) {
            const newToken = await refreshAuthToken(instance, refreshToken, role);
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return axios(error.config);
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};