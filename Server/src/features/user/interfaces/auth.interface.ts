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
  token: string;
  userData: object; 
  message: string;
}
  