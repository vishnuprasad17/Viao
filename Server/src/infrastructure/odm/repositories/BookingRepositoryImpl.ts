import { BookingRepository } from "../../../domain/interfaces/infrastructure interfaces/BookingRepository";
import { BaseRepository } from "./BaseRepository";
import { BookingModel, IBooking } from "../mongooseModels/Booking";
import {
  mapToDomain,
  mapToDatabase,
  mapToDomainByPopulatingVendor,
  mapToDomainPopulateBothUserAndVendor,
} from "../mappers/bookingMapper";
import { Booking } from "../../../domain/entities/Booking";
import { injectable } from "inversify";

@injectable()
export class BookingRepositoryImpl
  extends BaseRepository<IBooking, Booking>
  implements BookingRepository
{
  constructor() {
    super(BookingModel);
  }

  protected toDomain(document: IBooking): Booking {
    return mapToDomain(document);
  }

  protected toDatabase(domain: Booking): Partial<IBooking> {
    return mapToDatabase(domain);
  }

  // Queries for bookings

  async findBookingsByVendorId(
    vendorId: string,
    page: number,
    pageSize: number,
    searchTerm: string,
    paymentStatus: string
  ): Promise<{ bookings: Booking[]; totalBookings: number }> {
    const skip = (page - 1) * pageSize;
    const query: any = { vendorId };

    if (paymentStatus !== "all") {
      query.payment_status = paymentStatus;
    }

    if (searchTerm) {
      const regex = new RegExp(searchTerm, "i");
      query.$or = [
        { name: regex },
        { eventName: regex },
        { city: regex },
        { date: regex },
      ];
    }

    const [vendorBookings, totalBookings] = await Promise.all([
      BookingModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize).exec(),
      BookingModel.countDocuments(query),
    ]);

    return { bookings: vendorBookings.map((b) => this.toDomain(b)), totalBookings };
  }

  async findBookingsByUserId(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{ bookings: Booking[]; totalBookings: number }> {
    const skip = (page - 1) * pageSize;
    const documents = await BookingModel.find({ userId })
      .populate("vendorId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .exec();
    const totalBookings = await BookingModel.countDocuments({ userId });
    return {
      bookings: documents.map((d) => mapToDomainByPopulatingVendor(d)),
      totalBookings,
    };
  }

  async findBookingsByBookingId(bookingId: string): Promise<Booking[]> {
    const results = await BookingModel.find({ _id: bookingId })
      .populate("userId")
      .populate("vendorId");
    return results.map((b) => mapToDomainPopulateBothUserAndVendor(b));
  }

  // Status updates

  async updatePaymentStatus(bookingId: string): Promise<Booking | null> {
    const update = await BookingModel.findByIdAndUpdate(bookingId, {
      $set: { payment_status: "Completed" },
    });
    return update ? this.toDomain(update) : null;
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<Booking | null> {
    const update = await BookingModel.findByIdAndUpdate(
      bookingId,
      { $set: { status } },
      { returnDocument: "after" }
    );
    return update ? this.toDomain(update) : null;
  }

  async markPaymentFailed(
    bookingId: string,
    failedAt: Date,
    retryDeadline: Date
  ): Promise<boolean> {
    const result = await BookingModel.findByIdAndUpdate(bookingId, {
      $set: {
        payment_status: "Failed",
        paymentFailedAt: failedAt,
        retryDeadline: retryDeadline,
      },
    });
    return !!result;
  }

  async findExpiredPaymentPendingBookings(): Promise<Booking[]> {
    const now = new Date();
    const documents = await BookingModel.find({
      status: "payment_pending",
      retryDeadline: { $lte: now },
    })
    .limit(200)
    .lean();
    return documents.map((d) => this.toDomain(d));
  }

  async updateAdminRemark(bookingId: string, remark: string): Promise<boolean> {
    const result = await BookingModel.findByIdAndUpdate(bookingId, {
      $set: { adminRemark: remark },
    });
    return !!result;
  }

  // Financials snapshot updates

  async updateFinancialsOnWalletDeduction(
    bookingId: string,
    walletDeducted: number
  ): Promise<boolean> {
    const result = await BookingModel.findByIdAndUpdate(bookingId, {
      $set: { "financials.walletDeducted": walletDeducted },
    });
    return !!result;
  }

  async updateFinancialsOnPaymentComplete(
    bookingId: string,
    data: {
      walletDeducted: number;
      stripeAmount: number;
      adminCommissionPercent: number;
      adminCommissionAmount: number;
      vendorNetAmount: number;
      modeOfPayment: string;
    }
  ): Promise<boolean> {
    const result = await BookingModel.findByIdAndUpdate(bookingId, {
      $set: {
        "financials.walletDeducted":         data.walletDeducted,
        "financials.stripeAmount":           data.stripeAmount,
        "financials.adminCommissionPercent": data.adminCommissionPercent,
        "financials.adminCommissionAmount":  data.adminCommissionAmount,
        "financials.vendorNetAmount":        data.vendorNetAmount,
      },
    });
    return !!result;
  }

  async updateFinancialsOnCancellation(
    bookingId: string,
    data: {
      cancellationScenario: "full_refund" | "partial_refund" | "no_refund";
      refundToUser: number;
      adminKeepsOnCancel: number;
      vendorCompensationOnCancel: number;
    }
  ): Promise<boolean> {
    const result = await BookingModel.findByIdAndUpdate(bookingId, {
      $set: {
        "financials.cancellationScenario":       data.cancellationScenario,
        "financials.refundToUser":               data.refundToUser,
        "financials.adminKeepsOnCancel":         data.adminKeepsOnCancel,
        "financials.vendorCompensationOnCancel": data.vendorCompensationOnCancel,
      },
    });
    return !!result;
  }
}