import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { asyncHandler } from "../middlewares/async-handler";
import TYPES from "../../domain/constants/inversifyTypes";
import { VendorUseCase } from "../../domain/interfaces/application interfaces/VendorUseCase";
import { VendorController } from "../../domain/interfaces/adapter interfaces/VendorController";


@injectable()
export class VendorControllerImpl implements VendorController {
    constructor(@inject(TYPES.VendorUseCase) private vendorUseCase: VendorUseCase) {}

    getVendor = asyncHandler("GetVendor")(async (req: Request, res: Response): Promise<void> => {
        const vendorId: string = req.query.vendorid as string; // or req.query.Id?.toString()
        if (!vendorId) {
            res.status(400).json({ error: "Vendor ID is required." });
            return;
        }
        const data = await this.vendorUseCase.getSingleVendor(vendorId);
        
        if (data === null) {
            res.status(400).json({ error: "Vendor not found , error occured" });
        } else {
            res.status(200).json({ data: data });
        }
      });

    sendVerifyRequest = asyncHandler("VerifyRequest")(async (req: Request, res: Response): Promise<void> => {
        const vendorId: string = req.body.vendorId as string;
        const result = await this.vendorUseCase.verificationRequest(vendorId);

        res.status(200).json(result);
       });
    
    updateProfile = asyncHandler("UpdateVendorProfile")(async (req: Request, res: Response): Promise<void> => {
        const vendorId: string = req.query.vendorid as string; // Assuming vendorId is sent in the request body
        const formData = req.body;
        const file = req.files;
        const updatedVendor = await this.vendorUseCase.update(vendorId, formData, file);

        res.status(200).json(updatedVendor);
      });
    
    updatePassword = asyncHandler("UpdateVendorPassword")(async (req: Request, res: Response): Promise<void> => {
        const currentPassword = req.body.current_password;
        const newPassword = req.body.new_password;
        const vendorId: string = req.query.vendorid as string;
        const data = this.vendorUseCase.updatePwd(currentPassword, newPassword, vendorId);
        
        if (!data) {
          res
          .status(400).json({ error: "couldn't update password..internal error." });
        }
        res.status(200).json({ message: "password updated successfully.." });  
      });
    
    loadDates = asyncHandler("LoadDates")(async (req: Request, res: Response): Promise<void> => {
        const vendorId: string = req.query.vendorId as string;
        const bookedDates = await this.vendorUseCase.getBookedDates(vendorId);

        res.status(200).json({ bookedDates });
      });
        
    addDates = asyncHandler("AddDates")(async (req: Request, res: Response): Promise<void> => {
        const vendorId: string = req.body.vendorId as string;
        const status = req.body.status;
        const date = req.body.date;
        const bookedDates = await this.vendorUseCase.addDateAvailability(
          vendorId,
          status,
          date
        );
        
        res.status(200).json({ bookedDates, message: "Date status updated!" });
      });
    
    getAllVendors = asyncHandler("GetAllVendors")(async (req: Request, res: Response): Promise<void> => {
        const {
          page = 1,
          limit = 8,
          search = "",
          category = "",
          location = "",
          sort,
        } = req.query;
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const sortValue = parseInt(sort as string, 10);
        const { vendorData, totalPages } = await this.vendorUseCase.getVendors(
          pageNumber,
          limitNumber,
          search.toString(),
          category.toString(),
          location.toString(),
          sortValue
        );

        res.status(200).json({ vendorData, totalPages }); 
      });

    getSearchSuggestions = asyncHandler("GetSuggestions")(async (req: Request, res: Response): Promise<void> => {
        const term = req.query.term as string;
        const vendors = await this.vendorUseCase.getSuggestions(term);

        res.status(200).json({suggestions: vendors});
      });
    
    toggleBlock = asyncHandler("BlockVendor")(async (req: Request, res: Response): Promise<void> => {
        const VendorId: string | undefined = req.query.VendorId as
          | string
          | undefined;
        if (!VendorId) {
          throw new Error("Vendor ID is missing or invalid.");
        }
        const updated = await this.vendorUseCase.toggleVendorBlock(VendorId);
        const status = updated?.isActive === false ? "blocked" : "unblocked"
            
        res.status(200).json({
          message: `Vendor ${status} successfully.`,
          process: updated?.isActive === false ? "block" : "unblock",
        });
      });
    
    updateVerifyStatus = asyncHandler("UpdateVerifyStatus")(async (req: Request, res: Response): Promise<void> => {
        const vendorId: string = req.body.vendorId as string;
        const status = req.body.status;
        const note = req.body.note;
        const result = await this.vendorUseCase.changeVerifyStatus(vendorId, status, note);
        
        res.status(200).json({ result, message: "Status updated successfully!" });
      });
    
    getLocations = asyncHandler("GetLocations")(async (req: Request, res: Response): Promise<void> => {
        const Locations = await this.vendorUseCase.getAllLocations();
        
        res.status(200).json({ locations: Locations });
      });

    getFavoriteVendors = asyncHandler("GetFavouriteVendors")(async (req: Request, res: Response): Promise<void> => {
        const userId: string = req.query.userid as string;
        const page: number = parseInt(req.query.page as string) || 1;
        const pageSize: number = parseInt(req.query.pageSize as string) || 8;
    
        if (!userId) {
          res.status(400).json({ error: "Invalid user id." });
        }
        const {favVendors,count} = await this.vendorUseCase.FavoriteVendors( userId,page,pageSize);
        const totalPages = Math.ceil(count / pageSize);
        if (favVendors) {
          res.status(200).json({ data:favVendors,totalPages: totalPages});
        } else {
          res.status(400).json({ message: "No vendors in favorites." });
        }
      });

    getAnalytics = asyncHandler("GetRevenue")(async(req: Request, res: Response): Promise<void> => {
        const vendorId = req.query.vendorId as string;
        const dateType = req.query.date as string;
        if (!vendorId) {
          res.status(400).json({ message: "Invalid or missing vendorId" });
          return;
        }
        const data = await this.vendorUseCase.analytics(vendorId, dateType);
        
        if (data === null) {
          res.status(400).json({ message: "Invalid date parameter" });
          return;
        }
        res.status(200).json({ analyticsData: data });
      });
}