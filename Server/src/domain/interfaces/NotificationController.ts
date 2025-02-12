import { Request, Response, NextFunction } from "express";

export interface NotificationController {
    getAllNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
    toggleRead(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteNotification(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCount(req: Request, res: Response, next: NextFunction): Promise<void>;
}