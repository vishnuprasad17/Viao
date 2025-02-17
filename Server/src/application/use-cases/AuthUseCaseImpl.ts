import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { inject, injectable } from "inversify";
import { BaseError } from "../../domain/errors/BaseError";
import { AuthUseCase, SignupParams, VerifyParams, UserSession, VendorSession, OTP, LoginResponse, DecodedData } from "../../domain/interfaces/application interfaces/AuthUseCase";
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
import { TokenService, TokenPayload } from "../../domain/interfaces/adapter interfaces/TokenService";
import dotenv from "dotenv";
import { RedisRepository } from "../../domain/interfaces/infrastructure interfaces/RedisRepository";

dotenv.config();

declare module 'express-session' {
    interface Session {
      user: UserSession;
      vendor: VendorSession;
      otp: OTP;
    }
  }
  declare global {
    namespace Express {
      interface Request {
        role: string;
      }
    }
  }
  
  // Utility to capitalize city names
  function toTitleCase(str: string): string {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );
  }

@injectable()
export class AuthUseCaseImpl implements AuthUseCase  {
    constructor(@inject(TYPES.AdminRepository) private adminRepository: AdminRepository,
                @inject(TYPES.UserRepository) private userRepository: UserRepository,
                @inject(TYPES.VendorRepository) private vendorRepository: VendorRepository,
                @inject(TYPES.TypeRepository) private typeRepository: TypeRepository,
                @inject(TYPES.EmailService) private emailService: EmailService,
                @inject(TYPES.PasswordService) private passwordService: PasswordService,
                @inject(TYPES.NotificationService) private notificationService: NotificationService,
                @inject(TYPES.TokenService) private tokenService: TokenService,
                @inject(TYPES.NotificationRepository) private notificationRepository: NotificationRepository,
                @inject(TYPES.RedisRepository) private redisRepository: RedisRepository) {}

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
          phone: parseInt(phone),
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
            throw new BaseError("OTP Expired...Try to resend OTP !!", 400);
          }
      
          const { email, password, name, phone, otpCode } = Data;
      
          // Validate OTP
          if (otp !== otpCode) {
            throw new BaseError("Invalid OTP.", 400);
          }
      
          const existing = role === "user" ? await this.userRepository.findByEmail(email)
                                           : await this.vendorRepository.findByEmail(email);
          const existingPhone = role === "user" ? await this.userRepository.findByPhone(phone)
                                                : await this.vendorRepository.findByPhone(phone);
          const Admin = await this.adminRepository.findOne({});
          if (!Admin) {
            throw new BaseError("Admin not found", 404);
          }
          if (existing || existingPhone) {
            throw new BaseError(`${role} already exists`, 409);
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
          
                  //Generate tokens
                  const { accessToken, refreshToken, sessionId } = await this.tokenService.generateToken(role, userDtos.id);

                  //Store refresh token in Redis with role prefix
                  await this.redisRepository.set(role, sessionId, refreshToken);
                  //Notification for Admin
                  const adminMessage = 'New user registered!';
                  const adminNotificationType = Types.NEW_USER;
                  const notification_admin = await this.notificationService.createNotification(Admin.id,
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
          
                  return { user: userDtos, accessToken: accessToken, refreshToken: refreshToken };
                } else {
                  const { city, vendor_type } = session.vendor;
                  // Validate city and vendor_type for vendor
                  if (!city || !vendor_type) {
                    throw new BaseError(
                      "City and vendor type are required for vendor signup",
                      400
                    );
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
          
                  //Generate tokens
                  const { accessToken, refreshToken, sessionId } = await this.tokenService.generateToken(role, vendorDto.id);

                  //Store refresh token in Redis with role prefix
                  await this.redisRepository.set(role, sessionId, refreshToken);
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
          
                  return { vendor: vendorDto, accessToken: accessToken, refreshToken: refreshToken};
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
      
            //Generate tokens
            const { accessToken, refreshToken, sessionId } = await this.tokenService.generateToken(role, existing.id);

            //Store refresh token in Redis with role prefix
            await this.redisRepository.set(role, sessionId, refreshToken);
      
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

    async forgotPwdOtp(role: string, email: string, session: Session & Partial<SessionData>): Promise<{message: string, email: string}> {
      const existing = role === "user" ? await this.userRepository.findByEmail(email) :
                                         await this.vendorRepository.findByEmail(email);
      if (!existing) {
        throw new BaseError(`${role} not found..`, 404);
      }
      const otp = await this.emailService.sendOtp(email);
      session.otp = {
        otp: otp,
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
      const generatedOtp = session.otp.otp as string;
      if (session.otp.isExpired) {
        throw new BaseError("OTP Expired...Try to resend OTP !!", 400);
      }

      if (receivedOtp !== generatedOtp) {
        throw new BaseError("Invalid OTP !!", 400);
      }

      console.log(`otp is correct , navigating to update password.`);
      return { message: "Otp is verified..!" };
    }

    async reset(role: string, password: string, confirmPassword: string, session: Session & Partial<SessionData>): Promise<boolean> {
      if (password !== confirmPassword) {
        return false;
      }
      const email = session.otp?.email ?? '';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      let status;
      if (role === "user") {
        status = await this.userRepository.updatePassword(hashedPassword, email);
      } else {
        status = await this.vendorRepository.updateVendorPassword(hashedPassword, email);
      }
        
      if (status.success) {
        return true;
      } else {
        throw new BaseError("Failed to reset password..", 500);
      }
    }

    async resend(sessionData: UserSession | VendorSession | OTP, otp: string): Promise<boolean> {
      if (sessionData.isExpired) {
        const email = sessionData.email;
        const newOtp = await this.emailService.sendOtp(email);
    
        otp = newOtp;
        sessionData.otpSetTimestamp = Date.now();
        sessionData.isExpired = false;

        return true;
      } else {
        return false;
      }
    }

    async gRegister(token: string): Promise<{user: UserDTO}> {
      console.log("Received token:", token);
      
      // Decode the JWT token
      const decodedData = jwt.decode(token) as DecodedData | null;
      if (!decodedData) {
        throw new Error("Invalid Google token.");
      }
      console.log("Decoded data:", decodedData);
      const { name, email, jti } = decodedData;
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new BaseError("User already exists", 404);
      }
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
      )
      const newUser = await this.userRepository.create(user, jti);
      const userDtos = UserDTO.fromDomain(newUser);
      
      return { user: userDtos };
    }

    async gLogin(token: string): Promise<LoginResponse> {
      const decodedData = jwt.decode(token) as DecodedData | null;
      if (!decodedData) {
        throw new BaseError('Invalid credentials', 400);
      }
      const { email, jti } = decodedData;
      const password = jti;
      const existingUser = await this.userRepository.findByEmail(email);
      if (!existingUser) {
        throw new BaseError("User not exists..", 404);
      }
              
      if (existingUser.isActive === false) {
        throw new BaseError("Blocked by Admin..", 404);
      }
              
      const userDtos = UserDTO.fromDomain(existingUser);
      const role = "user";

      //Generate tokens
      const { accessToken, refreshToken, sessionId } = await this.tokenService.generateToken(role, userDtos.id);

      //Store refresh token in Redis with role prefix
      await this.redisRepository.set(role, sessionId, refreshToken);

      const response: LoginResponse = {
        refreshToken,
        accessToken,
        userData: userDtos,
        message: "Successfully logged in..",
      };
      
      return response;
    }

    // Updated refresh token logic
    async createToken(role: string, refreshToken: string) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;

      // Atomic Redis operations
      const storedToken = await this.redisRepository.multi(role, decoded.sessionId);

      if (storedToken !== refreshToken) {
        throw new BaseError('Authentication failed', 401);
      }

      // Generate new tokens and update Redis
      const newToken = await this.tokenService.generateToken(role, decoded.userId);
      await this.redisRepository.set(role, newToken.sessionId, newToken.refreshToken);

      return { accessToken: newToken.accessToken, refreshToken: newToken.refreshToken };
    }
    
    async delete(role: string, refreshToken: string): Promise<number> {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
      
      // Validate with Redis
      const storedToken = await this.redisRepository.get(role, decoded.sessionId);
      if (storedToken!== refreshToken) {
        throw new BaseError('Authentication failed', 401);
      };
      
      // Delete from Redis
      return await this.redisRepository.del(role, decoded.sessionId);
    }
}