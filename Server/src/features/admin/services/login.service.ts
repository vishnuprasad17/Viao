import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findAdminByEmail } from '../data-access/auth.repo';
import { Response } from 'express';

export const adminLogin = async (res: Response, email: string, password: string): Promise<object> => {
  try {
    const existingAdmin = await findAdminByEmail(email);
    if (!existingAdmin) {
      throw new Error('Admin not found');
    }

    const passwordMatch = await bcrypt.compare(password, existingAdmin.password);
    if (!passwordMatch) {
      throw new Error('Incorrect password');
    }

    const token = jwt.sign({ _id: existingAdmin._id }, process.env.JWT_SECRET!)
    return {message:"Login successfull",token:token};
  } catch (error) {
    throw error;
  }
};
