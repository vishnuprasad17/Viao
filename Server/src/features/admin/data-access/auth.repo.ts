import Admin from "../models/admin.model";
import { IAdminDocument } from "../interfaces/model.interface";
export const findAdminByEmail = async (email: string): Promise<IAdminDocument | null> => {
  try {
    return await Admin.findOne({ email });
  } catch (error) {
    throw error;
  }
};