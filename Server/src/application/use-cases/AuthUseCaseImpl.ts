import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { inject, injectable } from "inversify";
import { BaseError } from "../../domain/errors/BaseError";
import { AuthUseCase, SignupParams, VerifyParams, LoginResponse, DecodedData } from "../../domain/interfaces/application interfaces/AuthUseCase";
import TYPES from "../../domain/constants/inversifyTypes";
import { EmailService } from "../../domain/interfaces/application interfaces/EmailService";
import { UserRepository } from "../../domain/interfaces/infrastructure interfaces/UserRepository";
import { VendorRepository } from "../../domain/interfaces/infrastructure interfaces/VendorRepository";
import { AdminRepository } from "../../domain/interfaces/infrastructure interfaces/AdminRepository";
import { PasswordService } from "../../domain/interfaces/application interfaces/PasswordService";
import { NotificationService } from "../../domain/interfaces/application interfaces/NotificationService";
import { User } from "../../domain/entities/User";
import { Types } from "../../domain/constants/notificationTypes";
import { TypeRepository } from "../../domain/interfaces/infrastructure interfaces/TypeRepository";
import { Vendor } from "../../domain/entities/Vendor";
import { Session, SessionData } from "express-session";
import { UserDTO } from "../../domain/dtos/UserDTO";
import { VendorDTO } from "../../domain/dtos/VendorDTO";
import { Admin } from "../../domain/entities/Admin";
import { AdminDTO } from "../../domain/dtos/AdminDTO";
import { NotificationRepository } from "../../domain/interfaces/infrastructure interfaces/NotificationRepository";
import { TokenService, TokenPayload } from "../../domain/interfaces/application interfaces/TokenService";
import dotenv from "dotenv";
import { Request } from "express";

dotenv.config();
  
  // Utility to capitalize city names
  function toTitleCase(str: string): string {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );
  }

  // Constants for token management
  const TOKEN_FAMILY_PREFIX = 'token_family:';
  const REFRESH_TOKEN_PREFIX = 'refresh_token:';

@injectable()
export class AuthUseCaseImpl implements AuthUseCase  {
    constructor(
                @inject(TYPES.AdminRepository) private adminRepository: AdminRepository,
                @inject(TYPES.UserRepository) private userRepository: UserRepository,
                @inject(TYPES.VendorRepository) private vendorRepository: VendorRepository,
                @inject(TYPES.TypeRepository) private typeRepository: TypeRepository,
                @inject(TYPES.EmailService) private emailService: EmailService,
                @inject(TYPES.PasswordService) private passwordService: PasswordService,
                @inject(TYPES.NotificationService) private notificationService: NotificationService,
                @inject(TYPES.TokenService) private tokenService: TokenService,
                @inject(TYPES.NotificationRepository) private notificationRepository: NotificationRepository,
                ) {}

    async executeSignup({role, name, email, password, phone, city, vendor_type, session}: SignupParams): Promise<{ message: string; email: string }> {
      const otpCode = await this.emailService.sendOtp(email);
      if (!otpCode) {
        throw new BaseError("Server Error: Couldn't generate OTP, please try again!", 500);
      }
  
      if (role === "user") {
        session.user = {
          email,
          password,
          name,
          phone,
          otpCode,
          otpSetTimestamp: Date.now(),
          isExpired: false,
        };
      } else if (role === "vendor") {
        if (!city || !vendor_type) {
          throw new BaseError("City and vendor type are required for vendors", 400);
        }
  
        session.vendor = {
          email,
          password,
          name,
          phone,
          city,
          vendor_type,
          otpCode,
          otpSetTimestamp: Date.now(),
          isExpired: false,
        };
      } else {
        throw new BaseError("Invalid role provided", 400);
      }
  
      return {
        message: "OTP sent to email for verification.",
        email,
      };
    }

    async verify({role, otp, session}: VerifyParams): Promise<{user: UserDTO, accessToken: string, refreshToken: string} | {vendor: VendorDTO, accessToken: string, refreshToken: string}> {
      const Data = role === "user" ? session.user : session.vendor;
      
          if (!Data) {
            throw new BaseError("Session expired. Please start signup again.", 400);
          }
    
          if (Data.isExpired) {
            throw new BaseError("OTP Expired. Try to resend OTP !!", 400);
          }
      
          const { email, password, name, phone, otpCode } = Data;
      
          // Validate OTP
          if (otp !== otpCode) {
            throw new BaseError("Invalid OTP.", 400);
          }
      
          const Admin = await this.adminRepository.findOne({});
          if (!Admin) {
            throw new BaseError("Admin not found", 404);
          }

          const existingEmail = role === "user"
              ? await this.userRepository.findByEmail(email)
              : await this.vendorRepository.findByEmail(email);
          if (existingEmail) {
            throw new BaseError(`This email is already registered`, 409);
          }

          const existingPhone = role === "user"
              ? await this.userRepository.findByPhone(Number(phone))
              : await this.vendorRepository.findByPhone(Number(phone));
          if (existingPhone) {
            throw new BaseError(`This phone number is already registered`, 409);
          }
          
          const hashedPassword = await this.passwordService.hashPassword(password);
          const isActive = true;
          
              if (role === "user") {
                  // Create new user
                  const user = new User (
                    "",
                    name,
                    email,
                    phone,
                    isActive,
                    "",
                    [],
                    0
                  )
                  const newUser = await this.userRepository.create(user, hashedPassword);
                  const userDtos = UserDTO.fromDomain(newUser);
          
                  // Generate tokens with token family
                  const { accessToken, refreshToken, sessionId, tokenFamily } = await this.tokenService.generateToken(role, userDtos.id);

                  // Store token family and refresh token mapping
                  await this.userRepository.storeRefreshToken(userDtos.id, sessionId, refreshToken, tokenFamily);

                  //Notification for Admin
                  const adminMessage = 'New user registered!';
                  const adminNotificationType = Types.NEW_USER;
                  const notification_admin = await this.notificationService.createNotification(
                    Admin.id,
                    adminMessage,
                    adminNotificationType
                  );
                  await this.notificationRepository.create(notification_admin);

                  //Notification for User
                  const userMessage = `Welcome ${newUser?.name}, thank you for joining us! 🌟`;
                  const userNotificationType = Types.WELCOME;
                  const notification_user = await this.notificationService.createNotification(newUser.id,
                  userMessage,
                  userNotificationType
                  );
                  await this.notificationRepository.create(notification_user);
          
                  return { user: userDtos, accessToken, refreshToken };
              } else {
                  const { city, vendor_type } = session.vendor;
                  
                  if (!city || !vendor_type) {
                    throw new BaseError("City and vendor type are required for vendor signup", 400);
                  }
          
                  const vendorType = await this.typeRepository.findByType(vendor_type);
                  if (!vendorType) {
                    throw new BaseError(`Invalid vendor type: ${vendor_type}`, 400);
                  }
          
                  // Create new vendor
                  const vendor = new Vendor (
                    "",
                    email,
                    name,
                    phone,
                    toTitleCase(city),
                    "",
                    "",
                    "",
                    false,
                    false,
                    0,
                    vendor_type.id,
                    true,
                    "",
                    "",
                    []
                  )
                  const newVendor = await this.vendorRepository.create(vendor, hashedPassword);
                  const vendorDto = VendorDTO.fromDomain(newVendor);
          
                  // Generate tokens with token family
                  const { accessToken, refreshToken, sessionId, tokenFamily } = await this.tokenService.generateToken(role, vendorDto.id);

                  // Store token family and refresh token mapping
                  await this.vendorRepository.storeRefreshToken(vendorDto.id, sessionId, refreshToken, tokenFamily);

                  //Notification for Admin
                  const adminNotificationMessage = 'New vendor registered!'
                  const adminNotficationType = Types.NEW_VENDOR;
                  const admin_notification = await this.notificationService.createNotification(Admin.id, adminNotificationMessage, adminNotficationType);
                  await this.notificationRepository.create(admin_notification);

                  //Notification for Vendor
                  const vendorNotificationMessage = 'Hello and welcome to our vendor community! 🌟';
                  const vendorNotificationType = Types.WELCOME;
                  const user_notification = await this.notificationService.createNotification(newVendor.id, vendorNotificationMessage, vendorNotificationType);
                  await this.notificationRepository.create(user_notification);
          
                  return { vendor: vendorDto, accessToken, refreshToken};
              }
    }

    async login(role: string, email: string, password: string): Promise<LoginResponse> {
      const repository = role === "user" ? this.userRepository :
                       role === "vendor" ? this.vendorRepository
                                         : this.adminRepository;
      const existing = await repository.findByEmail(email);
      if (!existing) {
        throw new BaseError(`${role} not exists..`, 404);
      }

      const existingPwd = await repository.getPwdById(existing.id);
      if (!existingPwd) {
        throw new BaseError("Server Error: Couldn't find password for this user, please try again!", 500);
      }
      
      const passwordMatch = await bcrypt.compare(password, existingPwd);
      if (!passwordMatch) {
        throw new BaseError("Incorrect password..", 401);
      }
      
      if (role !== "admin") {
        const person = role === "user" ? await this.userRepository.findByEmail(email)
                                       : await this.vendorRepository.findByEmail(email);
        if (person && person.isActive === false) {
          throw new BaseError(`Blocked by Admin..`, 403);
        }
      }

      // Invalidate all previous refresh tokens for this user
      await repository.invalidateAllRefreshTokens(existing.id);
      
      // Generate new tokens with new token family
      const { accessToken, refreshToken, sessionId, tokenFamily } = await this.tokenService.generateToken(role, existing.id);

      // Store new token family
      await repository.storeRefreshToken(existing.id, sessionId, refreshToken, tokenFamily);
      
      const response: LoginResponse = {
        refreshToken,
        accessToken,
        message: "Successfully logged in..",
      };
      
      // Role-specific data key
      if (role === "vendor") {
        const vendor = existing as Vendor;
        const vendorDtos = VendorDTO.fromDomain(vendor);
        response.vendorData = vendorDtos; // Adding vendorData for vendor role
      } else if (role === "admin") {
        const admin = existing as Admin;
        const adminDtos = AdminDTO.fromDomain(admin);
        response.adminData = adminDtos; // Adding adminData for admin role
      } else {
        const user = existing as User;
        const userDtos = UserDTO.fromDomain(user);
        response.userData = userDtos; // Adding userData for user role
      }

      return response;
    }

    async forgotPwdOtp(role: string, email: string, req: Request): Promise<{message: string, email: string}> {
      const existing = role === "user" ? await this.userRepository.findByEmail(email) :
                                         await this.vendorRepository.findByEmail(email);
      if (!existing) {
        throw new BaseError(`${role} not found..`, 404);
      }

      const otp = await this.emailService.sendOtp(email);
      req.session.otpData = {
        otpCode: otp,
        email: email,
        otpSetTimestamp: Date.now(),
        isExpired: false
      };

      return {
        message: `OTP sent to ${role} email for password updation request `,
        email: email,
      };
    }

    async verifyOtp(receivedOtp: string, session: Session & Partial<SessionData>): Promise<{message: string}> {
      const generatedOtp = session.otpData?.otpCode as string;

      if (!session.otpData) {
        throw new BaseError("OTP session not found", 400);
      }
      
      if (session.otpData.isExpired) {
        throw new BaseError("OTP Expired. Try to resend OTP", 400);
      }

      if (receivedOtp !== generatedOtp) {
        throw new BaseError("Invalid OTP !!", 400);
      }

      return { message: "Otp verified successfully" };
    }

    async reset(role: string, password: string, confirmPassword: string, email: string): Promise<boolean> {
      if (password !== confirmPassword) {
        return false;
      }
      
      const hashedPassword = await this.passwordService.hashPassword(password);

      let status;
      if (role === "user") {
        status = await this.userRepository.updatePassword(hashedPassword, email);
      } else {
        status = await this.vendorRepository.updateVendorPassword(hashedPassword, email);
      }
        
      if (status.success) {
        // Invalidate all existing tokens after password reset
        const user = role === "user" 
            ? await this.userRepository.findByEmail(email)
            : await this.vendorRepository.findByEmail(email);
            
        if (user) {
            const repository = role === "user" ? this.userRepository : this.vendorRepository;
            await repository.invalidateAllRefreshTokens(user.id);
        }

        return true;
      } else {
        throw new BaseError("Failed to reset password", 500);
      }
    }

    async resendSignupOtp(req: Request, role: string): Promise<boolean> {
      const sessionData = role === "user" ? req.session.user : req.session.vendor;
      if (!sessionData) {
        throw new BaseError("Session data not found. Please sign up again.", 400);
      }
      const OTP_VALIDITY_DURATION = 2 * 60 * 1000; // 2 minutes
        const timeElapsed = Date.now() - sessionData.otpSetTimestamp;

        if (timeElapsed >= OTP_VALIDITY_DURATION) {
            const email = sessionData.email;
            const newOtp = await this.emailService.sendOtp(email);
    
          if (role === "user" && req.session.user) {
            req.session.user.otpCode = newOtp;
            req.session.user.otpSetTimestamp = Date.now();
            req.session.user.isExpired = false;
          } else if (role === "vendor" && req.session.vendor) {
            req.session.vendor.otpCode = newOtp;
            req.session.vendor.otpSetTimestamp = Date.now();
            req.session.vendor.isExpired = false;
          } else {
            throw new BaseError("Some error occurred. Please try again.", 500);
          }

            return true;
        } else {
            return false;
        }
    }

    async resendResetPasswordOtp(req: Request): Promise<boolean> {
      if (!req.session.otpData) {
        throw new BaseError("OTP session not found", 400);
      }
      const OTP_VALIDITY_DURATION = 2 * 60 * 1000; // 2 minutes
        const timeElapsed = Date.now() - req.session.otpData.otpSetTimestamp;

        if (timeElapsed >= OTP_VALIDITY_DURATION) {
            const email = req.session.otpData.email;
            const newOtp = await this.emailService.sendOtp(email);
    
            req.session.otpData.otpCode = newOtp;
            req.session.otpData.otpSetTimestamp = Date.now();
            req.session.otpData.isExpired = false;

            return true;
        } else {
            return false;
        }
    }

    async gLogin(token: string): Promise<LoginResponse> {
      console.log("Received token:", token);
      
      // Decode the JWT token
      const decodedData = jwt.decode(token) as DecodedData | null;
      if (!decodedData) {
        throw new BaseError("Invalid Google token.", 400);
      }
      console.log("Decoded data:", decodedData);
      const { name, email, jti } = decodedData;

      const existingUser = await this.userRepository.findByEmail(email);

      if (existingUser && existingUser.isActive === false) {
            throw new BaseError("Blocked by Admin", 403);
      }

      let userDtos: UserDTO;
      if (!existingUser) {
        const isActive: boolean = true;
        const user = new User (
          "",
          name,
          email,
          0,
          isActive,
          "",
          [],
          0
        );
        const newUser = await this.userRepository.create(user, jti);
        userDtos = UserDTO.fromDomain(newUser);
      } else {
        userDtos = UserDTO.fromDomain(existingUser);
        // Invalidate all previous refresh tokens
        await this.userRepository.invalidateAllRefreshTokens(existingUser.id);
      }
      const role = "user";

      // Generate tokens
      const { accessToken, refreshToken, sessionId, tokenFamily } = await this.tokenService.generateToken(role, userDtos.id);
        
      // Store token family
      await this.userRepository.storeRefreshToken(userDtos.id, sessionId, refreshToken, tokenFamily);
      
      const response: LoginResponse = {
        refreshToken,
        accessToken,
        userData: userDtos,
        message: "Successfully logged in..",
      };
      
      return response;
    }

    // Token refresh with reuse detection
    async createToken(role: string, refreshToken: string) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;

        const repository = role === "user" ? this.userRepository :
                           role === "vendor" ? this.vendorRepository
                                             : this.adminRepository;

        // Check if refresh token exists and is valid
        const storedToken = await repository.getRefreshToken(decoded.userId, decoded.sessionId);

        if (!storedToken) {
            // Token reuse detected - invalidate all tokens for this user
            console.error(`Token reuse detected for user ${decoded.userId}`);
            await repository.invalidateTokenFamily(decoded.userId, decoded.tokenFamily!);
            throw new BaseError('Token reuse detected. Please log in again.', 401);
        }

        if (storedToken !== refreshToken) {
            // Token mismatch - possible attack
            console.error(`Token mismatch for user ${decoded.userId}`);
            await repository.invalidateTokenFamily(decoded.userId, decoded.tokenFamily!);
            throw new BaseError('Invalid refresh token. Please log in again.', 401);
        }

        // Generate new tokens with same token family
        const newToken = await this.tokenService.generateToken(role, decoded.userId, decoded.tokenFamily);
            
        // Update stored refresh token
        await repository.updateRefreshToken(decoded.userId, decoded.sessionId, newToken.refreshToken);

        return { 
            accessToken: newToken.accessToken, 
            refreshToken: newToken.refreshToken 
        };
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new BaseError('Refresh token expired. Please log in again.', 401);
        }
        throw error;
      }
    }
    
    async delete(role: string, refreshToken: string): Promise<number> {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
      
        const repository = role === "user" ? this.userRepository :
                           role === "vendor" ? this.vendorRepository
                                             : this.adminRepository;

        // Validate token exists
        const storedToken = await repository.getRefreshToken(decoded.userId, decoded.sessionId);
        if (storedToken !== refreshToken) {
            throw new BaseError('Invalid refresh token', 401);
        }
      
        // Delete specific refresh token
        return await repository.deleteRefreshToken(decoded.userId, decoded.sessionId);
      } catch (error) {
          if (error instanceof jwt.TokenExpiredError) {
              // Even if token is expired, try to delete it
              const decoded = jwt.decode(refreshToken) as TokenPayload;
              const repository = role === "user" ? this.userRepository :
                                 role === "vendor" ? this.vendorRepository
                                                   : this.adminRepository;
              return await repository.deleteRefreshToken(decoded.userId, decoded.sessionId);
          }
          throw error;
        }
    }
}