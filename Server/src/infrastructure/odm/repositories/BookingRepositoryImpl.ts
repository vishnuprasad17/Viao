import { BookingRepository } from "../../../domain/interfaces/infrastructure interfaces/BookingRepository";
import { BaseRepository } from "./BaseRepository";
import { BookingModel, IBooking } from "../mongooseModels/Booking";
import { mapToDomain, mapToDatabase, mapToDomainByPopulatingVendor, mapToDomainPopulateBothUserAndVendor } from "../mappers/bookingMapper";
import { Booking } from "../../../domain/entities/Booking";
import { injectable } from "inversify";

@injectable()
export class BookingRepositoryImpl extends BaseRepository<IBooking, Booking> implements BookingRepository {
  constructor(){
    super(BookingModel)
  }

  // Implement mapping methods
  protected toDomain(document: IBooking): Booking {
    return mapToDomain(document);
  }

  protected toDatabase(domain: Booking): Partial<IBooking> {
    return mapToDatabase(domain);
  }

  async findBookingsByVendorId(vendorId: string, page: number, pageSize: number, searchTerm: string, paymentStatus: string): Promise<{bookings: Booking[], totalBookings: number}> {
    const skip = (page - 1) * pageSize;
    const query: any = { vendorId };

    if (paymentStatus !== 'all') {
      query.payment_status = paymentStatus;
    }

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');
      query.$or = [
        { name: searchRegex },
        { eventName: searchRegex },
        { city: searchRegex },
        { date: searchRegex }
      ];
    }

    const [vendorBookings, totalBookings] = await Promise.all([
      BookingModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .exec(),
      BookingModel.countDocuments(query)
    ]);

    const bookings = vendorBookings.map(booking => this.toDomain(booking));
  
    return { bookings, totalBookings };
  }
  
  async findBookingsByUserId(userId: string, page: number, pageSize: number): Promise<{bookings: Booking[], totalBookings: number}> {
    const skip = (page - 1) * pageSize;
    const documents = await BookingModel.find({ userId: userId }).populate("vendorId").sort({createdAt:-1}).skip(skip).limit(pageSize).exec();
    const totalBookings=await BookingModel.countDocuments({ userId: userId });
    const bookings = documents.map((document) => mapToDomainByPopulatingVendor(document));
    
    return {bookings,totalBookings};
  }

  async findRefundForUser(userId: string, page: number, pageSize: number): Promise<{refund: Booking[], totalRefund: number}> {
    const skip = (page - 1) * pageSize;
    const documents = await BookingModel.find({
      userId: userId,
      $or: [
        { refundAmount: { $gt: 0 } },
        { deductedFromWallet: { $gt: 0 } },
      ],
    })
      .populate("vendorId")
        .skip(skip)
        .limit(pageSize)
        .exec();
    const bookings = documents.map((document) => mapToDomainByPopulatingVendor(document));
    const totalBookings=await BookingModel.countDocuments({ userId: userId, refundAmount: { $ne: 0 } })
    
    return {refund:bookings,totalRefund:totalBookings};
  }

  async findBookingsByBookingId(bookingId: string): Promise<Booking[]>{
    const results = await BookingModel.find({ _id: bookingId })
        .populate("userId")
        .populate("vendorId");
      return results.map(booking => mapToDomainPopulateBothUserAndVendor(booking));
  }

  async updatePaymentStatus(bookingId: string): Promise<Booking | null> {
    const update = await BookingModel.findByIdAndUpdate(bookingId,{$set:{payment_status:"Completed"}});

    return update? this.toDomain(update) : null;
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<Booking | null> {
    const update = await BookingModel.findByIdAndUpdate(bookingId,{$set:{status: status}}, { new: true });

    return update ? this.toDomain(update) : null;
  }

  async updateRefundAmount(bookingId:string, amount: number): Promise<boolean> {
    const booking = await BookingModel.findById(bookingId);
    if (booking) {
      booking.refundAmount += amount;
      await booking.save();

      return true;
    }

    return false;
  }

  async updatedeductedAmount(bookingId:string, amount: number): Promise<boolean> {
    const booking = await BookingModel.findById(bookingId);
    if (booking) {
      booking.deductedFromWallet += amount;
      await booking.save();

      return true;
    }

    return false;
  }

}