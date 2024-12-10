import bcrypt from "bcrypt";
import vendorRepository from "../data-access/auth.repo"
import { BaseError } from "../../../shared/error/base.error";

class VendorPasswordService {
    async CheckExistingVendor(email: string) {
        try {
          const existingVendor = await vendorRepository.findByEmail(email);
          return existingVendor;
        } catch (error) {
          console.error("Error in CheckExistingVendor:", error);
          throw new BaseError("Failed to check existing vendor.", 500);
        }
      }

      async ResetVendorPasswordService(password: string, email: string) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          const status = await vendorRepository.UpdateVendorPassword(
            hashedPassword,
            email
          );
          if (!status.success) {
            throw new BaseError("Failed to reset password.", 500);
          }
        } catch (error) {
          console.error("Error in ResetVendorPasswordService:", error);
          throw new BaseError("Failed to reset vendor password.", 500);
        }
      }
}

export default new VendorPasswordService();