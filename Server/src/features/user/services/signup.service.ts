import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser , findUserByEmail } from '../data-access/auth.repo';




export const signup = async (email:string ,password:string, name:string , phone:number): Promise<object> => {
    try {
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const isActive:boolean = true;
      const newUser = await createUser({ email , password: hashedPassword , name , phone , isActive });

      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET!);
      return {token:token,user:newUser};
    } catch (error) {
      throw error;
    }
  };