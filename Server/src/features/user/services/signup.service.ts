import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import userRepository from "../data-access/auth.repo"
import { BaseError } from '../../../shared/error/base.error';



class UserSignupService {
  async signup (email:string ,password:string, name:string , phone:number, res:Response): Promise<object> {
    try {
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        throw new BaseError('User already exists', 404);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const isActive:boolean = true;
      const newUser = await userRepository.create({ email , password: hashedPassword , name , phone , isActive });

      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET!,{expiresIn:'15d'});
      res.cookie("jwtUser",token,{
        maxAge:15*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure: process.env.NODE_ENV === "production"
    })
    return {user:newUser};
    } catch (error) {
      console.log("Error during signup:", error);
      throw new BaseError("Failed to signup. Please try again", 500);
    }
  };
}

export default new UserSignupService();