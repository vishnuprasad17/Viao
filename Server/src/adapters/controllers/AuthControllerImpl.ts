import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { asyncHandler } from "../middlewares/async-handler";
import TYPES from "../../domain/constants/inversifyTypes";
import { AuthUseCase } from "../../domain/interfaces/AuthUseCase";
import { AuthController } from "../../domain/interfaces/AuthController";
import { BaseError } from "../../domain/errors/BaseError";


@injectable()
export class AuthControllerImpl implements AuthController {
    constructor(@inject(TYPES.AuthUseCase) private authUseCase: AuthUseCase) {}

    signup = asyncHandler("Signup")(async (req: Request, res: Response): Promise<void> => {
        const role = req.role;
        const { name, email, password, phone, city, vendor_type } = req.body;
        const result = await this.authUseCase.executeSignup({
            role,
            name,
            email,
            password,
            phone,
            city,
            vendor_type,
            session: req.session
          });
        
        res.status(200).json(result);
    })

    verifyOtp = asyncHandler("VerifyOtp")(async (req: Request, res: Response): Promise<void> => {
        const role = req.role;
        const otp: string = req.body.otp;
        const result = await this.authUseCase.verify({role, otp, session: req.session});
        
        res.status(201).json(result);
      })
          
    login = asyncHandler("Login")(async (req: Request, res: Response): Promise<void> => {
        const role = req.role;
        const { email, password } = req.body;
        const response = await this.authUseCase.login(role, email, password);

        res.status(200).json(response);
      })
    
      forgotPassword = asyncHandler("ForgotPassword")(async (req: Request, res: Response): Promise<void> => {
          const role = req.role;
          const email = req.body.email;
          const session = req.session;
          const result = await this.authUseCase.forgotPwdOtp(role, email, session);
          if (result) {
            res.status(200).json(result);
          } else {
            res.status(400).json({ error: `${role} not found !!` });
          }
      })
    
      verifyOtpForPassword = asyncHandler("VerifyOtpForPassword")(async (req: Request, res: Response): Promise<void> => {
          const receivedOtp: string = req.body.otp;
          const session = req.session;
          const result = await this.authUseCase.verifyOtp(receivedOtp, session)
    
          res.status(200).json(result);
      })
    
      resetPassword = asyncHandler("ResetPassword")(async (req: Request, res: Response): Promise<void> => {
          const role = req.role;
          const password = req.body.password;
          const confirmPassword = req.body.confirm_password;
          const status = await this.authUseCase.reset(role, password, confirmPassword, req.session)
          if (status) {
            res.status(200).json({ message: "Password reset successfully." });
          } else {
            res.status(400).json({ error: "Passwords do not match." });
          }
      })
      
      resendOtp = asyncHandler("ResendOtp")(async (req: Request, res: Response): Promise<void> => {
          const role = req.role;
          const Data = role === "user" ? req.session.user : req.session.vendor;
          const existingOtp = Data.otpCode;
          if (!Data || !existingOtp) {
            res.status(400).json({ error: "Session data not found. Please sign up again." });
            return;
          }
          const status = await this.authUseCase.resend(Data, existingOtp);
          if (status) {
            console.log('New OTP sent:', Data);
            res.status(200).json({ message: 'New OTP sent to email.' });
          } else {
            console.error('OTP is not expired. Please request a new one.');
            res.status(400).json({ error: 'OTP is not expired. Please request a new one.' });
          }
      })
    
      pwdResendOtp = asyncHandler("PwdResendOtp")(async (req: Request, res: Response): Promise<void> => {
          const otpData = req.session.otp;
          const existingOtp = otpData.otp;
          if (!otpData || !existingOtp) {
            res.status(400).json({ error: 'Session data not found. Please request OTP again.' });
            return;
          }
          const status = await this.authUseCase.resend(otpData, existingOtp);
      
          if (status) {
            console.log('New OTP sent:', req.session.otp);
            res.status(200).json({ message: 'New OTP sent to email.' });
        } else {
            console.error('OTP is not expired. Please request a new one.');
            res.status(400).json({ error: 'OTP is not expired. Please request a new one.' });
        }
      })  
    
      googleRegister = asyncHandler("GoogleRegister")(async (req: Request, res: Response): Promise<void> => {
          console.log("This is credential in body: ", req.body.credential);
          const token = req.body.credential;
          console.log(token);
          const user = await this.authUseCase.gRegister(token);
          if (user) {
            res.status(200).json({ message: "user saved successfully" });
          }
      })
    
      googleLogin = asyncHandler("GoogleLogin")(async (req: Request, res: Response): Promise<void> => {
          const authtoken = req.body.credential;
          const response = await this.authUseCase.gLogin(authtoken);
    
          res.status(200).json(response);
      })
    
      logout = asyncHandler("Logout")(async (req: Request, res: Response): Promise<void> => {
          const role = req.role;
          const refreshToken = req.headers['x-refresh-token'] as string;
          await this.authUseCase.delete(role, refreshToken);
          res.clearCookie(`refreshToken_${role}`);
          res.status(200).json({ message: `${role} logged out successfully..` });
      })
    
      createToken = asyncHandler("RefreshToken")(async (req: Request, res: Response): Promise<void> => {
          const role = req.role;
          const { refreshToken } = req.body;
          const data = await this.authUseCase.createToken(role, refreshToken);

          
          res.status(200).json(data);
      })
}