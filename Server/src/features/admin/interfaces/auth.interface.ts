export interface IAdminLoginRequest {
    email: string;
    password: string;
  }

export interface IAdminLoginResponse {
    refreshToken: string;
    token: string;
    adminData: object; 
    message: string;
  }