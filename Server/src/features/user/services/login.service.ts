import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../data-access/auth.repo";
import { IUserLoginResponse } from "../interfaces/auth.interface";
import { BaseError } from "../../../shared/error/base.error";

class UserLoginService {
  async login(email: string, password: string): Promise<IUserLoginResponse> {
    try {
      const existingUser = await userRepository.findByEmail(email);
      if (!existingUser) {
        throw new BaseError("User not exists..", 404);
      }

      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!passwordMatch) {
        throw new BaseError("Incorrect password..", 401);
      }

      if (existingUser.isActive === false) {
        throw new BaseError("Blocked by Admin..", 404);
      }

      const token = jwt.sign(
        { _id: existingUser._id },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      let refreshToken = jwt.sign(
        { _id: existingUser._id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" }
      );
      existingUser.refreshToken = refreshToken;

      await existingUser.save();
      return {
        refreshToken,
        token,
        userData: existingUser,
        message: "Successfully logged in..",
      };
    } catch (error) {
      console.log("Error occurred while logging in", error);
      throw new BaseError("Failed to login.", 500);
    }
  }
}

export default new UserLoginService();
