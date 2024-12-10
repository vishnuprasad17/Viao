export interface IVendorSession {
    email: string;
    password: string;
    name: string;
    phone: number;
    city: string;
    vendor_type: string;
    otpCode?: string | undefined;
    otpSetTimestamp?: number | undefined;
  }
  
export interface IOTP {
    otp: string | undefined;
    email: string;
    otpSetTimestamp: number | undefined;
  }