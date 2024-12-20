import { setToken } from "./authToken";
import { createAxiosInstance } from "./axiosInstance";


// Function to handle login for any role (user, admin, vendor)
export const login = async (role: string, credentials: any) => {
  const authApi = createAxiosInstance(role);
  try {
    const response = await authApi.post('/login', credentials);
    setToken(response.data.token, response.data.refreshToken, role);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const gLogin = async (purpose: string, role: string, response: any) => {
    const endpoint = purpose === "login" ? '/google/login' : '/google/register';
    const authApi = createAxiosInstance(role);
    try {
        const res = await authApi.post(endpoint, response);
        return res.data;
    } catch (error) {
        throw error;
    }
}

// Function to handle signup for any role (user, vendor)

export const signup = async (role: string, formValues: any, config: any) => {
    const authApi = createAxiosInstance(role);
    try {
      const response = await authApi.post('/signup', formValues, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

// Verify

export const verifyEmail = async (role: string, credentials: any, config: any) => {
    const authApi = createAxiosInstance(role);
    try {
      const response = await authApi.post('/verify', credentials, config);
      return response.data;
    } catch (error) {
      throw error;
    }
}

// Resend OTP

export const otpResend = async (role: string, config: any) => {
  const authApi = createAxiosInstance(role);
  try {
    const response = await authApi.get('/resendOtp', config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Reset Password

export const resetPwd = async (role: string, credentials: any, config: any) => {
  const authApi = createAxiosInstance(role);
  try {
    const response = await authApi.post('/reset-password', credentials, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Forgot Password

export const forgotPwdOtp = async (role: string, credentials: any, config: any) => {
  const authApi = createAxiosInstance(role);
  try {
    const response = await authApi.post('/getotp', credentials, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const verifyForgotPwdOtp = async (role: string, credentials: any, config: any) => {
  const authApi = createAxiosInstance(role);
  try {
    const response = await authApi.post('/verify-otp', credentials, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const pwdOtpResend = async (role: string, config: any) => {
  const authApi = createAxiosInstance(role);
  try {
    console.log("start")
    const response = await authApi.get('/pwd-resendOtp', config);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Logout

export const logoutFn = async (role: string) => {
  const authApi = createAxiosInstance(role);
  try {
    const response = await authApi.get('/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
}