import { Request, Response } from "express";
import { adminLogin } from "../services/login.service";
import { adminLoginSchema } from "../schemas/auth.schema";
import { IAdminLoginRequest } from "../interfaces/auth.interface";

export const AdminAuthController = {
  async Adminlogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as IAdminLoginRequest;
      // Validating input
      const { error } = adminLoginSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }

      const admin = await adminLogin(res, email, password);
      res.status(200).json(admin);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error.." });
    }
  },

  async Adminlogout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("jwt");
      res.status(200).json({ message: "Admin logged out successfully.." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error..." });
    }
  },
};