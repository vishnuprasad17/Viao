import { getRefreshToken, clearTokens, setTokens } from "./authToken";
import { createAxiosInstance } from "./axiosInstance";

type AuthRole = 'admin' | 'user' | 'vendor';
type AppEndpoint = AuthRole | 'conversation' | 'message';

// Function to handle login for any role (user, admin, vendor)
export const login = async (role: string, values: object) => {
  const authApi = createAxiosInstance(role as AppEndpoint);
  try {
    const response = await authApi.post('/login', values);
    setTokens(role as AuthRole, response.data.accessToken, response.data.refreshToken);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const gLogin = async (purpose: string, response: object) => {
    const endpoint = purpose === "login" ? '/google/login' : '/google/register';
    const authApi = createAxiosInstance("user");
    try {
        const res = await authApi.post(endpoint, response);
        setTokens("user", res.data.accessToken, res.data.refreshToken);
        return res.data;
    } catch (error) {
        throw error;
    }
}

// Function to handle signup for any role (user, vendor)

export const signup = async (role: string, formValues: object, config: object) => {
    const authApi = createAxiosInstance(role as AppEndpoint);
    try {
      const response = await authApi.post('/signup', formValues, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

// Verify

export const verifyEmail = async (role: string, formValues: { otp: string }, config: { withCredentials: boolean }) => {
    const authApi = createAxiosInstance(role as AppEndpoint);
    try {
      const response = await authApi.post('/verify', formValues, config);
      return response.data;
    } catch (error) {
      throw error;
    }
}

// Resend OTP

export const otpResend = async (role: string, config: object) => {
  const authApi = createAxiosInstance(role as AppEndpoint);
  try {
    const response = await authApi.get('/resendOtp', config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Reset Password

export const resetPwd = async (role: string, credentials: object, config: object) => {
  const authApi = createAxiosInstance(role as AppEndpoint);
  try {
    const response = await authApi.post('/reset-password', credentials, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Forgot Password

export const forgotPwdOtp = async (role: string, credentials: object, config: object) => {
  const authApi = createAxiosInstance(role as AppEndpoint);
  try {
    const response = await authApi.post('/getotp', credentials, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const verifyForgotPwdOtp = async (role: string, credentials: object, config: object) => {
  const authApi = createAxiosInstance(role as AppEndpoint);
  try {
    const response = await authApi.post('/verify-otp', credentials, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const pwdOtpResend = async (role: string, config: object) => {
  const authApi = createAxiosInstance(role as AppEndpoint);
  try {
    console.log("start")
    const response = await authApi.get('/pwd-resendOtp', config);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
}

//Vendor Types
export const getTypes = async () => {
  const authApi = createAxiosInstance("vendor");
  try {
    const response = await authApi.get('/vendor-types');
    return response;
  } catch (error) {
    throw error;
  }
}

// Logout

export const logoutFn = async (role: string) => {
  const authApi = createAxiosInstance(role as AppEndpoint);
  try {
    const refreshToken = getRefreshToken(role as AuthRole);
    const response = await authApi.post('/logout', null , {
      headers: { 'x-refresh-token': refreshToken }
    });
    clearTokens(role as AuthRole);
    return response.data;
  } catch (error) {
    throw error;
  }
}