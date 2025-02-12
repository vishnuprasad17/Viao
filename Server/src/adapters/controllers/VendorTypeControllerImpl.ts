import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { asyncHandler } from "../middlewares/async-handler";
import TYPES from "../../domain/constants/inversifyTypes";
import { TypeUseCase } from "../../domain/interfaces/TypeUseCase";
import { VendorTypeController } from "../../domain/interfaces/VendorTypeController";

@injectable()
export class VendorTypeControllerImpl implements VendorTypeController  {
    constructor(@inject(TYPES.TypeUseCase) private typeUseCase: TypeUseCase) {}

    addVendorType = asyncHandler("AddVendorType")(async (req: Request, res: Response): Promise<void> => {
          const { type, status } = req.body;
          const file=req.file;
          const vendor = await this.typeUseCase.addType(type, file);
          
          res.status(201).json(vendor);
        
      })
    
      getVendorTypes = asyncHandler("GetVendorType")(async (req: Request, res: Response): Promise<void> => {
          const vendorTypes = await this.typeUseCase.getTypes();
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
          await this.typeUseCase.deleteType(vendorTypeId);

          res.status(200).json({ message: "Vendor deleted successfully" });
        
      })
    
      loadSingleType = asyncHandler("LoadSingleType")(async (req: Request, res: Response): Promise<void> => {
          const vendorTypeId: string | undefined = req.query?.id as
            | string
            | undefined;
    
          if (!vendorTypeId) {
            res
              .status(400)
              .json({ message: "Vendor Type ID is missing or invalid." });
            return;
          }
    
          const result = await this.typeUseCase.getSingleType(vendorTypeId);
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
          const { type, status } = req.body;
          const file = req.file;
          const result = await this.typeUseCase.update(vendorTypeId, type, status, file);
          
          res.status(200).json(result);
      })
}