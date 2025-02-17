import { Request, Response, NextFunction } from "express";

export interface VendorController {
    getVendor(req: Request, res: Response, next: NextFunction): Promise<void>;
    sendVerifyRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    updatePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    loadDates(req: Request, res: Response, next: NextFunction): Promise<void>;
    addDates(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllVendors(req: Request, res: Response, next: NextFunction): Promise<void>;
    toggleBlock(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateVerifyStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    getLocations(req: Request, res: Response, next: NextFunction): Promise<void>;
    getFavoriteVendors(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRevenue(req: Request, res: Response, next: NextFunction): Promise<void>;
}