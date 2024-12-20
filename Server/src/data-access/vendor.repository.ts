import { BaseRepository } from "../shared/data-access/base.repo";
import { IVendorDocument } from "../interfaces/vendor.interface";
import Vendor from "../models/vendor.model";

class VendorRepository extends BaseRepository<IVendorDocument>{
  constructor(){
    super(Vendor)
  }

  async UpdateVendorPassword(password:string , mail:string){
    try {
      const result = await Vendor.updateOne({ email: mail }, { password: password });
      if (result.modifiedCount === 1) {
        return { success: true, message: "Vendor Password updated successfully." };
      } else {
        return { success: false, message: "Vendor not found or password not updated." };
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new VendorRepository();