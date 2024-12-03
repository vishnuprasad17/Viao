export interface IAdminLoginRequest {
    email: string;
    password: string;
  }

export interface IAdminLoginResponse {
    token: string;
    adminData: object; 
    message: string;
  }