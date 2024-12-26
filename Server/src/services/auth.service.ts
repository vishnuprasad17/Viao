import { Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BaseError } from "../shared/error/base.error";
import { ILoginResponse } from "../interfaces/auth.interface";
import userRepository from "../data-access/user.repository";
import vendortypeRepository from "../data-access/vendortype.repository";

function generateToken(id: string, secret: string): string {
  return jwt.sign({ _id: id }, secret, { expiresIn: "15d" });
}

// Helper function to set cookies
function setCookie(res: Response, cookieName: string, token: string): void {
  res.cookie(cookieName, token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

// Utility to capitalize city names
function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
}

class AuthService {
  async signup(
    email: string,
    password: string,
    name: string,
    phone: number,
    repository: any,
    role: string,
    res: Response,
    city?: string,
    vendor_type?: string
  ): Promise<object> {
    try {
      const existing = await repository.findByEmail(email);
      const existingPhone = await repository.findByPhone;
      if (existing || existingPhone) {
        throw new BaseError(`${role} already exists`, 409);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const isActive = true;

      if (role === "user") {
        // Create new user
        const newUser = await repository.create({
          email,
          password: hashedPassword,
          name,
          phone,
          isActive,
        });

        // Generate token and set cookie
        const token = generateToken(newUser._id, process.env.JWT_SECRET!);
        setCookie(res, "jwtUser", token);

        return { user: newUser };
      } else {
        // Validate city and vendor_type for vendor
        if (!city || !vendor_type) {
          throw new BaseError(
            "City and vendor type are required for vendor signup",
            400
          );
        }

        // Vendor-specific fields
        const isVerified = false;
        const verificationRequest = false;
        const totalBooking = 0;

        const vendorType = await vendortypeRepository.findByType(vendor_type);

        // Create new vendor
        const newVendor = await repository.create({
          email,
          password: hashedPassword,
          name,
          phone,
          city: toTitleCase(city),
          isActive,
          isVerified,
          verificationRequest,
          totalBooking,
          vendor_type: vendorType?._id,
        });

        // Generate token
        const token = generateToken(newVendor._id, process.env.JWT_SECRET!);

        return { vendor: newVendor, token };
      }
    } catch (error) {
      console.log("Error during signup:", error);
      throw error;
    }
  }

  async login(
    email: string,
    password: string,
    repository: any,
    role: string
  ): Promise<ILoginResponse> {
    try {
      const existing = await repository.findByEmail(email);
      if (!existing) {
        throw new BaseError(`${role} not exists..`, 404);
      }

      const passwordMatch = await bcrypt.compare(password, existing.password);
      if (!passwordMatch) {
        throw new BaseError("Incorrect password..", 401);
      }

      if (role !== "admin" && existing.isActive === false) {
        throw new BaseError(`Blocked by Admin..`, 403);
      }

      const token = jwt.sign({ _id: existing._id }, process.env.JWT_SECRET!, {
        expiresIn: role === "admin" ? "24h" : "1h",
      });

      let refreshToken = existing.refreshToken;
      if (!refreshToken) {
        refreshToken = jwt.sign(
          { _id: existing._id },
          process.env.JWT_REFRESH_SECRET!,
          { expiresIn: "7d" }
        );
      }
      existing.refreshToken = refreshToken;
      await existing.save();

      const response: ILoginResponse = {
        token,
        refreshToken,
        message: "Successfully logged in..",
      };

      // Role-specific data key
      if (role === "vendor") {
        response.vendorData = existing; // Adding vendorData for vendor role
      } else if (role === "admin") {
        response.adminData = existing; // Adding adminData for admin role
      } else {
        response.userData = existing; // Adding userData for user role
      }
      return response;
    } catch (error) {
      console.error(`Error during ${role} login:`, error);
      throw error;
    }
  }

  async createRefreshToken(
    refreshToken: string,
    repository: any,
    role: string
  ): Promise<string> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
        _id: string;
      };

      const person = await repository.getById(decoded._id);
      console.log(`${role}`, person);

      if (!person || person.refreshToken !== refreshToken) {
        throw new BaseError("Invalid refresh token.", 401);
      }

      const accessToken = jwt.sign(
        { _id: person._id },
        process.env.JWT_SECRET!,
        {
          expiresIn: role === "admin" ? "24h" : "1h",
        }
      );

      return accessToken;
    } catch (error) {
      console.error("Error in createRefreshToken:", error);
      throw error;
    }
  }

  async checkExisting(email: string, role: string, repository: any) {
    try {
      const existing = await repository.findByEmail(email);
      return existing;
    } catch (error) {
      console.error(`Error in checking existing ${role}:`, error);
      throw new BaseError(`Failed to check existing ${role}.`, 500);
    }
  }

  async ResetPassword(password: string, email: string, role:string, repository: any) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const status = await repository.UpdatePassword(hashedPassword, email);
            if (!status.success) {
              throw new BaseError("Failed to reset password.", 500);;
            }
          } catch (error) {
            console.error(`Error in resetting ${role}:`, error)
            throw new BaseError("Failed to reset password.", 500);
          }
        }

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
              throw error;
            }
          }
        
          async gLogin(email: string, password: string): Promise<ILoginResponse> {
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

export default new AuthService();