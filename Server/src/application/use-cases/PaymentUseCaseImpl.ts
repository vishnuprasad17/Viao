import { inject, injectable } from "inversify";
import { PaymentUseCase } from "../../domain/interfaces/application interfaces/PaymentUseCase";
import { PaymentRepository } from "../../domain/interfaces/infrastructure interfaces/PaymentRepository";
import TYPES from "../../domain/constants/inversifyTypes";
import Stripe from "stripe";
import { Payment } from "../../domain/entities/Payment";
import { WalletTransaction } from "../../domain/entities/WalletTransaction";
import { BookingRepository } from "../../domain/interfaces/infrastructure interfaces/BookingRepository";
import { PaymentDTO } from "../../domain/dtos/PaymentDTO";
import { NotificationService } from "../../domain/interfaces/application interfaces/NotificationService";
import { NotificationRepository } from "../../domain/interfaces/infrastructure interfaces/NotificationRepository";
import { AdminRepository } from "../../domain/interfaces/infrastructure interfaces/AdminRepository";
import { Types } from "../../domain/constants/notificationTypes";
import { BaseError } from "../../domain/errors/BaseError";
import { UserRepository } from "../../domain/interfaces/infrastructure interfaces/UserRepository";
import { VendorRepository } from "../../domain/interfaces/infrastructure interfaces/VendorRepository";
import { WalletTransactionRepository } from "../../domain/interfaces/infrastructure interfaces/WalletTransactionRepository";

// Admin commission percentage
const ADMIN_COMMISSION_PERCENT = 10;

const generateTransactionRef = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "";
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TXN-${ref}`;
};

@injectable()
export class PaymentUseCaseImpl implements PaymentUseCase {
  constructor(
    @inject(TYPES.PaymentRepository) private paymentRepository: PaymentRepository,
    @inject(TYPES.WalletTransactionRepository) private walletTxRepo: WalletTransactionRepository,
    @inject(TYPES.BookingRepository) private bookingRepository: BookingRepository,
    @inject(TYPES.NotificationRepository) private notificationRepository: NotificationRepository,
    @inject(TYPES.AdminRepository) private adminRepository: AdminRepository,
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.VendorRepository) private vendorRepository: VendorRepository,
    @inject(TYPES.NotificationService) private notificationService: NotificationService
  ) {}

  async pay(
    userId: string,
    vendorId: string,
    bookingId: string,
    name: string,
    logoUrl: string,
    useWallet: boolean
  ): Promise<string | null> {
    const [booking, user, vendor, admin] = await Promise.all([
      this.bookingRepository.getById(bookingId),
      this.userRepository.getById(userId),
      this.vendorRepository.getById(vendorId),
      this.adminRepository.findOne({}),
    ]);

    if (!booking || !user || !vendor || !admin) {
      throw new BaseError("Required data not found.", 404);
    }

    // Guard: must be payment_pending (or failed but within retry window)
    const isPaymentPending = booking.status === "payment_pending";
    const isRetryAllowed =
      booking.status === "payment_pending" &&
      booking.isRetryAllowed();

    if (!isPaymentPending && !isRetryAllowed) {
      throw new BaseError("This booking is not eligible for payment.", 400);
    }

    const chargeAmount =
      booking.financials?.chargeAmount > 0
        ? booking.financials.chargeAmount
        : booking.financials?.totalServicePrice ?? 0;

    if (typeof chargeAmount !== "number" || chargeAmount <= 0) {
      throw new BaseError("Invalid payment amount.", 400);
    }

    // Wallet deduction
    let walletDeducted = 0;
    if (useWallet && user.wallet > 0) {
      walletDeducted = Math.min(user.wallet, chargeAmount);
      const paymentDetails = await this.paymentRepository.findByBookingId(bookingId);
      
      // 1. Deduct from user wallet
      await this.userRepository.deductFromWallet(user.id, walletDeducted);
      const userBalanceAfter = user.wallet - walletDeducted;
 
      // 2. Credit admin wallet
      await this.adminRepository.updateWallet(walletDeducted);
      const adminBalanceAfter = admin.wallet + walletDeducted;
 
      // 3. Ledger: user DEBIT
      const newTransaction1 = new WalletTransaction(
        "",
        "user",
        user.id,
        "debit",
        "wallet_used_for_booking",
        walletDeducted,
        userBalanceAfter,
        bookingId,
        paymentDetails?.id ?? null,
        `Wallet used for booking — ${booking.eventName} with ${vendor.name}`,
        { eventName: booking.eventName, vendorName: vendor.name, modeOfPayment: "Wallet" },
        new Date()
      );
      await this.walletTxRepo.create(newTransaction1);
 
      // 4. Ledger: admin CREDIT
      const newTransaction2 = new WalletTransaction(
        "",
        "admin",
        admin.id,
        "credit",
        "wallet_payment_received",
        walletDeducted,
        adminBalanceAfter,
        bookingId,
        paymentDetails?.id ?? null,
        `Wallet payment received — ${booking.eventName} booked by ${user.name}`,
        { eventName: booking.eventName, vendorName: vendor.name, userName: user.name, modeOfPayment: "Wallet" },
        new Date()
      );
      await this.walletTxRepo.create(newTransaction2);
 
      // 5. Record on booking snapshot
      await this.bookingRepository.updateFinancialsOnWalletDeduction(bookingId, walletDeducted);
    }

    const remainingAmount = chargeAmount - walletDeducted;

    // Full wallet payment (nothing left for Stripe)
    if (remainingAmount <= 0) {
      const adminCommission = Math.round(chargeAmount * ADMIN_COMMISSION_PERCENT / 100);
      const vendorNet = chargeAmount - adminCommission;

      const payment = new Payment(
        "",
        walletDeducted,
        vendorId,
        userId,
        bookingId,
        "Wallet",
        generateTransactionRef(),
        new Date()
      );
      const savedPayment = await this.paymentRepository.create(payment);

      // Mark booking as confirmed
      await this.bookingRepository.updatePaymentStatus(bookingId);
      await this.bookingRepository.updateBookingStatus(bookingId, "confirmed");

      // Finalize booking snapshot
      await this.bookingRepository.updateFinancialsOnPaymentComplete(bookingId, {
        walletDeducted,
        stripeAmount: 0,
        adminCommissionPercent: ADMIN_COMMISSION_PERCENT,
        adminCommissionAmount: adminCommission,
        vendorNetAmount: vendorNet,
        modeOfPayment: "Wallet",
      });

      // Notify vendor
      const vendorNotification = await this.notificationService.createNotification(
        vendorId,
        "Payment completed via wallet!",
        Types.PAYMENT
      );
      await this.notificationRepository.create(vendorNotification);

      // Notify admin
      const adminNotification = await this.notificationService.createNotification(
        admin.id,
        `₹${walletDeducted} credited to wallet from booking`,
        Types.WALLET
      );
      await this.notificationRepository.create(adminNotification);

      return "completed";
    }

    // ── Stripe checkout ───────────────────────────────────────────────────────
    const stripe = new Stripe(process.env.STRIPE_KEY!, {
      apiVersion: "2026-01-28.clover",
      typescript: true,
    });

    const session = await stripe.checkout.sessions.create({
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
      cancel_url: `${process.env.CLIENT_URL}/payment-failed?booking_id=${booking.id}`,
      metadata: {
        bookingId,
        userId,
        vendorId,
        walletDeducted: walletDeducted.toString(),
        chargeAmount:   chargeAmount.toString(),
        payment_mode:   walletDeducted > 0 ? "Stripe + Wallet" : "Stripe",
        eventName:      booking.eventName,
        vendorName:     vendor.name,
        userName:       user.name,
      },
    });

    return session.url;
  }

  async verifyAndAddNewPayment(sessionId: string): Promise<PaymentDTO> {
    const stripe = new Stripe(process.env.STRIPE_KEY!);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      throw new BaseError("Payment not yet confirmed. Please refresh in a moment.", 404);
    }

    const {
      bookingId, userId, vendorId,
      walletDeducted: walletDeductedStr,
      chargeAmount: chargeAmountStr,
      payment_mode,
      eventName,
      vendorName,
      userName,
    } = session.metadata ?? {};
 
    if (!bookingId || !userId || !vendorId) {
      throw new BaseError("Invalid payment metadata.", 404);
    }

    // Idempotency: if payment already recorded, return it
    const existingPayment = await this.paymentRepository.findOne({ bookingId });
    if (existingPayment) {
      return PaymentDTO.fromDomain(existingPayment);
    }

    const walletDeducted = parseInt(walletDeductedStr ?? "0");
    const stripeAmount   = session.amount_total ? session.amount_total / 100 : 0;
    const totalAmount    = stripeAmount + walletDeducted;
 
    const adminCommission = Math.round(totalAmount * ADMIN_COMMISSION_PERCENT / 100);
    const vendorNet       = totalAmount - adminCommission;

    const payment = new Payment(
      "",
      totalAmount,
      vendorId,
      userId,
      bookingId,
      payment_mode ?? "Stripe",
      generateTransactionRef(),
      new Date()
    );

    const savedPayment = await this.paymentRepository.create(payment);

    // Mark payment complete and booking confirmed
    await this.bookingRepository.updatePaymentStatus(bookingId);
    await this.bookingRepository.updateBookingStatus(bookingId, "confirmed");

    // Finalize booking snapshot
    await this.bookingRepository.updateFinancialsOnPaymentComplete(bookingId, {
      walletDeducted,
      stripeAmount,
      adminCommissionPercent: ADMIN_COMMISSION_PERCENT,
      adminCommissionAmount: adminCommission,
      vendorNetAmount: vendorNet,
      modeOfPayment: payment_mode ?? "Stripe",
    });

    const admin = await this.adminRepository.findOne({});
    if (!admin) throw new BaseError("Admin not found.", 404)

    // Credit Stripe portion to admin wallet
    if (stripeAmount > 0) {
      await this.adminRepository.updateWallet(stripeAmount);
      const adminBalanceAfter = admin.wallet + stripeAmount;
 
      // Ledger: admin CREDIT for stripe portion
      const newTransaction = new WalletTransaction(
        "",
        "admin",
        admin.id,
        "credit",
        "stripe_payment_received",
        stripeAmount,
        adminBalanceAfter,
        bookingId,
        savedPayment.id,
        `Stripe payment received — ${eventName} booked by ${userName}`,
        { eventName, vendorName, userName, modeOfPayment: payment_mode ?? "Stripe" },
        new Date()
      );
      await this.walletTxRepo.create(newTransaction);
    }

    // Notify vendor
    const vendorNotification = await this.notificationService.createNotification(
      vendorId,
      "Payment completed!",
      Types.PAYMENT
    );
    await this.notificationRepository.create(vendorNotification);

    // Notify admin
    if (admin) {
      const adminNotification = await this.notificationService.createNotification(
        admin.id,
        `₹${totalAmount} received from booking`,
        Types.WALLET
      );
      await this.notificationRepository.create(adminNotification);
    }

    return PaymentDTO.fromDomain(savedPayment);
  }
  async getPayments(
    page: number,
    pageSize: number
  ): Promise<{ payment: PaymentDTO[]; totalPages: number }> {
    const { payment, count } = await this.paymentRepository.findAllPayments(
      page,
      pageSize
    );
    const totalPages = Math.ceil(count / pageSize);
    return { payment: PaymentDTO.fromDomainList(payment), totalPages };
  }
}