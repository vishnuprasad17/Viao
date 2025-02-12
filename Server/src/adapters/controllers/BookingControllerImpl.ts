import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler";
import { inject, injectable } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";
import { BookingUseCase } from "../../domain/interfaces/BookingUseCase";
import { BookingController } from "../../domain/interfaces/BookingController";

@injectable()
export class BookingControllerImpl implements BookingController {
    constructor(@inject(TYPES.BookingUseCase) private bookingUseCase: BookingUseCase) {}

    bookVendor = asyncHandler("BookAVendor")(async (req: Request, res: Response): Promise<void> => {
        const vendorId = req.query.vendorId as string;
        const userId = req.query.userId as string;
        const { eventName, name, city,
              date, pin, mobile } = req.body;
        const result = await this.bookingUseCase.addBooking(
                    eventName,
                    name,
                    city,
                    date,
                    parseInt(pin),
                    parseInt(mobile),
                    vendorId,
                    userId
                );
    
            res.status(201).json(result);
      })
    
    getBookingsByVendor = asyncHandler("GetBookingsByVendor")(async (req: Request, res: Response): Promise<void> => {
        const vendorId: string = req.query.vendorId as string;
        const page: number = parseInt(req.query.page as string) || 1;
        const pageSize: number = parseInt(req.query.pageSize as string) || 8;
        const result = await this.bookingUseCase.getAllBookingsByVendor(vendorId, page, pageSize);

        res.status(201).json(result);
      })
        
    getBookingsByUser = asyncHandler("GetBookingsByUser")(async (req: Request, res: Response): Promise<void> => {
        const userId: string = req.query.userId as string;
        const page: number = parseInt(req.query.page as string) || 1;
        const pageSize: number = parseInt(req.query.pageSize as string) || 6;
        const result = await this.bookingUseCase.getAllBookingsByUser(userId, page, pageSize);
              
        res.status(201).json(result);
      })
}