import { Types } from "mongoose";
import { BookingRepository } from "../../../domain/interfaces/infrastructure interfaces/BookingRepository";
import { BaseRepository } from "./BaseRepository";
import { BookingModel, IBooking } from "../mongooseModels/Booking";
import { WalletTransactionModel } from "../mongooseModels/WalletTransaction";
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

  async findAllBookingsForAdmin(
  page: number,
  pageSize: number,
  searchTerm: string,
  paymentStatus: string,
  vendorId?: string,
  year?: number,
  month?: number
): Promise<{ bookings: Booking[]; totalBookings: number }> {
  const skip = (page - 1) * pageSize;
  const query: any = {};

  if (paymentStatus !== "all") {
    query.payment_status = paymentStatus;
  }

  if (vendorId) {
    query.vendorId = vendorId;
  }

  if (year) {
    const monthStr = month ? String(month).padStart(2, "0") : null;
    query.date = { $regex: monthStr ? `^${year}-${monthStr}` : `^${year}` };
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

  const [documents, totalBookings] = await Promise.all([
    BookingModel.find(query)
      .populate("userId")
      .populate("vendorId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .exec(),
    BookingModel.countDocuments(query),
  ]);

  return {
    bookings: documents.map((d) => mapToDomainPopulateBothUserAndVendor(d)),
    totalBookings,
  };
}

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

  // Analytics

  async getAdminRevenueDetails(
  start: Date,
  end: Date,
  groupBy:
    | { day: { $isoDayOfWeek: string } }
    | { month: { $month: string } }
    | { year: { $year: string } },
  sortField: string
): Promise<Array<{ _id: { [key: string]: number }; totalRevenue: number }>> {
  const revenueData = await BookingModel.aggregate([
    {
      $match: {
        payment_status: "Completed",
        status: { $in: ["completed", "cancelled"] },
        createdAt: { $gte: start, $lt: end },
      },
    },
    // Final admin compensation for bookings cancelled after payment,
    // as recorded in the wallet ledger (source of truth over the snapshot).
    {
      $lookup: {
        from: WalletTransactionModel.collection.name,
        let: { bId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$bookingId", "$$bId"] },
              type: "cancellation_admin_fee",
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
          { $project: { _id: 0, amount: 1 } },
        ],
        as: "adminFeeTx",
      },
    },
    {
      $addFields: {
        adminRevenue: {
          $cond: [
            { $eq: ["$status", "cancelled"] },
            {
              $cond: [
                { $eq: ["$financials.cancellationScenario", "full_refund"] },
                0,
                {
                  $cond: [
                    { $gt: [{ $size: "$adminFeeTx" }, 0] },
                    { $arrayElemAt: ["$adminFeeTx.amount", 0] },
                    { $ifNull: ["$financials.adminKeepsOnCancel", 0] },
                  ],
                },
              ],
            },
            { $ifNull: ["$financials.adminCommissionAmount", 0] },
          ],
        },
      },
    },
    {
      $group: {
        _id: groupBy,
        totalRevenue: { $sum: "$adminRevenue" },
      },
    },
    { $sort: { [`_id.${sortField}`]: 1 } },
  ]);

  return revenueData;
}

async getVendorRevenueDetails(
  vendorId: string,
  start: Date,
  end: Date,
  groupBy:
    | { day: { $isoDayOfWeek: string } }
    | { month: { $month: string } }
    | { year: { $year: string } },
  sortField: string
): Promise<{ _id: { day?: number; month?: number; year?: number }; totalRevenue: number }[]> {
  const revenueData = await BookingModel.aggregate([
    {
      $match: {
        vendorId: new Types.ObjectId(vendorId),
        payment_status: "Completed",
        status: { $in: ["completed", "cancelled"] },
        createdAt: { $gte: start, $lt: end },
      },
    },
    // Final vendor compensation for bookings cancelled after payment,
    // as recorded in the wallet ledger (source of truth over the snapshot).
    {
      $lookup: {
        from: WalletTransactionModel.collection.name,
        let: { bId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$bookingId", "$$bId"] },
              type: { $in: ["vendor_compensation_held", "vendor_compensation_paid"] },
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
          { $project: { _id: 0, amount: 1 } },
        ],
        as: "vendorFeeTx",
      },
    },
    {
      $addFields: {
        vendorRevenue: {
          $cond: [
            { $eq: ["$status", "cancelled"] },
            {
              $cond: [
                { $eq: ["$financials.cancellationScenario", "full_refund"] },
                0,
                {
                  $cond: [
                    { $gt: [{ $size: "$vendorFeeTx" }, 0] },
                    { $arrayElemAt: ["$vendorFeeTx.amount", 0] },
                    { $ifNull: ["$financials.vendorCompensationOnCancel", 0] },
                  ],
                },
              ],
            },
            { $ifNull: ["$financials.vendorNetAmount", 0] },
          ],
        },
      },
    },
    {
      $group: {
        _id: groupBy,
        totalRevenue: { $sum: "$vendorRevenue" },
      },
    },
    { $sort: { [`_id.${sortField}`]: 1 } },
  ]);

  return revenueData;
}
}