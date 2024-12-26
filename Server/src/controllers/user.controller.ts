import { Request, Response } from "express";
import dotenv from "dotenv";
import user from"../models/user.model";
import { asyncHandler } from "../shared/middlewares/async-handler";
import { userService } from "../services";
import crypto from "crypto";
import sharp from "sharp";
import { S3Client, PutObjectCommand, GetObjectCommand,ObjectCannedACL } from "@aws-sdk/client-s3";
import { BaseError } from "../shared/error/base.error";

dotenv.config();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  region: process.env.BUCKET_REGION!,
});

const randomImg = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

class UserController {
  contactMessage = asyncHandler("ContactMessage")(async (req: Request, res: Response): Promise<void> => {
          
      const {name,email,mobile,subject,message}=req.body;
    
      const data = await userService.sendEmail(name,email,mobile,subject,message);
      res.status(200).json(data);
        
  })

  updateProfile = asyncHandler("updateProfile")(async (req: Request, res: Response): Promise<void> => {
    const name = req.body.name;
    const phone = parseInt(req.body.phone);
    const userId: string = req.query.userid as string;

    let imgName = "";
    let imgUrl = "";

    // Check if a file was uploaded
    if (req.file) {
      // Resize the image
      const buffer = await sharp(req.file.buffer)
        .resize({ height: 1200, width: 1200, fit: "contain" })
        .toBuffer();

      imgName = `${randomImg()}.jpg`;

      const params = {
        Bucket: process.env.BUCKET_NAME!,
        Key: imgName,
        Body: buffer,
        ContentType: req.file.mimetype,
      };

      // Upload the image to S3
      const command = new PutObjectCommand(params);
      await s3.send(command);

      // Generate the image URL
      imgUrl = `${process.env.IMAGE_URL}/${imgName}`;
    }

    const user = await userService.updateProfile(name, phone, userId, imgUrl);
    res.status(201).json(user);
  });

  updatePassword = asyncHandler("UpdatePassword")(async (req: Request, res: Response) => {
      const currentPassword = req.body.current_password;
      const newPassword = req.body.new_password;
      const userId: string = req.query.userid as string;

      let status = await userService.checkCurrentPassword(currentPassword, userId)

      if (!status) {
        throw new BaseError('Current password is incorrect!', 400);
      }

      const data = await userService.UpdatePassword(newPassword, userId);

      if (!data) {
        res.status(400).json({ error: "Couldn't update password... Please try again." });
      }
      res.status(200).json({ message: "Password updated successfully." });
  })

  getFavoriteVendors = asyncHandler("GetFavouriteVendors")(async (req: Request, res: Response): Promise<void> => {
      const userId: string = req.query.userid as string;
      const page: number = parseInt(req.query.page as string) || 1;
      const pageSize: number = parseInt(req.query.pageSize as string) || 8;

      if (!userId) {
        res.status(400).json({ error: "Invalid user id." });
      }
      const {result,totalFavsCount} = await userService.FavoriteVendors( userId,page,pageSize);
      const totalPages = Math.ceil(totalFavsCount / pageSize);
      if (result) {
        res.status(200).json({ data:result,totalPages: totalPages});
      } else {
        res.status(400).json({ message: "No vendors in favorites." });
      }
  })


  deleteFavoriteVendor = asyncHandler("DeleteFavouriteVendor")(async (req: Request, res: Response): Promise<void> => {
      const vendorId: string = req.query.vendorId as string;
      const userId:string = req.query.userId as string;

      if (!userId) {
        res.status(400).json({ error: "Invalid user id." });
      }
      const result = await userService.deleteFromFavorite(userId,vendorId);
      if (result) {
        res.status(200).json({userData:result});
      } else {
        res.status(400).json({ message: "No vendors in favorites." });
      }
  })

  allUsers = asyncHandler("AllUsers")(async (req: Request, res: Response): Promise<void> => {
    console.log("get")
      const { page = 1, limit = 6, search = "" } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      const users = await userService.getUsers(pageNumber, limitNumber, search.toString());
      const totalUsers = await userService.getUsersCount();

      res.status(200).json({ users, totalUsers });
    
  })

  Toggleblock = asyncHandler("AllUsers")(async (req: Request, res: Response): Promise<void> => {
      const userId: string | undefined = req.query.userId as string | undefined;
      if (!userId) {
        res.status(400).json({ message: "User ID is missing or invalid." });
        return;
      }
      await userService.toggleUserBlock(userId);
      let process = await user.findOne({ _id: userId });
      let status = !process?.isActive ? "blocked" : "unblocked"
      res.status(200).json({
        message: `User ${status} successfully.`,
        process: !process?.isActive ? "block" : "unblock",
      });
    
  })

  AddFavVendor = asyncHandler("AddFavouriteVendor")(async (req: Request, res: Response): Promise<void> => {
      const vendorId: string = req.query.vendorId as string;
      const userId: string = req.query.userId as string;
    
      if (!vendorId) {
        res.status(400).json({ error: "Invalid vendor id." });
      }
      if (!userId) {
        res.status(400).json({ error: "Invalid user id." });
      }
       
          
      const data = await userService.FavoriteVendor(vendorId, userId);
      const userData=await userService.findUser(userId)
    
      if (data) {
        res.status(200).json({ message: "vendor added to Favorite list..",fav:true ,userData});
      } else {
        res.status(200).json({ message: "vendor removed from favorites",fav:false,userData });
      }    
    })

}

export default new UserController();