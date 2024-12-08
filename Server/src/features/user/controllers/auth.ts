import { Request, Response } from "express";
import { signup } from "../services/signup.service";
import { login } from "../services/login.service";
import { userSignupSchema, userLoginSchema } from "../schemas/auth.schema";
import {
  IUserSignupRequest,
  IUserLoginRequest,
} from "../interfaces/auth.interface";

export const UserAuthController = {
  async UserSignup(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, phone } = req.body as IUserSignupRequest;

      // validating input
      const { error } = userSignupSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }

      const user = await signup(email, password, name, phone);
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  async UserLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as IUserLoginRequest;

      // validating input
      const { error } = userLoginSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }

      const { token, userData, message } = await login(email, password);
      res.cookie('jwtToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.status(200).json({token, userData, message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  async UserLogout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie('jwtToken');
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
};
