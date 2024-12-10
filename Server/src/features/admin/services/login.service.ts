import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminRepository from "../data-access/auth.repo";
import { IAdminLoginResponse } from "../interfaces/auth.interface";
import { BaseError } from "../../../shared/error/base.error";

class AdminLoginService {
  async login(email: string, password: string): Promise<IAdminLoginResponse> {
    try {
      const existingAdmin = await AdminRepository.findByEmail(email);
      if (!existingAdmin) {
        throw new Error("Admin not found");
      }

      const passwordMatch = await bcrypt.compare(
        password,
        existingAdmin.password
      );
      if (!passwordMatch) {
        throw new BaseError("Incorrect password", 401);
      }

      let refreshToken = existingAdmin.refreshToken;

      if (!refreshToken) {
        refreshToken = jwt.sign(
          { _id: existingAdmin._id },
          process.env.JWT_REFRESH_SECRET!,
          { expiresIn: "7d" }
        );
      }

      const token = jwt.sign(
        { _id: existingAdmin._id },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );
      return {
        refreshToken,
        token,
        adminData: existingAdmin,
        message: "Successfully logged in..",
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new AdminLoginService();
