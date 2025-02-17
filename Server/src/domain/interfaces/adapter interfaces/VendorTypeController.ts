import { Request, Response, NextFunction } from "express";

export interface VendorTypeController {
    addVendorType(req: Request, res: Response, next: NextFunction): Promise<void>;
    getVendorTypes(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteVendorType(req: Request, res: Response, next: NextFunction): Promise<void>;
    loadSingleType(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateType(req: Request, res: Response, next: NextFunction): Promise<void>;
}