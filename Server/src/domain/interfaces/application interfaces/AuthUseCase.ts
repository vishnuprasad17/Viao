import { Response } from "express";
import { UserDTO } from "../../dtos/UserDTO";
import { VendorDTO } from "../../dtos/VendorDTO";
import { AdminDTO } from "../../dtos/AdminDTO";
import { Session, SessionData } from "express-session";

interface AuthUseCase {
  executeSignup(params: SignupParams): Promise<{ message: string; email: string }>;
  verify(params: VerifyParams): Promise<{user: UserDTO, accessToken: string, refreshToken: string} | {vendor: VendorDTO, accessToken: string, refreshToken: string}>;
  login (role: string, email: string, password: string): Promise<LoginResponse>;
  forgotPwdOtp(role: string, email: string, session: Session & Partial<SessionData>): Promise<{message: string, email: string}>;
  verifyOtp(receivedOtp: string, session: Session & Partial<SessionData>): Promise<{message: string}>;
  reset(role: string, password: string, confirmPassword: string, session: Session & Partial<SessionData>): Promise<boolean>;
  resend(sessionData: UserSession | VendorSession | OTP, otp: string): Promise<boolean>;
  gRegister(token: string): Promise<{user: UserDTO, accessToken: string, refreshToken: string}>;
  gLogin(token: string): Promise<LoginResponse>;
  createToken(role: string, refreshToken: string): Promise<{ accessToken: string, refreshToken: string }>;
  delete(role: string, refreshToken: string): Promise<number>
}

interface SignupParams {
  role: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  city?: string;
  vendor_type?: string;
  session: any;
}

interface VerifyParams {
  role: string;
  otp: string;
  session: any;
}

interface UserSession {
  email: string;
  password: string;
  name: string;
  phone: number;
  otpCode: string | undefined;
  otpSetTimestamp: number;
  isExpired: boolean;
}

interface VendorSession {
  email: string;
  password: string;
  name: string;
  phone: number;
  city: string;
  vendor_type: string;
  otpCode?: string | undefined;
  otpSetTimestamp: number;
  isExpired: boolean;
}

interface OTP {
  otp: string | undefined;
  email: string;
  otpSetTimestamp: number;
  isExpired: boolean;
}

interface LoginResponse {
  refreshToken: string;
  accessToken: string;
  vendorData?: VendorDTO;  // Optional vendorData field for the vendor role
  adminData?: AdminDTO;   // Optional adminData field for the admin role
  userData?: UserDTO;    // Optional userData field for the user role
  message: string;
}

interface DecodedData {
  _id: string;
  name: string;
  email: string;
  picture: string;
  jti: string;
}

export {
  AuthUseCase,
  SignupParams,
  VerifyParams,
  UserSession,
  VendorSession,
  OTP,
  LoginResponse,
  DecodedData
}
