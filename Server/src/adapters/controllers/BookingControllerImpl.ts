import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler";
import { inject, injectable } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";
import { BookingUseCase } from "../../domain/interfaces/application interfaces/BookingUseCase";
import { BookingController } from "../../domain/interfaces/adapter interfaces/BookingController";

@injectable()
export class BookingControllerImpl implements BookingController {
    constructor(@inject(TYPES.BookingUseCase) private bookingUseCase: BookingUseCase) {}

    bookVendor = asyncHandler("BookAVendor")(async (req: Request, res: Response): Promise<void> => {
        const vendorId = req.query.vendorId as string;
        const userId = req.query.userId as string;
        const { serviceId, name, city,
              date, pin, mobile } = req.body;
        const { status, message } = await this.bookingUseCase.addBooking(
          serviceId,
          name,
          city,
          date,
          parseInt(pin),
          parseInt(mobile),
          vendorId,
          userId
        );
        if(!status) {
          res.status(400).json({ error: message});
        }
        res.status(201).json({message: message});
      })
    
    getBookingsByVendor = asyncHandler("GetBookingsByVendor")(async (req: Request, res: Response): Promise<void> => {
        const vendorId: string = req.query.vendorId as string;
        const page: number = parseInt(req.query.page as string) || 1;
        const pageSize: number = parseInt(req.query.pageSize as string) || 6;
        const searchTerm: string = req.query.search as string || '';
        const paymentStatus: string = req.query.paymentStatus as string || 'all';
        const result = await this.bookingUseCase.getAllBookingsByVendor(vendorId, page, pageSize, searchTerm, paymentStatus);

        res.status(201).json(result);
      })
        
    getBookingsByUser = asyncHandler("GetBookingsByUser")(async (req: Request, res: Response): Promise<void> => {
        const userId: string = req.query.userId as string;
        const page: number = parseInt(req.query.page as string) || 1;
        const pageSize: number = parseInt(req.query.pageSize as string) || 6;
        const result = await this.bookingUseCase.getAllBookingsByUser(userId, page, pageSize);
              
        res.status(201).json(result);
      })

    getWalletDetails = asyncHandler("GetRefundDetails")(async(req: Request, res: Response): Promise<void> => {
        const userId: string = req.query.userId as string;
        const page: number = parseInt(req.query.page as string) || 1;
        const pageSize: number = parseInt(req.query.pageSize as string) || 4;
        const { wallet, transaction, totalPages } = await this.bookingUseCase.getTransactions(
          userId,
          page,
          pageSize
          );

          res.status(201).json({ wallet: wallet, transaction: transaction, totalPages: totalPages });
      })

    getBookingsById = asyncHandler("GetBookingsById")(async(req: Request, res: Response): Promise<void> => {
        const bookingId: string = req.query.bookingId as string;
        const bookings = await this.bookingUseCase.getAllBookingsById(bookingId);

        res.status(201).json({ bookings });
      })
    
    updateStatus = asyncHandler("UpdateBookingStatus")(async(req: Request, res: Response): Promise<void> => {
        const bookingId: string = req.query.bookingId as string;
        const status = req.body.status;
        const bookings = await this.bookingUseCase.updateStatusById(bookingId, status);
        
        res.status(201).json({ bookings });
      })
    
    cancelBookingByUser = asyncHandler("CancelBookingByUser")(async(req: Request, res: Response): Promise<void> => {
        const bookingId: string = req.query.bookingId as string;
          const status = "Cancelled";
          const bookings = await this.bookingUseCase.updateStatusById(bookingId, status);

          res.status(201).json({ bookings });
      })
}