import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import authService from "../services/auth.service";
import { BaseError } from "../shared/error/base.error";
import generateOtp from "../shared/utils/generate.otp";
import { DecodedData } from "../interfaces/user.interface";
import { IOTP, IUserSession, IVendorSession } from "../interfaces/auth.interface";
import { asyncHandler } from "../shared/middlewares/async-handler";

  declare module 'express-session' {
    interface Session {
      user: IUserSession;
      vendor: IVendorSession;
      otp: IOTP;
    }
  }
  declare global {
    namespace Express {
      interface Request {
        role: string;
        repository?: any;
      }
    }
  }

class AuthController {
  signup = asyncHandler("Signup")(async (req: Request, res: Response): Promise<void> => {
      const role = req.role;
      const { name, email, password, phone, city, vendor_type } = req.body;
  
      const otpCode = await generateOtp(email);
      if (!otpCode) {
        throw new BaseError("Server Error: Couldn't generate OTP, please try again!", 500);
      }
  
      if (role === "user") {
        req.session.user = {
          email,
          password,
          name,
          phone,
          otpCode,
          otpSetTimestamp: Date.now(),
          isExpired: false,
        };
      } else {
        if (!city || !vendor_type) {
          throw new BaseError("City and vendor type are required for vendors", 400);
        }
  
        req.session.vendor = {
          email,
          password,
          name,
          phone: parseInt(phone),
          city,
          vendor_type,
          otpCode,
          otpSetTimestamp: Date.now(),
          isExpired: false,
        };
      }
  
      console.log(`Before ${role} signup`);
      console.log(req.session);
  
      res.status(200).json({
        message: "OTP sent to email for verification.",
        email,
      })
  })
  
  verifyOtp = asyncHandler("VerifyOtp")(async (req: Request, res: Response): Promise<void> => {
      const role = req.role;
      const repository = req.repository;
      console.log("After Signup");
      console.log(req.session);
  
      const otp = req.body.otp;
      const Data = role === "user" ? req.session.user : req.session.vendor;
  
      if (!Data) {
        throw new BaseError("Session expired. Please start signup again.", 400);
      }

      if (Data.isExpired) {
        throw new BaseError("OTP Expired...Try to resend OTP !!", 400);
      }
  
      const { email, password, name, phone, otpCode } = Data;
  
      // Validate OTP
      if (otp !== otpCode) {
        throw new BaseError("Invalid OTP.", 400);
      }
  
      if (role === "user") {
        const user = await authService.signup(
          email,
          password,
          name,
          phone,
          repository,
          role,
          res
        );
  
        res.status(201).json(user);
      } else {
        const { city, vendor_type } = req.session.vendor;
  
        const vendor = await authService.signup(
          email,
          password,
          name,
          phone,
          repository,
          role,
          res,
          city,
          vendor_type
        );
  
        res.status(201).json(vendor);
      }
  })  
      
  login = asyncHandler("Login")(async (req: Request, res: Response) => {
          const role = req.role;
          const repository = req.repository;
          const { email, password } = req.body;
          const response = await authService.login(email, password, repository, role);
          res.cookie("jwtToken", response.token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
          res.status(200).json(response);
        
  })

  forgotPassword = asyncHandler("ForgotPassword")(async (req: Request, res: Response): Promise<void> => {
      const role = req.role;
      const repository = req.repository;
      const email = req.body.email;
      console.log(email);
      const data = await authService.checkExisting(email, role, repository);
      if (data) {
        const otp = await generateOtp(email);
        req.session.otp = {
          otp: otp,
          email: email,
          otpSetTimestamp: Date.now(),
          isExpired: false
        };
        console.log(req.session.otp);
        res.status(200).json({
          message: `OTP sent to ${role} email for password updation request `,
          email: email,
        });
      } else {
        res.status(400).json({ error: `${role} not found !!` });
      }
  })

  VerifyOtpForPassword = asyncHandler("VerifyOtpForPassword")(async (req: Request, res: Response): Promise<void> => {
      const ReceivedOtp = req.body.otp;
      const generatedOtp = req.session.otp?.otp;

      console.log(req.session);
      
      if (req.session.otp.isExpired) {
        throw new BaseError("OTP Expired...Try to resend OTP !!", 400);
      }

      if (ReceivedOtp === generatedOtp) {
        console.log(`otp is correct , navigating to update password.`);
        res.status(200).json({ message: "Otp is verified..!" });
      } else {
        throw new BaseError("Invalid OTP !!", 400);
      }
  })

  ResetPassword = asyncHandler("ResetPassword")(async (req: Request, res: Response): Promise<void> => {
      const role = req.role;
      const repository = req.repository;
      const password = req.body.password;
      const confirmPassword = req.body.confirm_password;
      if (password === confirmPassword) {
        const email = req.session.otp?.email ?? '';
        console.log("email " + email);
        const status = await authService.ResetPassword(password, email!, role, repository);
        
        res.status(200).json({ message: "Password reset successfully." });
      } else {
        res.status(400).json({ error: "Passwords do not match." });
      }
  })
  
  ResendOtp = asyncHandler("ResendOtp")(async (req: Request, res: Response): Promise<void> => {
      const role = req.role;
      const Data = role === "user" ? req.session.user : req.session.vendor;
      if (!Data) {
        res.status(400).json({ error: "Session data not found. Please sign up again." });
        return;
      }
      if (Data.isExpired) {
        const email = Data.email;
        const newOtp = await generateOtp(email);
    
          Data.otpCode = newOtp;
          Data.otpSetTimestamp = Date.now();
          Data.isExpired = false;

      } else {
        console.error('OTP is not expired. Please request a new one.');
        res.status(400).json({ error: 'OTP is not expired. Please request a new one.' });
        return;
      }
    
        console.log('New OTP sent:', Data);
        res.status(200).json({ message: 'New OTP sent to email.' });
  })

  PwdResendOtp = asyncHandler("PwdResendOtp")(async (req: Request, res: Response): Promise<void> => {
      const otpData = req.session.otp;
  
      if (!otpData) {
        res.status(400).json({ error: 'Session data not found. Please request OTP again.' });
        return;
      }
  
      if (otpData.isExpired) {
      const email = otpData.email;
      const newOtp = await generateOtp(email);
  
      req.session.otp = {
        otp: newOtp,
        email: email,
        otpSetTimestamp: Date.now(),
        isExpired: false,
      };
    } else {
      console.error('OTP is not expired. Please request a new one.');
      res.status(400).json({ error: 'OTP is not expired. Please request a new one.' });
      return;
    }
  
      console.log('New OTP sent:', req.session.otp);
      res.status(200).json({ message: 'New OTP sent to email.' });
  })  

  googleRegister = asyncHandler("GoogleRegister")(async (req: Request, res: Response) => {
      console.log("This is credential in body: ", req.body.credential);
      const token = req.body.credential;
      console.log(token);
      const decodedData = jwt.decode(req.body.credential);

      console.log("Decoded data: ", decodedData);
      const { name, email, jti }: DecodedData = decodedData as DecodedData;
      const user = await authService.googleSignup(email, jti, name);
      if (user) {
        res.status(200).json({ message: "user saved successfully" });
      }
  })

  googleLogin = asyncHandler("GoogleLogin")(async (req: Request, res: Response) => {
      const decodedData = jwt.decode(req.body.credential) as DecodedData | null;
      console.log(decodedData);

      if (!decodedData) {
        res.status(400).json({ error: "Invalid credentials" });
        return
      }

      const { email, jti } = decodedData;
      const password = jti;
      const { refreshToken,token, userData, message } = await authService.gLogin(email, password);

      res.cookie("jwtToken", token, {
        httpOnly: true,
      });

      res.status(200).json({ refreshToken,token, userData, message });
  })

  logout = asyncHandler("Logout")(async (req: Request, res: Response): Promise<void> => {
      const role = req.role;
      role === "user" ? res.cookie("jwtUser","",{maxAge:0}) : res.clearCookie("jwtToken");
      res.status(200).json({ message: `${role} logged out successfully..` });
  })

  createRefreshToken = asyncHandler("VerifyOtpForPassword")(async (req: Request, res: Response): Promise<void> => {
      const role = req.role;
      const repository = req.repository;
      const { refreshToken } = req.body;
      const token = await authService.createRefreshToken(refreshToken, repository, role);
      res.status(200).json({ token });
  })
};

export default new AuthController();