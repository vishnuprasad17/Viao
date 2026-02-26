import { SessionData } from "express-session";
import { CustomJwtPayload } from "./jwt";

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
  otpCode: string | undefined;
  email: string;
  otpSetTimestamp: number;
  isExpired: boolean;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: CustomJwtPayload;
    role: string;
  }
}

declare module "express-session" {
  interface SessionData {
    user?: UserSession;
    vendor?: VendorSession;
    otpData?: OTP;
  }
}

export {};