import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { asyncHandler } from "../middlewares/async-handler";
import { AdminController } from "../../domain/interfaces/adapter interfaces/AdminController";
import TYPES from "../../domain/constants/inversifyTypes";
import { AdminUseCase } from "../../domain/interfaces/application interfaces/AdminUseCase";

@injectable()
export class AdminControllerImpl implements AdminController {
    constructor(@inject(TYPES.AdminUseCase) private adminUseCase: AdminUseCase) {}

    getAdminData = asyncHandler("GetAdminData")(async(req: Request, res: Response): Promise<void> => {
        const { adminId } = req.query as { adminId: string };
        if (!adminId) {
          res.status(400).json({ message: "Admin ID is required." });
          return;
        }
        const adminData = await this.adminUseCase.getData(adminId);
        
        res.status(200).json({ adminData });
      })
    
    getAnalytics =asyncHandler("GetRevenue")(async(req: Request, res: Response): Promise<void> => {
        const dateType = req.query.date as string;
        const data = await this.adminUseCase.analytics(dateType);
        if (data === null) {
            res.status(400).json({ message: "Invalid date parameter" });
            return;
        }
        res.status(200).json({ analyticsData: data });
      })
}