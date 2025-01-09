import mongoose from "mongoose";
import Booking from "../models/booking.model";
import { IBookingDocument } from "../interfaces/booking.interface";
import vendor from "../models/vendor.model";
import notification, { Types } from "../models/notification.model";
import { INotificationDocument } from "../interfaces/notification.interface";
import user from "../models/user.model";
import { BaseError } from "../shared/error/base.error";
import bookingRepository from "../data-access/booking.repository";

class BookingService {
    async checkDateAvailability(vendorId: string, date: string): Promise<boolean> {
        try {
            const vendorData = await vendor.findById(vendorId);
            if (!vendorData) {
                throw new BaseError("Vendor not found.", 404);
            }
            const isBooked = vendorData.bookedDates.includes(date);
            return isBooked ? true : false;
        } catch (error) {
            console.log("Error checking date availability: ", error);
            throw error;
        }
    }

    async acquireLockForDate(vendorId: string, date: string): Promise<boolean> {
        try {
          const vendorData = await vendor.findById(vendorId);
    
          if (!vendorData) {
            throw new BaseError("Vendor not found",404);
          }
    
          const existingLock = vendorData.locks.find((lock) => lock.date === date);
    
          if (existingLock && existingLock.isLocked) {
            throw new Error("Date is already locked");
          }
    
          vendorData.locks.push({
            date: date,
            isLocked: true,
          });
    
          await vendorData.save();
          return true;
        } catch (error) {
          console.error("Error aquiring locks:", error);
          throw new BaseError("Error aquiring locks", 500);
        }
      }
    
      async releaseLockForDate(vendorId: string, date: string): Promise<void> {
        try {
          const vendorData = await vendor.findById(vendorId);
    
          if (!vendorData) {
            throw new BaseError("Vendor not found",404);
          }
    
          const lockIndex = vendorData.locks.findIndex(
            (lock) => lock.date === date
          );
    
          if (lockIndex !== -1) {
            vendorData.locks.splice(lockIndex, 1);
            await vendorData.save();
          }
        } catch (error) {
          console.error("Error releasing lock for dates:", error);
          throw new BaseError("Unable to release lock for dates", 500);
        }
      }
    
      async addBooking(
        eventName: string,
        name: string,
        city: string,
        date: string,
        pin: number,
        mobile: number,
        vendorId: string,
        userId: string
      ): Promise<object> {
        try {
          const vendorIdObjectId = new mongoose.Types.ObjectId(vendorId);
          const userIdObjectId = new mongoose.Types.ObjectId(userId);
          const booking = await bookingRepository.create({
            eventName,
            name,
            city,
            date,
            pin,
            mobile,
            vendorId: vendorIdObjectId,
            userId: userIdObjectId,
          });
    
          await vendor.findByIdAndUpdate(vendorId, {
            $push: { bookedDates: date },
          });
    
          const newNotification = new notification({
            recipient: vendorId,
            message: "New event Booked!",
            type:Types.BOOKING
          });
    
          await newNotification.save();
          return booking;
        } catch (error) {
          console.error("Error creating a booking:", error);
          throw new BaseError("Unable to create booking", 500);
        }
      }

      async getAllBookingsByVendor(
        vendorId: string,
        page: number,
        pageSize: number
      ) {
        try {
          const { bookings, totalBookings } = await bookingRepository.findBookingsByVendorId(
            vendorId,
            page,
            pageSize
          );
          return { bookings, totalBookings };
        } catch (error) {
          console.error("Error fetching booking for vendor:", error);
          throw new BaseError("Unable fetch vendor booking", 500);
        }
      }
    
      async getAllBookingsByUser(userId: string, page: number, pageSize: number) {
        try {
          const { bookings, totalBookings } = await bookingRepository.findBookingsByUserId(
            userId,
            page,
            pageSize
          );
          return { bookings, totalBookings };
        } catch (error) {
          console.error("Error fetching booking for user:", error);
          throw new BaseError("Unable fetch user booking", 500);
        }
      }
}

export default new BookingService();