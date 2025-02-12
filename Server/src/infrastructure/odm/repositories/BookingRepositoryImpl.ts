import { BookingRepository } from "../../../domain/interfaces/BookingRepository";
import { BaseRepository } from "./BaseRepository";
import { BookingModel, IBooking } from "../mongooseModels/Booking";
import { mapToDomain, mapToDatabase } from "../mappers/bookingMapper";
import { Booking } from "../../../domain/entities/Booking";
import { injectable } from "inversify";
import { VendorModel } from "../mongooseModels/Vendor";

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

  async findBookingsByVendorId(vendorId: string, page: number, pageSize: number): Promise<{bookings: Booking[], totalBookings: number}> {
    const skip = (page - 1) * pageSize;
    const vendorBookings = await BookingModel.find({ vendorId: vendorId }).sort({createdAt:-1}).skip(skip).limit(pageSize).exec();
    const bookings = vendorBookings.map(booking => this.toDomain(booking));
    const totalBookings=await BookingModel.countDocuments({ vendorId: vendorId });

    return {bookings,totalBookings};
  }
  
  async findBookingsByUserId(userId: string, page: number, pageSize: number): Promise<{bookings: Booking[], totalBookings: number}> {
    const skip = (page - 1) * pageSize;
    const userBookings = await BookingModel.find({ userId: userId }).sort({createdAt:-1}).skip(skip).limit(pageSize).exec();
    //Get all vendor names corresponding to each bookings
    const vendorIds = [...new Set(userBookings.map((booking) => booking.vendorId))];
    const vendors = await VendorModel.find(
                              { _id: { $in: vendorIds } },
                              { _id: 1, name: 1}
                            );
    const vendorMap: Record<string, string> = vendors.reduce((acc, vendor) => {
                                                    acc[vendor._id.toString()] = vendor.name;
                                                    return acc;
                                              }, {} as Record<string, string>);
    const bookings = userBookings.map(booking => mapToDomain(booking, vendorMap[booking.vendorId.toString()]));  // map to domain entities
    const totalBookings=await BookingModel.countDocuments({ userId: userId });
    
    return {bookings,totalBookings};
  }

}