import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../data-access/auth.repo";
import { IUserLoginResponse } from "../interfaces/auth.interface";

export const login = async (
  email: string,
  password: string
): Promise<IUserLoginResponse> => {
  try {
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      throw new Error("User not exists..");
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      throw new Error("Incorrect password..");
    }

    // If the password matches, generate and return a JWT token
    const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET!, { expiresIn: '1h'});
    return {token, userData: existingUser, message:"Successfully logged in.."};
  } catch (error) {
    throw error;
  }
};
