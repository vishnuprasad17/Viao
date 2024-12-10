import { Request , Response } from "express";
import VendorSignupService from "../services/signup.service";
import VendorLoginService from "../services/login.service";
import VendorTokenService from "../services/token.service";
import VendorPasswordService from "../services/password.service";
import { IVendorSession, IOTP } from "../interfaces/vendor-session.interface";
import generateOtp from "../../../shared/utils/generate.otp";
import { errorHandler } from "../../../shared/utils/error.handler";
import { BaseError } from "../../../shared/error/base.error";



declare module "express-session" {
  interface Session {
    vendorData: IVendorSession;
    otp: IOTP | undefined;
  }
}

class VendorAuthController {

    async vendorSignup(req: Request, res: Response): Promise<void> {
        try {
          const { email , password , name , phone , city, vendor_type } = req.body;
          const otpCode = await generateOtp(email);

      if (otpCode !== undefined) {
        req.session.vendorData = {
          email: email,
          password: password,
          name: name,
          phone: parseInt(phone),
          city: city,
          otpCode: otpCode,
          vendor_type: vendor_type,
          otpSetTimestamp: Date.now(),
        };

        console.log("vendor signup..Before");
        console.log(req.session);
        res.status(200).json({
          message: "OTP send to vendor's email for verification..",
          email: email,
        });
      } else {
        console.log("couldn't generate otp, error occcured ,please fix !!");
        res.status(500).json({
          message: `Server Error couldn't generate otp, error occcured ,please fix !!`,
        });
      }
        } catch (error) {
          errorHandler(res, error, "vendorSignup");
        }
      }

      async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
          const otp = req.body.otp;
          const vendorData = (req.session as any).vendorData;
          const email = vendorData.email;
          const password = vendorData.password;
          const name = vendorData.name;
          const phone = vendorData.phone;
          const city = vendorData.city;
          const vendor_type = vendorData.vendor_type;
          const otpCode = vendorData.otpCode;
          console.log(otp, vendorData.otpCode);
    
          if (!vendorData.otpCode) {
            throw new BaseError("OTP Expired...Try to resend OTP !!", 400);
          }
          if (otp === otpCode) {
            const {vendor} = await VendorSignupService.signup(
              email,
              password,
              name,
              phone,
              city,
              vendor_type
            );
    
            res.status(201).json({vendor});
          } else {
            throw new BaseError("Invalid otp !!", 400);
          }
        } catch (error) {
          throw error;
        }
      }

      async VendorLogin(req:Request , res: Response): Promise <void> {
        try {
            const {email,password} = req.body;
            const { refreshToken, token, vendorData, message } = await VendorLoginService.login(email, password);
            res.cookie('jwtToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.status(200).json({ refreshToken, token, vendorData, message });
        } catch (error) {
            errorHandler(res, error, "VendorLogin");
        }
      }

      async createRefreshToken(req: Request, res: Response): Promise<void> {
        try {
          const { refreshToken } = req.body;
    
          const token = await VendorTokenService.createRefreshToken(refreshToken);
    
          res.status(200).json({ token });
        } catch (error) {
          errorHandler(res, error, "createRefreshToken");
        }
      }
    
      async ResendOtp(req: Request, res: Response): Promise<void> {
        try {
          const vendorData: IVendorSession | undefined = req.session.vendorData;
          if (!vendorData) {
            res
              .status(400)
              .json({ error: "Session data not found. Please sign up again." });
            return;
          }
          const email = vendorData.email;
          const newOtp = await generateOtp(email);
          if (req.session.vendorData) {
            req.session.vendorData.otpCode = newOtp;
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
          const otp: IOTP | undefined = req.session.otp;
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
    
      async VendorForgotPassword(req: Request, res: Response): Promise<void> {
        try {
          const email = req.body.email;
          const vendor = await VendorPasswordService.CheckExistingVendor(email);
          if (vendor) {
            const otp = await generateOtp(email);
            (req.session as any).vendorotp = { otp: otp, email: email };
            console.log(req.session);
            res.status(200).json({
              message: "otp sent to vendor email for password updation request ",
              email: email,
            });
          } else {
            res.status(400).json({ error: "Email not Registered with us !!" });
          }
        } catch (error) {
          errorHandler(res, error, "VendorForgotPassword");
        }
      }
    
      async VerifyOtpForPassword(req: Request, res: Response): Promise<void> {
        try {
          const ReceivedOtp = req.body.otp;
          console.log("received otp", ReceivedOtp);
          console.log(req.session);
          const generatedOtp = (req.session as any).vendorotp.otp;
          console.log("generated otp", generateOtp);
    
          if (ReceivedOtp === generatedOtp) {
            console.log("otp is correct , navigating vendor to update password.");
            res
              .status(200)
              .json({ message: "otp is correct, please update password now" });
          } else {
            res.status(400).json({ Error: `otp's didn't matched..` });
          }
        } catch (error) {
          errorHandler(res, error, "VerifyOtpForPassword");
        }
      }
    
      async ResetVendorPassword(req: Request, res: Response): Promise<void> {
        try {
          const password = req.body.password;
          const confirmPassword = req.body.confirm_password;
          if (password === confirmPassword) {
            const email = (req.session as any).vendorotp.email;
            const status = await VendorPasswordService.ResetVendorPasswordService(
              password,
              email
            );
            res.status(200).json({ message: "Password reset successfully." });
          } else {
            res.status(400).json({ error: "Passwords do not match." });
          }
        } catch (error) {
          errorHandler(res, error, "ResetVendorPassword");
        }
      }


      async VendorLogout(req:Request , res: Response): Promise <void> {
        try {
          res.clearCookie('jwtToken');
          res.status(200).json({ message: 'vendor logged out successfully' });
        } catch (error) {
          errorHandler(res, error, "VendorLoggedOut");
        }
      }

}

export default new VendorAuthController();