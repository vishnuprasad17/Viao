import User from "../models/user.model";
import { IUserDocument } from "../interfaces/model.interface";


export const createUser = async (userData: Partial<IUserDocument>): Promise<IUserDocument> => {
    try {
      return await User.create(userData);
    } catch (error) {
      throw error;
    }
  };

  export const findUserByEmail = async (email: string): Promise<IUserDocument | null> => {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw error;
    }
  };