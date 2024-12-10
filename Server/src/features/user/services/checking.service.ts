import { BaseError } from "../../../shared/error/base.error";
import userRepository from "../data-access/auth.repo"



class UserCheckingService {
    async CheckExistingUSer(email: string) {
        try {
          const existingUser = await userRepository.findByEmail(email);
          return existingUser;
        } catch (error) {
          console.error("Error in CheckExistingUSer:", error)
          throw new BaseError("Failed to check existing user.", 500);
        }
      }
}

export default new UserCheckingService();