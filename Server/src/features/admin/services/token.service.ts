import jwt from "jsonwebtoken";
import AdminRepository from "../data-access/auth.repo"
import { BaseError } from "../../../shared/error/base.error";




class AdminTokenService {
    async createAdminRefreshToken(refreshToken: string) {
        try {
            const decoded = jwt.verify(
              refreshToken,
              process.env.JWT_REFRESH_SECRET!
            ) as { _id: string };
            const Admin = await AdminRepository.getById(decoded._id);
      
            if (!Admin || Admin.refreshToken !== refreshToken) {
              throw new Error("Invalid refresh token");
            }
      
            const accessToken = jwt.sign(
              { _id: Admin._id },
              process.env.JWT_SECRET!,
              {
                expiresIn: "24h",
              }
            );
            return accessToken;
          } catch (error) {
            throw new BaseError("An error occurred during createRefreshToken", 500);
          }
    }
}

export default new AdminTokenService();