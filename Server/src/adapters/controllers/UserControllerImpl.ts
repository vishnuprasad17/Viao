import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { asyncHandler } from "../middlewares/async-handler";
import TYPES from '../../domain/constants/inversifyTypes';
import { UserUseCase } from '../../domain/interfaces/application interfaces/UserUseCase';
import { UserController } from "../../domain/interfaces/adapter interfaces/UserController";

injectable()
export class UserControllerImpl implements UserController{
    constructor(@inject(TYPES.UserUseCase) private userUseCase: UserUseCase) {}

    contactMessage = asyncHandler("ContactMessage")(async (req: Request, res: Response): Promise<void> => {
        const userData = req.body;
        const data = await this.userUseCase.contact(userData);
        res.status(200).json({ message: "Contact form submitted successfully." });
      });

    updateProfile = asyncHandler("updateProfile")(async (req: Request, res: Response): Promise<void> => {
        const name = req.body.name;
        const phone = parseInt(req.body.phone);
        const userId: string = req.query.userid as string;
        const file = req.file;
        const user = await this.userUseCase.update(name, phone, userId, file);
        res.status(201).json(user);
      });

    updatePassword = asyncHandler("UpdatePassword")(async (req: Request, res: Response): Promise<void> => {
        const currentPassword = req.body.current_password;
        const newPassword = req.body.new_password;
        const userId: string = req.query.userid as string;
        const data = await this.userUseCase.updatePwd(currentPassword, newPassword, userId);
        if (!data) {
          res.status(400).json({ error: "Couldn't update password... Please try again." });
        }
          res.status(200).json({ message: "Password updated successfully." });
      });

    deleteFavoriteVendor = asyncHandler("DeleteFavouriteVendor")(async (req: Request, res: Response): Promise<void> => {
        const vendorId: string = req.query.vendorId as string;
        const userId:string = req.query.userId as string;
    
        if (!userId) {
          res.status(400).json({ error: "Invalid user id." });
        }
        const result = await this.userUseCase.deleteFromFavorite(userId,vendorId);
        if (result) {
          res.status(200).json({userData:result});
        } else {
          res.status(400).json({ message: "No vendors in favorites." });
        }
      })

    allUsers = asyncHandler("AllUsers")(async (req: Request, res: Response): Promise<void> => {
        const { page = 1, limit = 6, search = "" } = req.query;
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
    
        const { users, totalUsers } = await this.userUseCase.getUsers(pageNumber, limitNumber, search.toString());
    
        res.status(200).json({ users, totalUsers });
      })

    toggleBlock = asyncHandler("BlockUser")(async (req: Request, res: Response): Promise<void> => {
        const userId: string | undefined = req.query.userId as string | undefined;
        if (!userId) {
          throw new Error("User ID is missing or invalid.");
          return
        }
        const updated = await this.userUseCase.toggleUserBlock(userId);
        const status = updated.isActive === false ? "blocked" : "unblocked"
        res.status(200).json({
          message: `User ${status} successfully.`,
          process: updated.isActive === false ? "block" : "unblock",
      });
        
      })

    addFavVendor = asyncHandler("AddFavouriteVendor")(async (req: Request, res: Response): Promise<void> => {
        const vendorId: string = req.query.vendorId as string;
        const userId: string = req.query.userId as string;
        
        if (!vendorId) {
          res.status(400).json({ error: "Invalid vendor id." });
        }
         if (!userId) {
          res.status(400).json({ error: "Invalid user id." });
        }   
              
        const { status, data } = await this.userUseCase.favoriteVendor(vendorId, userId);
        
        if (status) {
          res.status(200).json({ message: "vendor added to Favorite list..",fav:true ,userData: data});
        } else {
          res.status(200).json({ message: "vendor removed from favorites",fav:false,userData: data });
        }    
      })

    getUser = asyncHandler("GetUserForChat")(async (req: Request, res: Response): Promise<void> => {
            
          const userId:string = req.query.userId as string;
      
          const data = await this.userUseCase.findUser(userId);
          res.status(200).json(data);
      })

    getWallet = asyncHandler("GetWallet")(async (req: Request, res: Response): Promise<void> => {
            
      const userId:string = req.query.userId as string;
      const data = await this.userUseCase.getBalance(userId);
      
      res.status(200).json({ walletBalance: data});
  })
}