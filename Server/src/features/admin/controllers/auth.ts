import { Request, Response } from "express";
import AdminLoginService from "../services/login.service";
import AdminTokenService from "../services/token.service";
import { adminLoginSchema } from "../schemas/auth.schema";
import { IAdminLoginRequest } from "../interfaces/auth.interface";
import { errorHandler } from "../../../shared/utils/error.handler";

class AdminAuthController {
  async Adminlogin(req: Request, res: Response){
    try {
      const { email, password } = req.body as IAdminLoginRequest;
      // Validating input
      const { error } = adminLoginSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }

      const { refreshToken, token, adminData, message} = await AdminLoginService.login(email, password);
      res.cookie('jwtToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

      res.status(200).json({refreshToken, token, adminData, message});
    } catch (error) {
      errorHandler(res, error, "AdminLogin");
    }
  }

  async Adminlogout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("jwtToken");
      res.status(200).json({ message: "Admin logged out successfully.." });
    } catch (error) {
      errorHandler(res, error, "AdminLogout");
    }
  }

  async createRefreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const token = await AdminTokenService.createAdminRefreshToken(refreshToken);
      res.status(200).json({ token });
    } catch (error) {
      errorHandler(res, error, "createRefreshToken"); 
    }
  }
};

export default new AdminAuthController();
