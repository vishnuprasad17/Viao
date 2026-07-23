import { Request, Response, NextFunction } from "express";

export interface BookingController {
    bookVendor(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllBookings(req: Request, res: Response, next: NextFunction): Promise<void>;
    payVendorCommission(req: Request, res: Response, next: NextFunction): Promise<void>;
    getVerifiedVendors(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookingsByVendor(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookingsByUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookingsById(req: Request, res: Response, next: NextFunction): Promise<void>;
    markPaymentFailed(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateAdminRemark(req: Request, res: Response, next: NextFunction): Promise<void>;
    markBookingCompleted(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelBookingByUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}