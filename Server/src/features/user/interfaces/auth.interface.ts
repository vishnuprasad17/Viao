export interface IUserSignupRequest {
  email: string;
  password: string;
  name: string;
  phone: number;
}
export interface IUserLoginRequest {
    email: string;
    password: string;
  }
export interface IUserLoginResponse {
  userData: object; 
  message: string;
  token: string;
  refreshToken: string;
}
  