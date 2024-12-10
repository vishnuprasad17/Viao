import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import userSignupService from "../services/signup.service";
import userLoginService from "../services/login.service";
import userTokenService from "../services/token.service";
import userCheckingService from "../services/checking.service";
import userPasswordService from "../services/password.service";
import userGoogleService from "../services/google.service";
import generateOtp from "../../../shared/utils/generate.otp";
import { DecodedData } from "../interfaces/google.interface"
import { UserSession, OTP } from "../interfaces/user-session.interface";
import { userSignupSchema, userLoginSchema } from "../schemas/auth.schema";
import {
  IUserSignupRequest,
  IUserLoginRequest,
} from "../interfaces/auth.interface";
import { BaseError } from "../../../shared/error/base.error";
import { errorHandler } from "../../../shared/utils/error.handler";

declare module "express-session" {
  interface Session {
    user: UserSession;
    otp: OTP | undefined;
  }
}

class UserAuthController {
  async UserSignup(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, phone } = req.body as IUserSignupRequest;

      // validating input
      const { error } = userSignupSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }

      const otpCode = await generateOtp(email);

      if (otpCode !== undefined) {
        req.session.user = {
          email: email,
          password: password,
          name: name,
          phone: phone,
          otpCode: otpCode,
          otpSetTimestamp: Date.now(),
        };

        console.log(req.session);
        
        res.status(200).json({
          message: "OTP send to email for verification..",
          email: email,
        });
      } else {
        console.log("couldn't generate otp, error occcured ,please fix !!");
        res.status(500).json({
          message: `Server Error couldn't generate otp, error occcured ,please fix !!`,
        });
      }
    } catch (error) {
      errorHandler(res, error, "UserSignup");
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      console.log("After Signup");
      console.log(req.session);
      const otp = req.body.otp;
      const userData = req.session.user;
      const email = userData.email;
      const password = userData.password;
      const name = userData.name;
      const phone = userData.phone;
      if (!userData.otpCode) {
        throw new BaseError("OTP Expired...Try to resend OTP !!", 400);
      }
      const otpCode = userData.otpCode;
      if (otp === otpCode) {
        const user= await userSignupService.signup(email, password, name, phone,res);
        
        res.status(201).json(user);
      } else {
        throw new BaseError("Invalid otp !!", 400);
      }
    } catch (error) {
      errorHandler(res, error, "verifyOtp");
    }
  }

  async UserLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as IUserLoginRequest;

      // validating input
      const { error } = userLoginSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }

      const { token, refreshToken, userData, message } = await userLoginService.login(email, password);
      res.cookie('jwtToken', token, { httpOnly: true });
      res.status(200).json({token, userData, message, refreshToken });
    } catch (error) {
      errorHandler(res, error, "UserLogin");
    }
  }

  async UserLogout(req: Request, res: Response): Promise<void> {
    try {
      res.cookie("jwtUser","",{maxAge:0});
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      errorHandler(res, error, "UserLogout");
    }
  }

  async createRefreshToken(req: Request, res: Response):Promise<void>{
    try {
     
      const { refreshToken } = req.body;
      
      const token = await userTokenService.createRefreshToken(refreshToken);
    
      res.status(200).json({ token });

    } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(401).json({ message: 'Failed to refresh token' });
    }
  }

  async UserForgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const email = req.body.email;
      console.log(email);
      const user = await userCheckingService.CheckExistingUSer(email);
      if (user) {
        const otp = await userPasswordService.generateOtpForPassword(email);
        req.session.otp = {
          otp: otp,
          email: email,
          otpSetTimestamp: Date.now(),
        };
        console.log(req.session.otp);
        res.status(200).json({
          message: "OTP sent to email for password updation request ",
          email,
        });
      } else {
        res.status(400).json({ error: "User not found !!" });
      }
    } catch (error) {
      errorHandler(res, error, "UserForgotPassword");
    }
  }

  async VerifyOtpForPassword(req: Request, res: Response): Promise<void> {
    try {
      const ReceivedOtp = req.body.otp;
      const generatedOtp = req.session.otp?.otp;
      if (!req.session.otp) {
        throw new BaseError("OTP Expired...Try to resend OTP !!", 400);
      }

      if (ReceivedOtp === generatedOtp) {
        console.log("otp is correct , navigating user to update password.");
        res.status(200).json({ message: "Otp is verified..!" });
      } else {
        throw new BaseError("Invalid OTP !!", 400);
      }
    } catch (error) {
      errorHandler(res, error, "VerifyOtpForPassword");
    }
  }

  async ResetUserPassword(req: Request, res: Response): Promise<void> {
    try {
      const password = req.body.password;
      const confirmPassword = req.body.confirm_password;
      if (password === confirmPassword) {
        const email = req.session.otp?.email;
        console.log("email " + email);
        const status = await userPasswordService.ResetPassword(password, email!);
        req.session.otp = undefined;
        res.status(200).json({ message: "Password reset successfully." });
      } else {
        res.status(400).json({ error: "Passwords do not match." });
      }
    } catch (error) {
      errorHandler(res, error, "ResetUserPassword");
    }
  }

  async ResendOtp(req: Request, res: Response): Promise<void> {
    try {
      const userData: UserSession | undefined = req.session.user;
      if (!userData) {
        res
          .status(400)
          .json({ error: "Session data not found. Please sign up again." });
        return;
      }
      const email = userData.email;
      const newOtp = await generateOtp(email);
      if (req.session.user) {
        req.session.user.otpCode = newOtp;
      } else {
        console.error("Session user data is unexpectedly undefined.");
        res.status(500).json({
          message: "Server Error: Session user data is unexpectedly undefined.",
        });
        return;
      }
      res.status(200).json({ message: "New OTP sent to email" });
    } catch (error) {
      errorHandler(res, error, "ResendOtp");
    }
  }

  async PwdResendOtp(req: Request, res: Response): Promise<void> {
    try {
      const otp: OTP | undefined = req.session.otp;
      if (!otp) {
        res
          .status(400)
          .json({ error: "Session data not found. Please sign up again." });
        return;
      }
      const email = otp.email;
      const newOtp = await generateOtp(email);
      if (req.session.otp) {
        req.session.otp.otp = newOtp;
      } else {
        console.error("Session user data is unexpectedly undefined.");
        res.status(500).json({
          message: "Server Error: Session user data is unexpectedly undefined.",
        });
        return;
      }
      res.status(200).json({ message: "New OTP sent to email" });
    } catch (error) {
      errorHandler(res, error, "PwdResendOtp");
    }
  }

  async googleRegister(req: Request, res: Response) {
    try {
      console.log("This is credential in body: ", req.body.credential);
      const token = req.body.credential;
      console.log(token);
      const decodedData = Jwt.decode(req.body.credential);

      console.log("Decoded data: ", decodedData);
      const { name, email, jti }: DecodedData = decodedData as DecodedData;
      const user = await userGoogleService.googleSignup(email, jti, name);
      if (user) {
        res.status(200).json({ message: "user saved successfully" });
      }
    } catch (error) {
      res.status(400).json({ error: "User already exists" });
    }
  }

  async googleLogin(req: Request, res: Response) {
    try {
      const decodedData = Jwt.decode(req.body.credential) as DecodedData | null;
      console.log(decodedData);

      if (!decodedData) {
        res.status(400).json({ error: "Invalid credentials" });
        return
      }

      const { email, jti } = decodedData;
      const password = jti;
      const { refreshToken,token, userData, message } = await userGoogleService.gLogin(email, password);

      res.cookie("jwtToken", token, {
        httpOnly: true,
      });

      res.status(200).json({ refreshToken,token, userData, message });
    } catch (error) {
      errorHandler(res, error, "googleLogin");
    }
  }
};

export default new UserAuthController();