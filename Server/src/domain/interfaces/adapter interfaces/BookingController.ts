import { Request, Response, NextFunction } from "express";

export interface BookingController {
    bookVendor(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookingsByVendor(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookingsByUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    getWalletDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookingsById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookingsByUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelBookingByUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}