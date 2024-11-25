import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findvendorByEmail } from "../data-access/auth.repo";

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const existingVendor = await findvendorByEmail(email);
    if (!existingVendor) {
      throw new Error("vendor not exists..");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      existingVendor.password
    );

    if (!passwordMatch) {
      throw new Error("Incorrect password..");
    }

    // If the password matches, generate and return a JWT token
    const token = jwt.sign(
      { _id: existingVendor._id },
      process.env.JWT_SECRET!
    );
    return token;
  } catch (error) {
    throw error;
  }
};
