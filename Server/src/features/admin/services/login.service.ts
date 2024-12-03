import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findAdminByEmail } from '../data-access/auth.repo';
import { IAdminLoginResponse } from '../interfaces/auth.interface';

export const adminLogin = async (email: string, password: string): Promise<IAdminLoginResponse> => {
  try {
    const existingAdmin = await findAdminByEmail(email);
    if (!existingAdmin) {
      throw new Error('Admin not found');
    }

    const passwordMatch = await bcrypt.compare(password, existingAdmin.password);
    if (!passwordMatch) {
      throw new Error('Incorrect password');
    }

    const token = jwt.sign({ _id: existingAdmin._id }, process.env.JWT_SECRET!, { expiresIn: '1h'})
    return { token, adminData: existingAdmin, message: "Successfully logged in.." };
  } catch (error) {
    throw error;
  }
};
