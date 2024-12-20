export interface ILoginResponse {
    refreshToken: string;
    token: string;
    vendorData?: object;  // Optional vendorData field for the vendor role
    adminData?: object;   // Optional adminData field for the admin role
    userData?: object;    // Optional userData field for the user role
    message: string;
  }

  export interface IUserSession {
    email: string;
    password: string;
    name: string;
    phone: number;
    otpCode: string | undefined;
    otpSetTimestamp: number;
    isExpired: boolean;
  }

  export interface IVendorSession {
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
  
  export interface IOTP {
    otp: string | undefined;
    email: string;
    otpSetTimestamp: number;
    isExpired: boolean;
  }