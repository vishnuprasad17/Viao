import Booking from "../models/booking.model";
import { BaseRepository } from "../shared/data-access/base.repo";
import { IBookingDocument } from "../interfaces/booking.interface";
import { BaseError } from "../shared/error/base.error";



class BookingRepository extends BaseRepository<IBookingDocument>{
  constructor(){
    super(Booking)
  }

  async findBookingsByVendorId(
    vendorId: string,
    page: number, 
    pageSize: number
  ){
    try {
      const skip = (page - 1) * pageSize;
      const bookings = await Booking.find({ vendorId: vendorId }).sort({createdAt:-1}).skip(skip).limit(pageSize).exec();
      const totalBookings=await Booking.countDocuments({ vendorId: vendorId })
      return {bookings,totalBookings};
    } catch (error) {
      console.error("Error in findBookingsByVendorId:", error)
      throw new BaseError("Failed to find bookings by vendor ID.", 500);
    }
  }

  async findBookingsByUserId(
    userId: string,
    page: number, 
    pageSize: number
  ){
    try {
      const skip = (page - 1) * pageSize;
      const bookings = await Booking.find({ userId: userId }).populate("vendorId").sort({createdAt:-1}).skip(skip).limit(pageSize).exec();
      const totalBookings=await Booking.countDocuments({ userId: userId })
      return {bookings,totalBookings};
    } catch (error) {
      console.error("Error in findBookingsByUserId:", error)
      throw new BaseError("Failed to find bookings by user ID.", 500);
    }
  }
}

export default new BookingRepository()