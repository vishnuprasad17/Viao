import { Request, Response } from "express";
import { vendorService } from "../services";
import vendor from "../models/vendor.model"
import {
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { asyncHandler } from "../shared/middlewares/async-handler";
import { BaseError } from "../shared/error/base.error";

dotenv.config();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  region: process.env.BUCKET_REGION!,
});

class VendorController {
    getVendor = asyncHandler("GetVendor")(async (req: Request, res: Response): Promise<void> => {
          const vendorId: string = req.query.vendorid as string; // or req.query.Id?.toString()
    
          if (!vendorId) {
            res.status(400).json({ error: "Vendor ID is required." });
            return;
          }
    
          const data = await vendorService.getSingleVendor(vendorId);
          if (!data) {
            res.status(400).json({ error: "Vendor not found , error occured" });
          } else {
            res.status(200).json({ data: data });
          }
        
      })

    sendVerifyRequest = asyncHandler("VerifyRequest")(async (req: Request, res: Response): Promise<void> => {
          const vendorId: string = req.body.vendorId as string;
          const result = await vendorService.verificationRequest(vendorId);
          res.status(200).json(result);
      })

    updateProfile = asyncHandler("UpdateVendorProfile")(async (req: Request, res: Response): Promise<void> => {
          const vendorId: string = req.query.vendorid as string; // Assuming vendorId is sent in the request body
          const formData = req.body;
    
          let coverpicFile,
            coverpicUrl = "";
          let logoFile,
            logoUrl = "";
    
          if (req.files) {
            if (
              typeof req.files === "object" &&
              "coverpic" in req.files &&
              Array.isArray(req.files["coverpic"])
            ) {
              coverpicFile = req.files["coverpic"][0];
              const coverpicUploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: coverpicFile?.originalname,
                Body: coverpicFile?.buffer,
                ContentType: coverpicFile?.mimetype,
              };
    
           
    
              const covercommand = new PutObjectCommand(coverpicUploadParams);
              await s3.send(covercommand);
              
              coverpicUrl=`${process.env.IMAGE_URL}/${coverpicFile?.originalname}`
            }
    
            if (
              typeof req.files === "object" &&
              "logo" in req.files &&
              Array.isArray(req.files["logo"])
            ) {
              logoFile = req.files["logo"][0];
              const logoUploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: logoFile?.originalname,
                Body: logoFile?.buffer,
                ContentType: logoFile?.mimetype,
              };
    
              const logocommand = new PutObjectCommand(logoUploadParams);
              await s3.send(logocommand);
              
              logoUrl=`${process.env.IMAGE_URL}/${logoFile?.originalname}`
            }
          }
    
          const vendor = await vendorService.getSingleVendor(vendorId);
          console.log(formData)
    
          const updatedVendor = await vendorService.updateVendor(
            vendorId,
            formData,
            coverpicUrl ? coverpicUrl : vendor.coverpicUrl,
            logoUrl ? logoUrl : vendor.logoUrl,
            logoFile?.originalname ? logoFile?.originalname : vendor.logo,
            coverpicFile?.originalname
              ? coverpicFile?.originalname
              : vendor.coverpic
          );
    
          res.status(200).json(updatedVendor);
      })

    updatePassword = asyncHandler("UpdateVendorPassword")(async (req: Request, res: Response): Promise<void> => {
          console.log(req.body);
    
          const currentPassword = req.body.current_password;
          const newPassword = req.body.new_password;
          const vendorId: string = req.query.vendorid as string;
          console.log(vendorId);
    
          let status = await vendorService.checkCurrentPassword(
            currentPassword,
            vendorId
          );
    
          if (!status) {
            throw new BaseError(`Current password is wrong!`, 400);
          }
    
          const data = await vendorService.UpdatePasswordService(
            newPassword,
            vendorId
          );
    
          if (!data) {
            res
              .status(400)
              .json({ error: "couldn't update password..internal error." });
          }
          res.status(200).json({ message: "password updated successfully.." });
        
      })

    loadDates = asyncHandler("LoadDates")(async (req: Request, res: Response): Promise<void> => {
          const vendorId: string = req.query.vendorId as string;
          const bookedDates = await vendorService.getAllDates(vendorId);
          res.status(200).json({ bookedDates });
      })
    
    addDates = asyncHandler("AddDates")(async (req: Request, res: Response): Promise<void> => {
          const vendorId: string = req.body.vendorId as string;
          const status = req.body.status;
          const date = req.body.date;
          console.log(vendorId, status, date);
          const bookedDates = await vendorService.addDateAvailability(
            vendorId,
            status,
            date
          );
          res.status(200).json({ bookedDates, message: "Date status updated!" });
      })

    getAllVendors = asyncHandler("GetAllVendors")(async (req: Request, res: Response): Promise<void> => {
      const {
        page = 1,
        limit = 8,
        search = "",
        category = "",
        location = "",
        sort,
      } = req.query;
      console.log(req.query);
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);
      const sortValue = parseInt(sort as string, 10);
      const vendorData = await vendorService.getVendors(
        pageNumber,
        limitNumber,
        search.toString(),
        category.toString(),
        location.toString(),
        sortValue
      );
      const totalVendors = vendorData.length;
      const totalPages = Math.floor(totalVendors / limitNumber);
      res.status(200).json({ vendorData, totalPages });
    
  })

    Toggleblock = asyncHandler("BlockAllVendors")(async (req: Request, res: Response): Promise<void> => {
        const VendorId: string | undefined = req.query.VendorId as
          | string
          | undefined;
        if (!VendorId) {
          throw new Error("Vendor ID is missing or invalid.");
        }

        await vendorService.toggleVendorBlock(VendorId);
        let process = await vendor.findOne({ _id: VendorId });
        let status = !process?.isActive ? "blocked" : "unblocked";
        res.status(200).json({
        message: `Vendor ${status} successfully.`,
        process: !process?.isActive ? "block" : "unblock",
      });
    })

    updateVerifyStatus = asyncHandler("UpdateVerifyStatus")(async (req: Request, res: Response): Promise<void> => {
        const vendorId: string = req.body.vendorId as string;
        const status = req.body.status;
        const note = req.body.note;
        const result = await vendorService.changeVerifyStatus(vendorId, status, note);
        res.status(200).json({ result, message: "Status updated successfully!" });
    })

    getLocations = asyncHandler("GetLocations")(async (req: Request, res: Response): Promise<void> => {
        const Locations = await vendorService.getAllLocations();
        res.status(200).json({ locations: Locations });
      
    })
};

export default new VendorController();