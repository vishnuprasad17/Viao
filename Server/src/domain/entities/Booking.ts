import { User } from "./User";
import { Vendor } from "./Vendor";

export interface BookingFinancials {
  totalServicePrice: number;
  chargeAmount: number;
  walletDeducted: number;
  stripeAmount: number;
  adminCommissionPercent: number;
  adminCommissionAmount: number;
  vendorNetAmount: number;

  cancellationScenario?: "full_refund" | "partial_refund" | "no_refund" | null;
  refundToUser?: number;
  adminKeepsOnCancel?: number;
  vendorCompensationOnCancel?: number;
}

export class Booking {
  constructor(
    public id: string,
    public name: string,
    public date: string,
    public eventName: string,
    public city: string,
    public pin: number,
    public mobile: number,
    public vendorId: string | Vendor,
    public userId: string | User,
    public status: string,
    public payment_status: string,
    
    /** Immutable financial snapshot */
    public readonly financials: BookingFinancials,

    public readonly createdAt: Date,
    public userNote?: string | null,
    public adminRemark?: string | null,
    public paymentFailedAt?: Date | null,
    public retryDeadline?: Date | null,
  ) {}

  updateFields(fields: Partial<Booking>) {
    if (fields.status !== undefined) this.status = fields.status;
    if (fields.payment_status !== undefined) this.payment_status = fields.payment_status;
    if (fields.adminRemark !== undefined) this.adminRemark = fields.adminRemark;
    if (fields.paymentFailedAt !== undefined) this.paymentFailedAt = fields.paymentFailedAt;
    if (fields.retryDeadline !== undefined) this.retryDeadline = fields.retryDeadline;
  }

  // Check if the retry window is still open
  isRetryAllowed(): boolean {
    if (!this.retryDeadline) return false;
    return new Date() < this.retryDeadline;
  }

  // Remaining seconds until retry deadline expires
  retrySecondsRemaining(): number {
    if (!this.retryDeadline) return 0;
    const diff = this.retryDeadline.getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  }
}