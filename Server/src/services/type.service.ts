import VendorTypeRepository from "../data-access/vendortype.repository"
import { BaseError } from "../shared/error/base.error";




class VendorTypeService {

    async getTypes() {
        try {
          const availableTypes = await VendorTypeRepository.getAll();
          return availableTypes;
        } catch (error) {
          console.error("Error in getTypes:", error)
          throw new BaseError("Failed to retrieve vendor types.", 500);
        }
      }
}

export default new VendorTypeService();