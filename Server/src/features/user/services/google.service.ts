import jwt from "jsonwebtoken";
import userRepository from "../data-access/auth.repo"
import { BaseError } from "../../../shared/error/base.error";
import { IUserLoginResponse } from "../interfaces/auth.interface";


class UserGoogleService {
  async googleSignup(
    email: string,
    password: string,
    name: string
  ): Promise<object> {
    try {
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        throw new BaseError("User already exists", 404);
      }
      const isActive: boolean = true;
      const newUser = await userRepository.create({
        email,
        password,
        name,
        isActive,
      });
      return { user: newUser };
    } catch (error) {
      console.error("Error in googleSignup:", error);
      throw new BaseError("Failed to sign up with Google.", 500);
    }
  }

  async gLogin(email: string, password: string): Promise<IUserLoginResponse> {
    try {
      console.log("in service", email, password);
      const existingUser = await userRepository.findByEmail(email);
      if (!existingUser) {
        throw new BaseError("User not exists..", 404);
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
      console.error("Error in gLogin:", error);
      throw new BaseError("Failed to log in.", 500);
    }
  }
}

export default new UserGoogleService();
