import { Request, Response } from "express";
import { vendorTypeService } from "../services";
import crypto from "crypto";
import {
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import vendorTypeModel from "../models/vendortype.model";
import { asyncHandler } from "../shared/middlewares/async-handler";

const randomImage = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

dotenv.config();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  region: process.env.BUCKET_REGION!,
});

class VendorTypeController {
  addVendorType = asyncHandler("AddVendorType")(async (req: Request, res: Response): Promise<void> => {
      const { type, status } = req.body;
      const file=req.file;

      const image = randomImage();

      const params = {
        Bucket: process.env.BUCKET_NAME!,
        Key: image,
        Body: file?.buffer,
        ContentType: file?.mimetype,
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);

      let imageUrl=`${process.env.IMAGE_URL}/${image}`;

      const vendor = await vendorTypeService.addType(type, status,image,imageUrl);
      res.status(201).json(vendor);
    
  })

  getVendorTypes = asyncHandler("GetVendorType")(async (req: Request, res: Response): Promise<void> => {
      const vendorTypes = await vendorTypeService.getTypes();
      res.status(200).json(vendorTypes);
    
  })

  deleteVendorType = asyncHandler("DeleteVendorType")(async (req: Request, res: Response): Promise<void> => {
      const vendorTypeId: string | undefined = req.query?.id as
        | string
        | undefined;

      if (!vendorTypeId) {
        res
          .status(400)
          .json({ message: "Vendor Type ID is missing or invalid." });
        return;
      }

      const result = await vendorTypeService.deleteType(vendorTypeId);
      res.status(200).json({ message: "Vendor deleted successfully" });
    
  })

  LoadSingleType = asyncHandler("LoadSingleType")(async (req: Request, res: Response): Promise<void> => {
      const vendorTypeId: string | undefined = req.query?.id as
        | string
        | undefined;

      if (!vendorTypeId) {
        res
          .status(400)
          .json({ message: "Vendor Type ID is missing or invalid." });
        return;
      }

      const result = await vendorTypeService.getSingleType(vendorTypeId);
      res.status(200).json(result);
    
  })

  updateType = asyncHandler("UpdateType")(async (req: Request, res: Response): Promise<void> => {
      const vendorTypeId: string | undefined = req.query?.id as
        | string
        | undefined;

      if (!vendorTypeId) {
        res
          .status(400)
          .json({ message: "Vendor Type ID is missing or invalid." });
        return;
      }
      const vendorType=await vendorTypeModel.findOne({_id:vendorTypeId})
      console.log(req.file)
      const { type, status } = req.body;
      let image=vendorType?.image;
      let imageUrl=vendorType?.imageUrl;
      if(req.file){
        const file=req.file;

        image = randomImage();
  
        const params = {
          Bucket: process.env.BUCKET_NAME!,
          Key: image,
          Body: file?.buffer,
          ContentType: file?.mimetype,
        };
  
        const command = new PutObjectCommand(params);
        await s3.send(command);
        imageUrl=`${process.env.IMAGE_URL}/${image}`;
      }

      const result = await vendorTypeService.updateVendorType(
        vendorTypeId,
        type,
        status,
        image!,
        imageUrl!
      );
      res.status(200).json(result);
    
  })
}

export default new VendorTypeController();