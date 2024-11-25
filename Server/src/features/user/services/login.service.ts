import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../data-access/auth.repo";

export const login = async (
  email: string,
  password: string
): Promise<string> => {
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
    const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET!);
    return token;
  } catch (error) {
    throw error;
  }
};
