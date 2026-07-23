import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler";
import { inject, injectable } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";
import { BookingUseCase } from "../../domain/interfaces/application interfaces/BookingUseCase";
import { BookingController } from "../../domain/interfaces/adapter interfaces/BookingController";

@injectable()
export class BookingControllerImpl implements BookingController {
  constructor(
    @inject(TYPES.BookingUseCase) private bookingUseCase: BookingUseCase,
  ) {}

  bookVendor = asyncHandler("BookAVendor")(async (req: Request, res: Response): Promise<void> => {
      const vendorId = req.query.vendorId as string;
      const userId = req.query.userId as string;
      const { serviceId, name, city, date, pin, mobile, userNote } = req.body;

      const { status, message, bookingId } =
        await this.bookingUseCase.addBooking(
          serviceId,
          name,
          city,
          date,
          parseInt(pin),
          parseInt(mobile),
          vendorId,
          userId,
          userNote ?? null,
        );

      if (!status) {
        res.status(400).json({ error: message });
        return;
      }

      res.status(201).json({ message, bookingId });
    },
  );

  getBookingsByVendor = asyncHandler("GetBookingsByVendor")(async (req: Request, res: Response): Promise<void> => {
      const vendorId = req.query.vendorId as string;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 6;
      const searchTerm = (req.query.search as string) || "";
      const paymentStatus = (req.query.paymentStatus as string) || "all";

      const result = await this.bookingUseCase.getAllBookingsByVendor(
        vendorId,
        page,
        pageSize,
        searchTerm,
        paymentStatus,
      );

      res.status(200).json(result);
    },
  );

  getAllBookings = asyncHandler("GetAllBookings")(async (req: Request, res: Response): Promise<void> => {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 6;
      const searchTerm = (req.query.search as string) || "";
      const paymentStatus = (req.query.paymentStatus as string) || "all";
      const vendorId = (req.query.vendorId as string) || undefined;
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const month = req.query.month ? parseInt(req.query.month as string) : undefined;

      const result = await this.bookingUseCase.getAllBookingsForAdmin(
        page,
        pageSize,
        searchTerm,
        paymentStatus,
        vendorId,
        year,
        month
      );

      res.status(200).json(result);
  });

  payVendorCommission = asyncHandler("PayVendorCommission")(async (req: Request, res: Response): Promise<void> => {
      const { bookingId } = req.body;
      const result = await this.bookingUseCase.payVendorCommission(bookingId);
      res.status(200).json(result);
  });

  getVerifiedVendors = asyncHandler("GetVerifiedVendors")(async (req: Request, res: Response): Promise<void> => {
      const vendors = await this.bookingUseCase.getVerifiedVendorsForFilter();
      res.status(200).json({ vendors });
  });

  getBookingsByUser = asyncHandler("GetBookingsByUser")(async (req: Request, res: Response): Promise<void> => {
      const userId = req.query.userId as string;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 6;

      const result = await this.bookingUseCase.getAllBookingsByUser(
        userId,
        page,
        pageSize,
      );

      res.status(200).json(result);
    },
  );

  getBookingsById = asyncHandler("GetBookingsById")(async (req: Request, res: Response): Promise<void> => {
      const bookingId = req.query.bookingId as string;
      const bookings = await this.bookingUseCase.getAllBookingsById(bookingId);

      res.status(200).json({ bookings });
    },
  );

  cancelBookingByUser = asyncHandler("CancelBookingByUser")(async (req: Request, res: Response): Promise<void> => {
      const bookingId = req.query.bookingId as string;
      const booking = await this.bookingUseCase.cancelBooking(bookingId);

      res.status(200).json({ booking });
    },
  );

  markPaymentFailed = asyncHandler("MarkPaymentFailed")(async (req: Request, res: Response): Promise<void> => {
      const bookingId = req.query.bookingId as string;
      const booking = await this.bookingUseCase.markPaymentFailed(bookingId);

      res.status(200).json({ booking });
    },
  );

  updateAdminRemark = asyncHandler("UpdateAdminRemark")(async (req: Request, res: Response): Promise<void> => {
      const bookingId = req.query.bookingId as string;
      const { remark } = req.body;

      if (!remark || typeof remark !== "string") {
        res.status(400).json({ error: "Remark is required." });
        return;
      }

      const booking = await this.bookingUseCase.updateAdminRemark(
        bookingId,
        remark,
      );

      res.status(200).json({ booking });
    },
  );

  markBookingCompleted = asyncHandler("MarkBookingCompleted")(async (req: Request, res: Response): Promise<void> => {
      const bookingId = req.query.bookingId as string;

      const booking = await this.bookingUseCase.markBookingCompleted(bookingId);

      res.status(200).json({ booking });
    },
  );
}