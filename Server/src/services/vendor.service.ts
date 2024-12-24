import bcrypt from "bcrypt";
import vendorRepository from "../data-access/vendor.repository";
import { IVendorDocument } from "../interfaces/vendor.interface";
import { BaseError } from "../shared/error/base.error";

function toTitleCase(city: string): string {
  return city.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

class VendorService {
    async getSingleVendor(vendorId: string): Promise<IVendorDocument> {
        try {
          const Vendor = await vendorRepository.getById(vendorId);
          if (!Vendor) {
            throw new BaseError("Vendor not found.", 404);
          }
          return Vendor;
        } catch (error) {
          console.error("Error in getSingleVendor:", error);
          throw new BaseError("Failed to retrieve vendor.", 500);
        }
      }

    async verificationRequest(vendorId: string) {
    try {
      const data = await vendorRepository.requestForVerification(vendorId);
      return data;
    } catch (error) {
      console.error("Error in verificationRequest:", error);
      throw new BaseError("Failed to request verification.", 500);
    }
  }

    async updateVendor(
    vendorId: string,
    formData: any,
    coverpicUrl: string | undefined,
    logoUrl: string | undefined,
    logo: string | undefined,
    coverpic: string | undefined
  ): Promise<any> {
    try {
      const update = {
        name: formData.name,
        city: toTitleCase(formData.city),
        phone: parseInt(formData.phone),
        coverpicUrl: coverpicUrl,
        logoUrl: logoUrl,
        logo: logo,
        coverpic: coverpic,
        about:formData.about
      };
      await vendorRepository.update(vendorId, update);
      const updatedVendor = await vendorRepository.getById(vendorId);

      return updatedVendor;
    } catch (error) {
      console.error("Error in updateVendor:", error);
      throw new BaseError("Failed to update vendor.", 500);
    }
  }

    async checkCurrentPassword(currentpassword: string, vendorId: string) {
     try {
        const existingVendor = await vendorRepository.getById(vendorId);
        console.log(existingVendor);
        console.log(vendorId)

        if (!existingVendor) {
          throw new BaseError("Vendor not found", 404);
        }

        const passwordMatch = await bcrypt.compare(
        currentpassword,
        existingVendor.password
        );
        if (!passwordMatch) {
          throw new BaseError("Password doesn't match", 401);
        }

        return passwordMatch;
      } catch (error) {
        console.error("Error in checkCurrentPassword:", error);
        throw error;
      }
    }

    async UpdatePasswordService(newPassword: string, vendorId: string) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const existingUser = await vendorRepository.getById(vendorId);
        if (!existingUser) {
          throw new BaseError("user not found", 404);
        }
        const email = existingUser.email;

        const updatedValue = await vendorRepository.UpdatePassword(
          hashedPassword,
          email
        );
        if (updatedValue) {
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error in UpdatePasswordService:", error);
        throw error;
      }
    }

    async addDateAvailability(vendorId: string, status: string, date: string) {
      try {
        const data = await vendorRepository.changeDateAvailability(
          vendorId,
          status,
          date
        );
        return data;
      } catch (error) {
        console.error("Error in addDateAvailability:", error);
        throw new BaseError("Failed to add date availability.", 500);
      }
    }
  
    async getAllDates(vendorId: string) {
      try {
        const data = await vendorRepository.getById(vendorId);
        return data?.bookedDates;
      } catch (error) {
        console.error("Error in getAllDates:", error);
        throw new BaseError("Failed to get all dates.", 500);
      }
    }

    async getVendors(
      page: number,
      limit: number,
      search: string,
      category: string,
      location: string,
      sortValue: number
    ) {
      try {
        const vendors = await vendorRepository.findAllVendors(
          page,
          limit,
          search,
          category,
          location,
          sortValue
        );
        return vendors;
      } catch (error) {
        console.error("Error in getVendors:", error);
        throw new BaseError("Failed to get vendors.", 500);
      }
    }
  
    async toggleVendorBlock(vendorId: string): Promise<void> {
      try {
        const Vendor = await vendorRepository.getById(vendorId);
        if (!Vendor) {
          throw new BaseError("Vendor not found.", 404);
        }
  
        Vendor.isActive = !Vendor.isActive; // Toggle the isActive field
        await Vendor.save();
      } catch (error) {
        console.error("Error in toggleVendorBlock:", error);
        throw new BaseError("Failed to toggle vendor block.", 500);
      }
    }

    async changeVerifyStatus(vendorId: string, status: string) {
      try {
        const data = await vendorRepository.updateVerificationStatus(
          vendorId,
          status
        );
        return data;
      } catch (error) {
        console.error("Error in changeVerifyStatus:", error);
        throw new BaseError("Failed to change verification status.", 500);
      }
    }

}

export default new VendorService();