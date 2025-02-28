import { inject, injectable } from "inversify";
import { PaymentUseCase } from "../../domain/interfaces/application interfaces/PaymentUseCase";
import { PaymentRepository } from "../../domain/interfaces/infrastructure interfaces/PaymentRepository";
import TYPES from "../../domain/constants/inversifyTypes";
import { Session } from "express-session";
import Stripe from "stripe";
import { Payment } from "../../domain/entities/Payment";
import { BookingRepository } from "../../domain/interfaces/infrastructure interfaces/BookingRepository";
import { PaymentDTO } from "../../domain/dtos/PaymentDTO";
import { NotificationService } from "../../domain/interfaces/application interfaces/NotificationService";
import { NotificationRepository } from "../../domain/interfaces/infrastructure interfaces/NotificationRepository";
import { AdminRepository } from "../../domain/interfaces/infrastructure interfaces/AdminRepository";
import { Types } from "../../domain/constants/notificationTypes";
import { BaseError } from "../../domain/errors/BaseError";
import { UserRepository } from "../../domain/interfaces/infrastructure interfaces/UserRepository";
import { VendorRepository } from "../../domain/interfaces/infrastructure interfaces/VendorRepository";

const generateTransactionRef = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = '';
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TXN-${ref}`;
};

@injectable()
export class PaymentUseCaseImpl implements PaymentUseCase {
  constructor(
    @inject(TYPES.PaymentRepository)
    private paymentRepository: PaymentRepository,
    @inject(TYPES.BookingRepository)
    private bookingRepository: BookingRepository,
    @inject(TYPES.NotificationRepository)
    private notificationRepository: NotificationRepository,
    @inject(TYPES.AdminRepository) private adminRepository: AdminRepository,
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.VendorRepository) private vendorRepository: VendorRepository,
    @inject(TYPES.NotificationService)
    private notificationService: NotificationService
  ) {}

  async pay(
    userId: string,
    vendorId: string,
    bookingId: string,
    name: string,
    logoUrl: string,
    useWallet: boolean
  ): Promise<string | null> {
    const booking = await this.bookingRepository.getById(bookingId);
    const user = await this.userRepository.getById(userId);
    const vendor = await this.vendorRepository.getById(vendorId);
    const admin = await this.adminRepository.findOne({});
    if (!booking || !user || !vendor || !admin) throw new Error("Data not found");

    // Validate amount
    if (typeof booking.amount !== "number" || booking.amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    let deductibleAmount = 0;
  if (useWallet) {
    deductibleAmount = Math.min(user.wallet, booking.amount);
    
    if (deductibleAmount > 0) {
      // Update wallets
      await this.userRepository.deductFromWallet(user.id, deductibleAmount);
      await this.adminRepository.updateWallet(deductibleAmount);

      // Update booking
      await this.bookingRepository.updatedeductedAmount(booking.id, deductibleAmount);
    }
  }

  const remainingAmount = booking.amount - deductibleAmount;

  if (remainingAmount <= 0) {
    const payment = new Payment(
      "",
      deductibleAmount,
      vendorId,
      userId,
      bookingId,
      "Wallet",
      generateTransactionRef(),
      new Date()
    );

    await this.paymentRepository.create(payment);

    await this.bookingRepository.updatePaymentStatus(bookingId);
    // Notification for vendor
    const vendorNotificationMessage = "Payment completed!";
    const vendorNotificationType = Types.PAYMENT;
    const vendorNotification =
      await this.notificationService.createNotification(
        vendorId,
        vendorNotificationMessage,
        vendorNotificationType
      );
    await this.notificationRepository.create(vendorNotification);

    // Notification for admin
    const adminNotificationMessage = `${deductibleAmount} got credited to wallet`;
    const adminNotificationType = Types.WALLET;
    const adminNotification = await this.notificationService.createNotification(
      admin.id,
      adminNotificationMessage,
      adminNotificationType
    );
    await this.notificationRepository.create(adminNotification);
    const status = "completed"

    return status;
  }

    const stripe = new Stripe(process.env.STRIPE_KEY!, {
      apiVersion: "2025-01-27.acacia",
      typescript: true,
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${name} Booking`,
              images: [logoUrl],
              metadata: { bookingId },
            },
            unit_amount: remainingAmount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      cancel_url: `${process.env.CLIENT_URL}/booking/${bookingId}`,
      metadata: {
        bookingId,
        userId,
        vendorId,
        deductibleAmount,
        payment_mode: useWallet === true ? "Stripe + Wallet" : "Stripe"
      },
    });

    return checkoutSession.url;
  }

  async verifyAndAddNewPayment(sessionId: string): Promise<PaymentDTO> {
    //Verify & Add Payment
    const stripe = new Stripe(process.env.STRIPE_KEY!);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      throw new BaseError(
        "Payment not yet confirmed. Please refresh in a moment.",
        404
      );
    }

    // Validate metadata
    if (
      !session.metadata?.bookingId ||
      !session.metadata.userId ||
      !session.metadata.vendorId ||
      !session.metadata.deductibleAmount ||
      !session.metadata.payment_mode
    ) {
      throw new BaseError("Invalid payment metadata", 404);
    }

    const { bookingId, userId, vendorId, deductibleAmount, payment_mode } = session.metadata;
    const amount = session.amount_total ? session.amount_total / 100 : 0;

    const existingPayment = await this.paymentRepository.findOne({
      bookingId: bookingId,
    });

    if (existingPayment) {
      return PaymentDTO.fromDomain(existingPayment);
    }

    const totalAmount = parseInt(deductibleAmount) > 0 ? amount + parseInt(deductibleAmount) : amount;

    const payment = new Payment(
      "",
      totalAmount,
      vendorId,
      userId,
      bookingId,
      payment_mode,
      generateTransactionRef(),
      new Date()
    );

    const newPayment = await this.paymentRepository.create(payment);

    await this.bookingRepository.updatePaymentStatus(bookingId);
    // Notification for vendor
    const vendorNotificationMessage = "Payment completed!";
    const vendorNotificationType = Types.PAYMENT;
    const vendorNotification =
      await this.notificationService.createNotification(
        vendorId,
        vendorNotificationMessage,
        vendorNotificationType
      );
    await this.notificationRepository.create(vendorNotification);

    const AdminData = await this.adminRepository.findOne({});
    if (AdminData && amount !== undefined) {
      await this.adminRepository.updateWallet(amount);
    }

    // Notification for admin
    const adminNotificationMessage = `${totalAmount} got credited to wallet`;
    const adminNotificationType = Types.WALLET;
    const adminNotification = await this.notificationService.createNotification(
      AdminData?.id as string,
      adminNotificationMessage,
      adminNotificationType
    );
    await this.notificationRepository.create(adminNotification);

    return PaymentDTO.fromDomain(newPayment);
  }

  async getPayments(
    page: number,
    pageSize: number
  ): Promise<{ payment: PaymentDTO[]; totalPages: number }> {
    const { payment, count } = await this.paymentRepository.findAllPayments(
      page,
      pageSize
    );
    const paymentDto = PaymentDTO.fromDomainList(payment);
    const totalPages = Math.ceil(count / pageSize);

    return { payment: paymentDto, totalPages };
  }
}