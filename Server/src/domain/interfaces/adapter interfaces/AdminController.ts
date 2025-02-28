import { Request, Response, NextFunction } from "express"

export interface AdminController {
    getAdminData(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void>;
}