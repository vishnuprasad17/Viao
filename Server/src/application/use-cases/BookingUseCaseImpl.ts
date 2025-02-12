import { inject, injectable } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";
import { BookingRepository } from "../../domain/interfaces/BookingRepository";
import { VendorRepository } from "../../domain/interfaces/VendorRepository";
import { BaseError } from "../../domain/errors/BaseError";
import { Booking } from "../../domain/entities/Booking";
import { Types } from "../../domain/constants/notificationTypes";
import { NotificationService } from "../../domain/interfaces/NotificationService";
import { NotificationRepository } from "../../domain/interfaces/NotificationRepository";
import { BookingDTO } from "../../domain/dtos/BookingDTO";
import { BookingUseCase } from "../../domain/interfaces/BookingUseCase";

@injectable()
export class BookingUseCaseImpl implements BookingUseCase {
    constructor(@inject(TYPES.BookingRepository) private bookingRepository: BookingRepository,
                @inject(TYPES.VendorRepository) private vendorRepository: VendorRepository,
                @inject(TYPES.NotificationService) private notificationService: NotificationService,
                @inject(TYPES.NotificationRepository) private notificationRepository: NotificationRepository) {}

    async addBooking(
            eventName: string,
            name: string,
            city: string,
            date: string,
            pin: number,
            mobile: number,
            vendorId: string,
            userId: string
          ): Promise<{booking: BookingDTO, message: string}> {
            const vendorData = await this.vendorRepository.getById(vendorId);
            if (!vendorData) {
                throw new BaseError("Vendor not found.", 404);
            }
            const isBooked = vendorData.bookedDates.includes(date);
            
            if (isBooked) {
                throw new BaseError("Sorry, the selected date is unavailable!", 404);
            }
                
            // Acquire lock and proceed with booking
            const lockAcquired = await this.vendorRepository.lockDate(vendorId, date);
                
                if (!lockAcquired) {
                    throw new BaseError("Sorry, this date is currently not available!", 400);
                }
                const newBooking = new Booking(
                    "",
                    name,
                    date,
                    eventName,
                    city,
                    pin,
                    mobile,
                    vendorId,
                    userId,
                    "Pending",
                    "Pending",
                    0,
                    0,
                    new Date()
                );
                const bookingData = await this.bookingRepository.create(newBooking);
                await this.vendorRepository.bookDate(vendorId, date);
                await this.vendorRepository.unlockDate(vendorId, date);

                //Notify the vendor
                const notificationMessage = "New event Booked!";
                const notificationType = Types.BOOKING;
                const notification = await this.notificationService.createNotification(vendorId, notificationMessage, notificationType);
                await this.notificationRepository.create(notification);
                const booking = BookingDTO.fromDomain(bookingData);

                return { booking, message: "Booking done successfully." };
          }
    
          async getAllBookingsByVendor(
            vendorId: string,
            page: number,
            pageSize: number
          ): Promise<{bookings: BookingDTO[], totalPages: number}> {
            const { bookings, totalBookings } = await this.bookingRepository.findBookingsByVendorId(
                vendorId,
                page,
                pageSize
            );
            const totalPages = Math.ceil(totalBookings / pageSize);
            const bookingDtos = BookingDTO.fromDomainList(bookings);

              return { bookings: bookingDtos, totalPages: totalPages };
          }
        
          async getAllBookingsByUser(userId: string, page: number, pageSize: number): Promise<{bookings: BookingDTO[], totalPages: number}> {
            const { bookings, totalBookings } = await this.bookingRepository.findBookingsByUserId(
                userId,
                page,
                pageSize
              );
            const totalPages = Math.ceil(totalBookings / pageSize);
            const bookingDtos = BookingDTO.fromDomainList(bookings);

            return { bookings: bookingDtos, totalPages: totalPages };
          }
}