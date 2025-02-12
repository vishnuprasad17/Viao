import { Request, Response, NextFunction } from "express";

export interface BookingController {
    bookVendor(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookingsByVendor(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookingsByUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}