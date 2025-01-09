import { Request, Response } from "express";
import { bookingService } from "../services";
import { BaseError } from "../shared/error/base.error";
import { asyncHandler } from "../shared/middlewares/async-handler";


class BookingController {
    bookVendor = asyncHandler("BookAVendor")(async (req: Request, res: Response): Promise<void> => {
        const vendorId = req.query.vendorId as string;
        const userId = req.query.userId as string;
        const { eventName, name, city,
            date, pin, mobile } = req.body;
            
        const DateAlreadyBooked = await bookingService.checkDateAvailability(
            vendorId,
            date
        );

        if (DateAlreadyBooked) {
            throw new BaseError("Sorry, the selected date is unavailable!", 404);
        }
        
        // Acquire lock and proceed with booking
        const lockAcquired = await bookingService.acquireLockForDate(vendorId, date);
        
        if (!lockAcquired) {
            throw new BaseError("Sorry, this date is currently not available!", 400);
        }
        const booking = await bookingService.addBooking(
            eventName,
            name,
            city,
            date,
            parseInt(pin),
            parseInt(mobile),
            vendorId,
            userId
        );
        await bookingService.releaseLockForDate(vendorId, date);

        res.status(201).json({ booking, message: "Booking done successfully." });
    })

    getBookingsByVendor = asyncHandler("GetBookingsByVendor")(async (req: Request, res: Response): Promise<void> => {
          const vendorId: string = req.query.vendorId as string;
          const page: number = parseInt(req.query.page as string) || 1;
          const pageSize: number = parseInt(req.query.pageSize as string) || 8;
          const { bookings, totalBookings } =
            await bookingService.getAllBookingsByVendor(vendorId, page, pageSize);
          const totalPages = Math.ceil(totalBookings / pageSize);
          res.status(201).json({ bookings, totalPages: totalPages });
      })
    
      getBookingsByUser = asyncHandler("GetBookingsByUser")(async (req: Request, res: Response): Promise<void> => {
          const userId: string = req.query.userId as string;
          const page: number = parseInt(req.query.page as string) || 1;
          const pageSize: number = parseInt(req.query.pageSize as string) || 6;
          const { bookings, totalBookings } =
            await bookingService.getAllBookingsByUser(userId, page, pageSize);
          const totalPages = Math.ceil(totalBookings / pageSize);
          res.status(201).json({ bookings, totalPages: totalPages });
      })
}

export default new BookingController();