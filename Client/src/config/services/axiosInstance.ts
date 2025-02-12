import axios from 'axios';
import { clearTokens, getRefreshToken, getToken, setTokens } from './authToken';
import config from '../envConfig';

type AuthRole = 'admin' | 'user' | 'vendor';
type AppEndpoint = AuthRole | 'conversation' | 'message';

// Global flag to prevent multiple refresh attempts
let isRefreshing = false;

export const createAxiosInstance = (endpoint: AppEndpoint, authRole?: AuthRole) => {
  const baseUrl = `${config.BASE_URL}/${endpoint}`;
  const instance = axios.create({ baseURL: baseUrl });

  // Request interceptor
  instance.interceptors.request.use(config => {
    const role = authRole || (endpoint as AuthRole);
    if (['admin', 'user', 'vendor'].includes(role)) {
      const token = getToken(role as AuthRole);
      if (token) {
        config.headers.Authorization = `Bearer ${token.trim()}`;
      }
    }
    return config;
  });

  // Response interceptor
  instance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      const role = authRole || (endpoint as AuthRole);
      
      if (error.response?.status === 401 && error.response?.message === 'Invalid token' && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            const interval = setInterval(() => {
              if (!isRefreshing) {
                clearInterval(interval);
                resolve(instance(originalRequest));
              }
            }, 100);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = getRefreshToken(role as AuthRole);
          if (!refreshToken) throw new Error('No refresh token');
          
          const { data } = await axios.post(`${config.BASE_URL}/${role}/refresh`, 
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          setTokens(role as AuthRole, data.accessToken, data.refreshToken);
          
          // Update all waiting requests with new token
          instance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          
          return instance(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Clear tokens and redirect to login
          localStorage.removeItem(`persist:${role}`);
          clearTokens(role);
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};