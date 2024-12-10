import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import vendorRepository from "../data-access/auth.repo";
import { IVendorLoginResponse } from "../interfaces/auth.interface";
import { BaseError } from "../../../shared/error/base.error";

class VendorLoginService {
  async login (
  email: string,
  password: string
): Promise<IVendorLoginResponse> {
  try {
    const existingVendor = await vendorRepository.findByEmail(email);
    if (!existingVendor) {
      throw new BaseError("vendor not exists..", 404);
    }

    const passwordMatch = await bcrypt.compare(
      password,
      existingVendor.password
    );

    if (!passwordMatch) {
      throw new BaseError("Incorrect password..", 401);
    }

    if (existingVendor.isActive === false) {
      throw new BaseError("Cannot login..!Blocked by Admin...", 401);
    }

    // If the password matches, generate and return a JWT token
    const token = jwt.sign(
      { _id: existingVendor._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h'}
    );

    let refreshToken = existingVendor.refreshToken;

      if (!refreshToken) {
        refreshToken = jwt.sign(
          { _id: existingVendor._id },
          process.env.JWT_REFRESH_SECRET!,
          { expiresIn: "7d" }
        );
      }

    return {refreshToken,token,vendorData:existingVendor,message:"Successfully logged in.."};
  } catch (error) {
    console.log("Error occurred while logging..", error);
    throw error;
  }
};
}

export default new VendorLoginService();
