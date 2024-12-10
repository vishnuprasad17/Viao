import jwt from "jsonwebtoken";
import userRepository from "../data-access/auth.repo"
import { BaseError } from "../../../shared/error/base.error";




class UserTokenService {
    async createRefreshToken(refreshToken: string) {
        try {
          const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET!
          ) as { _id: string };
    
          const user = await userRepository.getById(decoded._id);
          console.log("user", user);
    
          if (!user || user.refreshToken !== refreshToken) {
            throw new BaseError("Invalid refresh token.", 401)
          }
    
          const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, {
            expiresIn: "1h",
          });
    
          return accessToken;
        } catch (error) {
          console.error("Error in createRefreshToken:", error)
          throw new BaseError("Failed to create refresh token.", 500); 
        }
      }
}

export default new UserTokenService();