import { Request, Response, NextFunction } from "express";

export interface AuthController {
    signup(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyOtpForPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    pwdResendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    googleRegister(req: Request, res: Response, next: NextFunction): Promise<void>;
    googleLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
    logout(req: Request, res: Response, next: NextFunction): Promise<void>;
    createToken(req: Request, res: Response, next: NextFunction): Promise<void>;
}