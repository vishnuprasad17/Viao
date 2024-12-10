import bcrypt from "bcrypt";
import userRepository from "../data-access/auth.repo"
import { BaseError } from "../../../shared/error/base.error";
import generateOtp from "../../../shared/utils/generate.otp";




class UserPasswordService {
    async generateOtpForPassword(email: string) {
        try {
          const otpCode = await generateOtp(email);
          if (!otpCode) {
            throw new BaseError("Failed to generate OTP.", 500)
          }
          return otpCode; 
        } catch (error) {
          console.error("Error in generateOtpForPassword:", error)
        throw new BaseError("Failed to generate OTP for password reset.", 500);
        }
      }
    
      async ResetPassword(password: string, email: string) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          const status = await userRepository.UpdatePassword(hashedPassword, email);
          if (!status.success) {
            throw new Error(status.message);
          }
        } catch (error) {
          console.error("Error in ResetPassword:", error)
          throw new BaseError("Failed to reset password.", 500);
        }
      }
}

export default new UserPasswordService();