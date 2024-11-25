import { IVendorDocument } from "../interfaces/model.interface";
import Vendor from "../models/vendor.model";

export const createVendor = async (vendorData : Partial<IVendorDocument>): Promise<IVendorDocument> => {
    try {
      return await Vendor.create(vendorData);
    } catch (error) {
      throw error;
    }
  };


export const findvendorByEmail = async (email: string): Promise<IVendorDocument | null> => {
    try {
      return await Vendor.findOne({ email });
    } catch (error) {
      throw error;
    }
};