export interface UserSession {
  otpSetTimestamp: number | undefined;
  email: string;
  password: string;
  name: string;
  phone: number;
  otpCode: string | undefined;
}

export interface OTP {
  otp: string | undefined;
  email: string;
  otpSetTimestamp: number | undefined;
}