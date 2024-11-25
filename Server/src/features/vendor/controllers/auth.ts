import { Request , Response } from "express";
import { signup } from "../services/signup.service";
import { login } from "../services/login.service";


export const VendorController = {

    async vendorSignup(req: Request, res: Response): Promise<void> {
        try {
          const { email , password , name , phone , city } = req.body;
          const vendor = await signup(email , password , name , phone , city);
          res.status(201).json(vendor);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server Error' });
        }
      },



      async VendorLogin(req:Request , res: Response): Promise <void> {
        try {
            const {email,password} = req.body;
            const token = await login(email,password);
            res.status(201).json({message:"vendor logged in successfully..."});
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"Server Error"})

        }
      } ,


      async VendorLogout(req:Request , res: Response): Promise <void> {
        try {
          // localStorage.removeItem('jwtToken');
          res.status(200).json({ message: 'vendor logged out successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"Server Error"})

        }
      }

}