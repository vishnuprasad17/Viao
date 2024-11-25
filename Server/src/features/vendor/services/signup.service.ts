import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createVendor, findvendorByEmail } from "../data-access/auth.repo";

export const signup = async (
  email: string,
  password: string,
  name: string,
  phone: number,
  city: string
): Promise<string> => {
  try {
    const existingVendor = await findvendorByEmail(email);
    if (existingVendor) {
      throw new Error("vendor already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const isActive: boolean = true;
    const isVerified: boolean = false;
    const verificationRequest: boolean = false;
    const totalBooking: number = 0;

    const newVendor = await createVendor({
      email,
      password: hashedPassword,
      name,
      phone,
      city,
      isActive,
      isVerified,
      verificationRequest,
      totalBooking,
    });

    const token = jwt.sign({ _id: newVendor._id }, process.env.JWT_SECRET!);

    return token;
  } catch (error) {
    throw error;
  }
};