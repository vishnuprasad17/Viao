import { Request, Response, NextFunction } from "express";

export interface ServiceController {
    createService(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateService(req: Request, res: Response, next: NextFunction): Promise<void>;
    getServices(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllServices(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteService(req: Request, res: Response, next: NextFunction): Promise<void>;
}