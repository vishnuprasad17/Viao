import { inject, injectable } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";
import { BookingRepository } from "../../domain/interfaces/infrastructure interfaces/BookingRepository";
import { VendorRepository } from "../../domain/interfaces/infrastructure interfaces/VendorRepository";
import { BaseError } from "../../domain/errors/BaseError";
import { Booking } from "../../domain/entities/Booking";
import { Types } from "../../domain/constants/notificationTypes";
import { NotificationService } from "../../domain/interfaces/application interfaces/NotificationService";
import { NotificationRepository } from "../../domain/interfaces/infrastructure interfaces/NotificationRepository";
import { BookingDTO } from "../../domain/dtos/BookingDTO";
import { BookingUseCase } from "../../domain/interfaces/application interfaces/BookingUseCase";
import { PaymentRepository } from "../../domain/interfaces/infrastructure interfaces/PaymentRepository";
import { AdminRepository } from "../../domain/interfaces/infrastructure interfaces/AdminRepository";
import { UserRepository } from "../../domain/interfaces/infrastructure interfaces/UserRepository";
import { ServiceRepository } from "../../domain/interfaces/infrastructure interfaces/ServiceRepository";
import { calculateRefund } from "../../domain/helpers/helperFunctions";

@injectable()
export class BookingUseCaseImpl implements BookingUseCase {
    constructor(@inject(TYPES.BookingRepository) private bookingRepository: BookingRepository,
                @inject(TYPES.AdminRepository) private adminRepository: AdminRepository,
                @inject(TYPES.UserRepository) private userRepository: UserRepository,
                @inject(TYPES.VendorRepository) private vendorRepository: VendorRepository,
                @inject(TYPES.PaymentRepository) private paymentRepository: PaymentRepository,
                @inject(TYPES.NotificationService) private notificationService: NotificationService,
                @inject(TYPES.NotificationRepository) private notificationRepository: NotificationRepository,
                @inject(TYPES.ServiceRepository) private serviceRepository: ServiceRepository) {}

    async addBooking(
            serviceId: string,
            name: string,
            city: string,
            date: string,
            pin: number,
            mobile: number,
            vendorId: string,
            userId: string
          ): Promise<{status: boolean, message: string}> {
            const vendorData = await this.vendorRepository.getById(vendorId);
            if (!vendorData) {
              throw new BaseError("Vendor not found.", 404);
            }
            const serviceData = await this.serviceRepository.getById(serviceId);
            if (!serviceData) {
              return { status: false, message: "Sorry, the selected service is unavailable!." };
            }
            const isBooked = vendorData.bookedDates.includes(date);
            
            if (isBooked) {
              return { status: false, message: "Sorry, the selected date is unavailable!." };
            }
                
            // Acquire lock and proceed with booking
            const lockAcquired = await this.vendorRepository.lockDate(vendorId, date);
                
                if (!lockAcquired) {
                  return { status: false, message: "Sorry, the selected date is unavailable!." };
                }
                const newBooking = new Booking(
                    "",
                    name,
                    date,
                    serviceData.name,
                    city,
                    pin,
                    mobile,
                    vendorId,
                    userId,
                    "Pending",
                    "Pending",
                    serviceData.price,
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

                return { status: true, message: "Booking done successfully." };
          }
    
          async getAllBookingsByVendor(
            vendorId: string,
            page: number,
            pageSize: number,
            searchTerm: string,
            paymentStatus: string
          ): Promise<{bookings: BookingDTO[], totalPages: number}> {
            const { bookings, totalBookings } = await this.bookingRepository.findBookingsByVendorId(
              vendorId,
              page,
              pageSize,
              searchTerm,
              paymentStatus
            );
            
            const totalPages = Math.ceil(totalBookings / pageSize);
            const bookingDtos = BookingDTO.fromDomainList(bookings);
            
            return { bookings: bookingDtos, totalPages };
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

          async getTransactions(userId: string, page: number, pageSize: number): Promise<{ wallet: number, transaction: BookingDTO[], totalPages: number }> {
              const { refund, totalRefund } = await this.bookingRepository.findRefundForUser(
                userId,
                page,
                pageSize
              );
              const user = await this.userRepository.getById(userId);
              if (!user) {
                throw new BaseError("User not found.", 404);
              }
              const bookingDto = BookingDTO.fromDomainList(refund);
              const totalPages = Math.ceil(totalRefund / pageSize);

              return { wallet: user.wallet, transaction: bookingDto, totalPages };
          }

          async getAllBookingsById(bookingId: string): Promise<BookingDTO[]> {
              const bookings = await this.bookingRepository.findBookingsByBookingId(bookingId);
              const bookingDtos = BookingDTO.fromDomainList(bookings);

              return bookingDtos;
          }
        
          async updateStatusById(bookingId: string, status: string): Promise<BookingDTO> {
              const booking = await this.bookingRepository.getById(bookingId);
          
              if (!booking) {
                throw new BaseError("Booking not found.", 404);
              }
          
              if (status === "Rejected" || status === "Cancelled") {
                const { vendorId, date } = booking;
          
                await this.vendorRepository.cancelDate(vendorId as string, date);
          
                const Payment = await this.paymentRepository.findOne({ bookingId: bookingId });
                
                if (status === "Rejected") {
                  // Notification for user
                  const userNotificationMessage = "Booking is rejected By Vendor";
                  const userNotificationType = Types.STATUS;
                  const newNotification = await this.notificationService.createNotification(booking.userId as string, userNotificationMessage, userNotificationType);
            
                  await this.notificationRepository.create(newNotification);
                }
          
                if (status == "Cancelled" && Payment) {
                  const { userId } = booking;
                  const User = await this.userRepository.getById(userId as string);
                  const Admin = await this.adminRepository.findOne({});
                  if (!User || !Admin) {
                    throw new BaseError("User or Admin not found.", 404);
                  }
          
                  const refundAmount = calculateRefund(booking.amount);

                  await this.adminRepository.refundFromWallet(refundAmount);
                  await this.userRepository.refundToWallet(User.id, refundAmount);
          
                  await this.bookingRepository.updateRefundAmount(booking.id, refundAmount);
          
                  // Notification for vendor
                  const vendorNotificationMessage = "Booking Cancelled by user";
                  const vendorNotificationType = Types.STATUS;
                  const newNotification = await this.notificationService.createNotification(booking.vendorId as string, vendorNotificationMessage, vendorNotificationType);
                  await this.notificationRepository.create(newNotification);
                }
              } else {
                  // Notification for user
                  const userNotificationMessage = "Booking Accepted by vendor";
                  const userNotificationType = Types.STATUS;
                  const newNotification = await this.notificationService.createNotification(booking.userId as string, userNotificationMessage, userNotificationType);
                  await this.notificationRepository.create(newNotification);
                  await this.vendorRepository.updateBookingCount(booking.vendorId as string);
              }
              const updatedDocument = await this.bookingRepository.updateBookingStatus(bookingId, status);
              if (!updatedDocument) {
                throw new BaseError("Failed to update booking status.", 500);
              }
              const result = BookingDTO.fromDomain(updatedDocument);
              
              return result;
          }
}