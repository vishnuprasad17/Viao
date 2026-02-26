import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { asyncHandler } from "../middlewares/async-handler";
import TYPES from "../../domain/constants/inversifyTypes";
import { AuthUseCase } from "../../domain/interfaces/application interfaces/AuthUseCase";
import { AuthController } from "../../domain/interfaces/adapter interfaces/AuthController";

const OTP_VALIDITY_MS = 2 * 60 * 1000;

@injectable()
export class AuthControllerImpl implements AuthController {
  constructor(@inject(TYPES.AuthUseCase) private authUseCase: AuthUseCase) {}

  // Cookie configuration constants
  private readonly COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
  };

  private readonly ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutes
  private readonly REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

  signup = asyncHandler("Signup")(
    async (req: Request, res: Response): Promise<void> => {
      const role = req.role;
      const { name, email, password, phone, city, vendor_type } = req.body;
      const result = await this.authUseCase.executeSignup({
        role,
        name,
        email,
        password,
        phone: parseInt(phone),
        city,
        vendor_type,
        session: req.session,
      });

      const otpExpiresAt = req.session[role === "user" ? "user" : "vendor"]
        ?.otpSetTimestamp
        ? req.session[role === "user" ? "user" : "vendor"]!.otpSetTimestamp +
          OTP_VALIDITY_MS
        : Date.now() + OTP_VALIDITY_MS;

      res.status(200).json({ ...result, otpExpiresAt });
    },
  );

  verifyOtp = asyncHandler("VerifyOtp")(
    async (req: Request, res: Response): Promise<void> => {
      const role = req.role;
      const otp: string = req.body.otp;
      const result = await this.authUseCase.verify({
        role,
        otp,
        session: req.session,
      });

      // Set tokens in HTTP-only cookies
      res.cookie(`accessToken_${role}`, result.accessToken, {
        ...this.COOKIE_OPTIONS,
        maxAge: this.ACCESS_TOKEN_MAX_AGE,
      });

      res.cookie(`refreshToken_${role}`, result.refreshToken, {
        ...this.COOKIE_OPTIONS,
        maxAge: this.REFRESH_TOKEN_MAX_AGE,
      });

      const responseData =
        "user" in result
          ? {
              user: result.user,
              message: "Successfully verified and logged in",
            }
          : {
              vendor: result.vendor,
              message: "Successfully verified and logged in",
            };

      res.status(201).json(responseData);
    },
  );

  login = asyncHandler("Login")(
    async (req: Request, res: Response): Promise<void> => {
      const role = req.role;
      const { email, password } = req.body;
      const response = await this.authUseCase.login(role, email, password);

      res.cookie(`accessToken_${role}`, response.accessToken, {
        ...this.COOKIE_OPTIONS,
        maxAge: this.ACCESS_TOKEN_MAX_AGE,
      });

      res.cookie(`refreshToken_${role}`, response.refreshToken, {
        ...this.COOKIE_OPTIONS,
        maxAge: this.REFRESH_TOKEN_MAX_AGE,
      });

      const { accessToken, refreshToken, ...responseData } = response;

      res.status(200).json(responseData);
    },
  );

  forgotPassword = asyncHandler("ForgotPassword")(
    async (req: Request, res: Response): Promise<void> => {
      const role = req.role;
      const email = req.body.email;
      const result = await this.authUseCase.forgotPwdOtp(role, email, req);

      const otpExpiresAt = req.session.otpData?.otpSetTimestamp
        ? req.session.otpData.otpSetTimestamp + OTP_VALIDITY_MS
        : Date.now() + OTP_VALIDITY_MS;

      res.status(200).json({ ...result, otpExpiresAt });
    },
  );

  verifyOtpForPassword = asyncHandler("VerifyOtpForPassword")(
    async (req: Request, res: Response): Promise<void> => {
      const receivedOtp: string = req.body.otp;
      const session = req.session;
      const result = await this.authUseCase.verifyOtp(receivedOtp, session);

      res.status(200).json(result);
    },
  );

  resetPassword = asyncHandler("ResetPassword")(
    async (req: Request, res: Response): Promise<void> => {
      const role = req.role;
      const password = req.body.password;
      const confirmPassword = req.body.confirm_password;
      if (!req.session.otpData || !req.session.otpData.email) {
        res
          .status(400)
          .json({ error: "Session data not found. Please request OTP again." });
        return;
      }
      const status = await this.authUseCase.reset(
        role,
        password,
        confirmPassword,
        req.session.otpData.email,
      );
      if (status) {
        // Clear OTP session
        delete req.session.otpData;
        res.status(200).json({ message: "Password reset successfully." });
      } else {
        res.status(400).json({ error: "Passwords do not match." });
      }
    },
  );

  resendOtp = asyncHandler("ResendOtp")(
    async (req: Request, res: Response): Promise<void> => {
      const role = req.role;
      const Data = role === "user" ? req.session.user : req.session.vendor;
      if (!Data) {
        res
          .status(400)
          .json({ error: "Session data not found. Please sign up again." });
        return;
      }

      const status = await this.authUseCase.resendSignupOtp(req, role);
      if (!status) {
        res
          .status(400)
          .json({ error: "Failed to send OTP. Please try again." });
        return;
      }

      const otpExpiresAt = Data.otpSetTimestamp + OTP_VALIDITY_MS;

      res.status(200).json({ message: "New OTP sent to email.", otpExpiresAt });
    },
  );

  pwdResendOtp = asyncHandler("PwdResendOtp")(
    async (req: Request, res: Response): Promise<void> => {
      if (!req.session.otpData) {
        res
          .status(400)
          .json({ error: "Session data not found. Please request OTP again." });
        return;
      }

      const status = await this.authUseCase.resendResetPasswordOtp(req);
      if (!status) {
        res
          .status(400)
          .json({ error: "Failed to send OTP. Please try again." });
        return;
      }

      const otpExpiresAt =
        req.session.otpData.otpSetTimestamp + OTP_VALIDITY_MS;

      res.status(200).json({ message: "New OTP sent to email." });
    },
  );

  googleLogin = asyncHandler("GoogleLogin")(
    async (req: Request, res: Response): Promise<void> => {
      const authtoken = req.body.credential;
      const response = await this.authUseCase.gLogin(authtoken);

      res.cookie("accessToken_user", response.accessToken, {
        ...this.COOKIE_OPTIONS,
        maxAge: this.ACCESS_TOKEN_MAX_AGE,
      });

      res.cookie("refreshToken_user", response.refreshToken, {
        ...this.COOKIE_OPTIONS,
        maxAge: this.REFRESH_TOKEN_MAX_AGE,
      });

      const { accessToken, refreshToken, ...responseData } = response;

      res.status(200).json(responseData);
    },
  );

  logout = asyncHandler("Logout")(
    async (req: Request, res: Response): Promise<void> => {
      const role = req.role;
      const refreshToken = req.cookies[`refreshToken_${role}`];
      try {
        await this.authUseCase.delete(role, refreshToken);
      } catch (err) {
        console.warn(`Logout token cleanup skipped: ${(err as Error).message}`);
      }
      res.clearCookie(`accessToken_${role}`, this.COOKIE_OPTIONS);
      res.clearCookie(`refreshToken_${role}`, this.COOKIE_OPTIONS);

      res.status(200).json({ message: `${role} logged out successfully` });
    },
  );

  createToken = asyncHandler("RefreshToken")(
    async (req: Request, res: Response): Promise<void> => {
      const role = req.role;
      const refreshToken = req.cookies[`refreshToken_${role}`];

      if (!refreshToken) {
        res.status(401).json({ error: "Refresh token not found" });
        return;
      }

      const data = await this.authUseCase.createToken(role, refreshToken);

      res.cookie(`accessToken_${role}`, data.accessToken, {
        ...this.COOKIE_OPTIONS,
        maxAge: this.ACCESS_TOKEN_MAX_AGE,
      });

      res.cookie(`refreshToken_${role}`, data.refreshToken, {
        ...this.COOKIE_OPTIONS,
        maxAge: this.REFRESH_TOKEN_MAX_AGE,
      });

      res.status(200).json({ message: "Tokens refreshed successfully" });
    },
  );
}
