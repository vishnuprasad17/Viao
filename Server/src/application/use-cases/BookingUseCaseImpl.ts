import { inject, injectable } from "inversify";
import TYPES from "../../domain/constants/inversifyTypes";
import { BookingRepository } from "../../domain/interfaces/infrastructure interfaces/BookingRepository";
import { VendorRepository } from "../../domain/interfaces/infrastructure interfaces/VendorRepository";
import { BaseError } from "../../domain/errors/BaseError";
import { Booking, BookingFinancials } from "../../domain/entities/Booking";
import { Types } from "../../domain/constants/notificationTypes";
import { NotificationService } from "../../domain/interfaces/application interfaces/NotificationService";
import { NotificationRepository } from "../../domain/interfaces/infrastructure interfaces/NotificationRepository";
import { BookingDTO } from "../../domain/dtos/BookingDTO";
import { BookingUseCase } from "../../domain/interfaces/application interfaces/BookingUseCase";
import { PaymentRepository } from "../../domain/interfaces/infrastructure interfaces/PaymentRepository";
import { AdminRepository } from "../../domain/interfaces/infrastructure interfaces/AdminRepository";
import { UserRepository } from "../../domain/interfaces/infrastructure interfaces/UserRepository";
import { ServiceRepository } from "../../domain/interfaces/infrastructure interfaces/ServiceRepository";
import { calculateCancellationResult } from "../../domain/helpers/helperFunctions";
import { WalletTransaction } from "../../domain/entities/WalletTransaction";
import { WalletTransactionDTO } from "../../domain/dtos/WalletTransactionDto";
import { WalletTransactionRepository } from "../../domain/interfaces/infrastructure interfaces/WalletTransactionRepository";

// Admin commission percentage
const ADMIN_COMMISSION_PERCENT = 10;

@injectable()
export class BookingUseCaseImpl implements BookingUseCase {
  constructor(
    @inject(TYPES.BookingRepository) private bookingRepository: BookingRepository,
    @inject(TYPES.AdminRepository) private adminRepository: AdminRepository,
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.VendorRepository) private vendorRepository: VendorRepository,
    @inject(TYPES.PaymentRepository) private paymentRepository: PaymentRepository,
    @inject(TYPES.NotificationService) private notificationService: NotificationService,
    @inject(TYPES.NotificationRepository) private notificationRepository: NotificationRepository,
    @inject(TYPES.ServiceRepository) private serviceRepository: ServiceRepository,
    @inject(TYPES.WalletTransactionRepository) private walletTransactionRepository: WalletTransactionRepository,
  ) {}

  async addBooking(
    serviceId: string,
    name: string,
    city: string,
    date: string,
    pin: number,
    mobile: number,
    vendorId: string,
    userId: string,
    userNote?: string
  ): Promise<{ status: boolean; message: string; bookingId?: string }> {

    const vendorData = await this.vendorRepository.getById(vendorId);
    if (!vendorData) throw new BaseError("Vendor not found.", 404);

    const serviceData = await this.serviceRepository.getById(serviceId);
    if (!serviceData) {
      return { status: false, message: "Sorry, the selected service is unavailable." };
    }

    // Enforce minimum booking notice
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysUntilEvent = Math.floor((eventDate.getTime() - today.getTime()) / msPerDay);

    if (daysUntilEvent < serviceData.minimumBookingNoticeInDays) {
      return {
        status: false,
        message: `This service requires at least ${serviceData.minimumBookingNoticeInDays} day(s) advance notice.`,
      };
    }

    const isBooked = vendorData.bookedDates.includes(date);
    if (isBooked) {
      return { status: false, message: "Sorry, the selected date is unavailable." };
    }

    // Acquire lock to prevent race conditions
    const lockAcquired = await this.vendorRepository.lockDate(vendorId, date);
    if (!lockAcquired) {
      return { status: false, message: "Sorry, the selected date is unavailable." };
    }

    // Calculate advance amount from service policy
    const advanceAmount = serviceData.getAdvanceAmount();

    const financials: BookingFinancials = {
      totalServicePrice: serviceData.price,
      chargeAmount: advanceAmount,
      walletDeducted: 0,
      stripeAmount: 0,
      adminCommissionPercent: ADMIN_COMMISSION_PERCENT,
      adminCommissionAmount: 0,
      vendorNetAmount: 0,
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
      "payment_pending",
      "Pending",
      financials,
      new Date(),
      userNote ?? null
    );

    const bookingData = await this.bookingRepository.create(newBooking);
    await this.vendorRepository.bookDate(vendorId, date);
    await this.vendorRepository.unlockDate(vendorId, date);

    // Notify vendor about new booking
    const notification = await this.notificationService.createNotification(
      vendorId,
      "New booking received!",
      Types.BOOKING
    );
    await this.notificationRepository.create(notification);

    return {
      status: true,
      message: "Booking created. Please complete payment.",
      bookingId: bookingData.id,
    };
  }

  async getAllBookingsByVendor(
    vendorId: string,
    page: number,
    pageSize: number,
    searchTerm: string,
    paymentStatus: string
  ): Promise<{ bookings: BookingDTO[]; totalPages: number }> {
    const { bookings, totalBookings } =
      await this.bookingRepository.findBookingsByVendorId(
        vendorId,
        page,
        pageSize,
        searchTerm,
        paymentStatus
      );
    const totalPages = Math.ceil(totalBookings / pageSize);
    return { bookings: BookingDTO.fromDomainList(bookings), totalPages };
  }

  async getAllBookingsByUser(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{ bookings: BookingDTO[]; totalPages: number }> {
    const { bookings, totalBookings } =
      await this.bookingRepository.findBookingsByUserId(userId, page, pageSize);
    const totalPages = Math.ceil(totalBookings / pageSize);
    return { bookings: BookingDTO.fromDomainList(bookings), totalPages };
  }

  async getAllBookingsById(bookingId: string): Promise<BookingDTO[]> {
    const bookings = await this.bookingRepository.findBookingsByBookingId(bookingId);
    return BookingDTO.fromDomainList(bookings);
  }

  async cancelBooking(bookingId: string): Promise<BookingDTO> {
    const booking = await this.bookingRepository.getById(bookingId);
    if (!booking) throw new BaseError("Booking not found.", 404);

    // Free the date slot
    await this.vendorRepository.cancelDate(booking.vendorId as string, booking.date);

    const payment = await this.paymentRepository.findOne({ bookingId });
    const wasPaid = !!payment && booking.payment_status === "Completed";

    if (wasPaid) {
      const amountPaid = booking.financials?.chargeAmount ?? 0;

      // How much of that came from the user's wallet
      const walletPortionPaid = booking.financials?.walletDeducted ?? 0;

      const services = await this.serviceRepository.getServicesForVendorProfile(
        booking.vendorId as string
      );
      const service = services.find((s) => s.name === booking.eventName);

      if (!service) {
        throw new BaseError("Service data not found for cancellation policy.", 404);
      }

      const { userRefund, adminKeeps, vendorCompensation, scenario } =
        calculateCancellationResult(
          booking.date,
          new Date(),
          amountPaid,
          service,
          ADMIN_COMMISSION_PERCENT
        );

      const [user, admin] = await Promise.all([
        this.userRepository.getById(booking.userId as string),
        this.adminRepository.findOne({}),
      ]);
      if (!user || !admin) throw new BaseError("User or Admin not found.", 404);

      const paymentDetails = await this.paymentRepository.findByBookingId(bookingId);

      // Scenario 1 — full refund: money back to user from admin wallet
      if (scenario === "full_refund" && userRefund > 0) {
        await this.adminRepository.refundFromWallet(userRefund);
        await this.userRepository.refundToWallet(user.id, userRefund);
 
        const adminBalanceAfterRefund = admin.wallet - userRefund;
        const userBalanceAfterRefund  = user.wallet + userRefund;

        // Admin DEBIT (paying out refund)
        const newTransaction = new WalletTransaction(
          "",
          "admin",
          admin.id,
          "debit",
          "refund_to_user",
          userRefund,
          adminBalanceAfterRefund,
          bookingId,
          paymentDetails?.id ?? null,
          `Refund paid to ${user.name} — ${booking.eventName} (${scenario})`,
          {
            eventName: booking.eventName,
            userName: user.name,
            cancellationScenario: scenario,
          },
          new Date()
        );
        await this.walletTransactionRepository.create(newTransaction);
 
        // User CREDIT (receiving refund)
        const newTransaction2 = new WalletTransaction(
          "",
          "user",
          user.id,
          "credit",
          "refund_from_cancellation",
          userRefund,
          userBalanceAfterRefund,
          bookingId,
          paymentDetails?.id ?? null,
          `Refund credited — cancelled booking for ${booking.eventName}`,
          {
            eventName: booking.eventName,
            vendorName: (booking.vendorId as any)?.name ?? "",
            cancellationScenario: scenario,
          },
          new Date()
        );
        await this.walletTransactionRepository.create(newTransaction2);
      }

      // Scenario 2 — partial refund
      if (scenario === "partial_refund") {
        if (userRefund > 0) {
          await this.adminRepository.refundFromWallet(userRefund);
          await this.userRepository.refundToWallet(user.id, userRefund);
 
          const adminBalanceAfterRefund = admin.wallet - userRefund;
          const userBalanceAfterRefund  = user.wallet + userRefund;

          // Admin DEBIT (paying out refund)
          const newTransaction = new WalletTransaction(
            "",
            "admin",
            admin.id,
            "debit",
            "refund_to_user",
            userRefund,
            adminBalanceAfterRefund,
            bookingId,
            paymentDetails?.id ?? null,
            ` Refund paid to ${user.name} — ${booking.eventName} (${scenario})`,
            {
              eventName: booking.eventName,
              userName: user.name,
              cancellationScenario: scenario,
            },
            new Date()
          );
          await this.walletTransactionRepository.create(newTransaction);
 
          // User CREDIT (receiving refund)
          const newTransaction2 = new WalletTransaction(
            "",
            "user",
            user.id,
            "credit",
            "refund_from_cancellation",
            userRefund,
            userBalanceAfterRefund,
            bookingId,
            paymentDetails?.id ?? null,
            `Refund credited — cancelled booking for ${booking.eventName}`,
            {
              eventName: booking.eventName,
              vendorName: (booking.vendorId as any)?.name ?? "",
              cancellationScenario: scenario,
            },
            new Date()
          );
          await this.walletTransactionRepository.create(newTransaction2);
        }

        // 1. Admin keeps their share
        if (adminKeeps > 0) {
          const adminBalanceAfterFee = admin.wallet - userRefund; // no balance change in admin wallet after refund

          const newTransaction = new WalletTransaction(
            "",
            "admin",
            admin.id,
            "credit",
            "cancellation_admin_fee",
            adminKeeps,
            adminBalanceAfterFee,
            bookingId,
            paymentDetails?.id ?? null,
            `Cancellation fee retained — ${booking.eventName} (${scenario})`,
            {
              eventName: booking.eventName,
              vendorName: (booking.vendorId as any)?.name ?? "",
              userName: user.name,
              cancellationScenario: scenario,
            },
            new Date()
          );
          await this.walletTransactionRepository.create(newTransaction);
        }
        
        // 2. Vendor compensation — admin holds, records it so admin can pay vendor manually
        if (vendorCompensation > 0) {
          const adminBalanceAfterFee = admin.wallet - (userRefund > 0 ? userRefund : 0); // no balance change in admin wallet after refund. Reduce vendor vendor compensation from admin wallet after manual payout(create ledger entry during payout)
          const newTransaction = new WalletTransaction(
            "",
            "admin",
            admin.id,
            "debit",
            "vendor_compensation_held",
            vendorCompensation,
            adminBalanceAfterFee,
            bookingId,
            paymentDetails?.id ?? null,
            `Vendor compensation held pending manual payout — ${booking.eventName}`,
            {
              eventName: booking.eventName,
              vendorName: (booking.vendorId as any)?.name ?? "",
              cancellationScenario: scenario,
            },
            new Date()
          );
          await this.walletTransactionRepository.create(newTransaction);
        }
      }

      // Scenario 3 — no refund: full amount stays with admin minus vendor compensation
      if (scenario === "no_refund") {
        // 1. Admin keeps their share
        if (adminKeeps > 0) {
          const adminBalanceAfterFee = admin.wallet; // no balance change in admin wallet

          const newTransaction = new WalletTransaction(
            "",
            "admin",
            admin.id,
            "credit",
            "cancellation_admin_fee",
            adminKeeps,
            adminBalanceAfterFee,
            bookingId,
            paymentDetails?.id ?? null,
            `Cancellation fee retained — ${booking.eventName} (${scenario})`,
            {
              eventName: booking.eventName,
              vendorName: (booking.vendorId as any)?.name ?? "",
              userName: user.name,
              cancellationScenario: scenario,
            },
            new Date()
          );
          await this.walletTransactionRepository.create(newTransaction);
        }
        
        // 2. Vendor compensation — admin holds, records it so admin can pay vendor manually
        if (vendorCompensation > 0) {
          const adminBalanceAfterFee = admin.wallet; // no balance change in admin wallet. Reduce vendor vendor compensation from admin wallet after manual payout(create ledger entry during payout)
          const newTransaction = new WalletTransaction(
            "",
            "admin",
            admin.id,
            "debit",
            "vendor_compensation_held",
            vendorCompensation,
            adminBalanceAfterFee,
            bookingId,
            paymentDetails?.id ?? null,
            `Vendor compensation held pending manual payout — ${booking.eventName}`,
            {
              eventName: booking.eventName,
              vendorName: (booking.vendorId as any)?.name ?? "",
              cancellationScenario: scenario,
            },
            new Date()
          );
          await this.walletTransactionRepository.create(newTransaction);
        }
      }

      // Update booking financials snapshot for cancellation
      await this.bookingRepository.updateFinancialsOnCancellation(bookingId, {
        cancellationScenario: scenario,
        refundToUser: userRefund,
        adminKeepsOnCancel: adminKeeps,
        vendorCompensationOnCancel: vendorCompensation,
      });

      // Notify vendor about cancellation
      const vendorNotification = await this.notificationService.createNotification(
        booking.vendorId as string,
        `Booking cancelled by user. ${
          vendorCompensation > 0
            ? `You are owed ₹${vendorCompensation} compensation due to cancellation(scenario - ${scenario}).`
            : "No compensation owed. Full amound refunded to user(scenario - no_refund)."
        }`,
        Types.STATUS
      );
      await this.notificationRepository.create(vendorNotification);
    }

    // Update booking status to cancelled
    const updated = await this.bookingRepository.updateBookingStatus(
      bookingId,
      "cancelled"
    );
    if (!updated) throw new BaseError("Failed to cancel booking.", 500);

    return BookingDTO.fromDomain(updated);
  }

  // MARK PAYMENT FAILED - Called when Stripe redirects to cancel_url or payment explicitly fails.
  // Sets a 30-minute retry window.
  async markPaymentFailed(bookingId: string): Promise<BookingDTO> {
    const booking = await this.bookingRepository.getById(bookingId);
    if (!booking) throw new BaseError("Booking not found.", 404);

    // Only mark failed if still in payment_pending and not already failed/cancelled
    if (booking.status !== "payment_pending") {
      throw new BaseError("Booking is not in a payment pending state.", 400);
    }

    const now = new Date();
    const retryDeadline = new Date(now.getTime() + 30 * 60 * 1000); // +30 minutes

    await this.bookingRepository.markPaymentFailed(bookingId, now, retryDeadline);

    const updated = await this.bookingRepository.getById(bookingId);
    if (!updated) throw new BaseError("Failed to update booking.", 500);

    return BookingDTO.fromDomain(updated);
  }

  // Finds all payment_pending bookings whose retryDeadline has passed and marks them as failed, freeing the date slot.
  async autoFailExpiredBookings(): Promise<number> {
    const expiredBookings = await this.bookingRepository.findExpiredPaymentPendingBookings();
    let count = 0;

    for (const booking of expiredBookings) {
      try {
        await this.vendorRepository.cancelDate(booking.vendorId as string, booking.date);
        await this.bookingRepository.updateBookingStatus(booking.id, "failed");
        count++;
      } catch (err) {
        console.error(`Failed to auto-fail booking ${booking.id}:`, err);
      }
    }

    return count;
  }

  async updateAdminRemark(bookingId: string, remark: string): Promise<BookingDTO> {
    const booking = await this.bookingRepository.getById(bookingId);
    if (!booking) throw new BaseError("Booking not found.", 404);

    await this.bookingRepository.updateAdminRemark(bookingId, remark);

    const updated = await this.bookingRepository.getById(bookingId);
    if (!updated) throw new BaseError("Failed to update remark.", 500);

    return BookingDTO.fromDomain(updated);
  }

  // Vendor can no longer Accept/Reject — only mark Completed post-event.
  async markBookingCompleted(bookingId: string): Promise<BookingDTO> {
    const booking = await this.bookingRepository.getById(bookingId);
    if (!booking) throw new BaseError("Booking not found.", 404);

    const updated = await this.bookingRepository.updateBookingStatus(bookingId, "completed");
    if (!updated) throw new BaseError("Failed to update booking status.", 500);

    await this.vendorRepository.updateBookingCount(booking.vendorId as string);

      // Notify user
      const notification = await this.notificationService.createNotification(
        booking.userId as string,
        "Your event has been marked as completed!",
        Types.STATUS
      );
      await this.notificationRepository.create(notification);

    return BookingDTO.fromDomain(updated);
  }
}