import { UserData } from "./userTypes";
import { VendorData } from "./vendorTypes";

export interface Review {
  id: string;
  vendorId: VendorData
  userId: UserData;
  rating: number;
  content: string;
  reply: Array<string>;
  createdAt: Date;
  replyAt: Date;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: string;
}

export interface Service {
  id: string;
  vendorId: string;
  name: string;
  price: number;
  advancePercentage: number,
  minimumBookingNoticeInDays: number,
  cancellationFullRefundBeforeDays: number,
  cancellationPartialRefundBeforeDays: number | null,
  partialRefundPercentage: number | null,
  advanceAmount: number,
  createdAt?: Date,
  updatedAt?: Date
}

export interface ServiceFormData {
  name: string;
  price: number;
  advancePercentage: number;
  minimumBookingNoticeInDays: number;
  cancellationFullRefundBeforeDays: number;
  cancellationPartialRefundBeforeDays?: number | null;
  partialRefundPercentage?: number | null;
}

export interface Booking {
  id: string;
  name: string;
  date: string;
  eventName: string;
  city: string;
  pin: number;
  mobile: number,
  vendorId: string | VendorData,
  userId: string | UserData,
  status: string,
  payment_status: string,
  totalServicePrice: number,
  chargeAmount: number,
  refundToUser: number,
  createdAt: Date,
  userNote: string | null,
  adminRemark: string | null,
  paymentFailedAt: Date | null,
  retryDeadline: Date | null,
  retryAllowed: boolean,
  retrySecondsRemaining: number,
}

export interface Payment {
  id: string;
  amount: number;
  vendorId: VendorData;
  userId: UserData;
  bookingId: Booking;
  modeOfPayment: string;
  transactionRef: string;
  createdAt: Date;
}

export type WalletActor = "user" | "admin";
export type WalletDirection = "credit" | "debit";
export type WalletTxType =
  // ── Booking payment ──────────────────────────────────────────────────
  | "wallet_used_for_booking"       // user's wallet debited at booking time
  | "stripe_payment_received"       // admin receives stripe portion
  | "wallet_payment_received"       // admin receives wallet portion (mirrors user's debit)
  // ── Cancellation ─────────────────────────────────────────────────────
  | "refund_to_user"                // admin pays refund out
  | "refund_from_cancellation"      // user receives refund into wallet
  | "cancellation_admin_fee"        // admin keeps their share on cancellation
  | "vendor_compensation_held"     // admin holds vendor compensation (manual payout later)
  | "vendor_compensation_paid";     // admin pays vendor compensation

export interface WalletTransaction {
  id: string;
  direction: WalletDirection;
  type: WalletTxType;
  amount: number;
  balanceAfter: number,
  description: string,
  eventName?: string,
  vendorName?: string,
  userName?: string,
  modeOfPayment?: string,
  cancellationScenario?: string;
  createdAt: Date,
}

export interface VendorType {
  id: string;
  type: string;
  status: boolean;
  imageUrl:string;
}

export interface Chats {
  id:string;
  members: string[];
  recentMessage: string;
  updatedAt:Date;
  createdAt:Date;
}

export interface Messages {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  imageName: string;
  imageUrl: string;
  isRead: boolean;
  isDeleted: boolean;
  status?: 'sending' | 'sent' | 'failed';
  deletedIds: string[];
  createdAt:number;
}