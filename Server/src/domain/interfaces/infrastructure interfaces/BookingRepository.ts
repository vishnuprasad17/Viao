import { Booking } from "../../entities/Booking";
export interface BookingRepository {
  create(booking: Booking): Promise<Booking>;
  getById(id: string): Promise<Booking | null>;
  countDocuments(condition?:Record<string,unknown>):Promise<number>;

  findAllBookingsForAdmin(
  page: number,
  pageSize: number,
  searchTerm: string,
  paymentStatus: string,
  vendorId?: string,
  year?: number,
  month?: number
): Promise<{ bookings: Booking[]; totalBookings: number }>;
  findBookingsByVendorId(vendorId: string, page: number, pageSize: number, searchTerm: string, paymentStatus: string): Promise<{bookings: Booking[], totalBookings: number}>;
  findBookingsByUserId(userId: string, page: number, pageSize: number): Promise<{bookings: Booking[], totalBookings: number}>;
  findBookingsByBookingId(bookingId: string): Promise<Booking[]>;
  updatePaymentStatus(bookingId: string): Promise<Booking | null>;
  updateBookingStatus(bookingId: string, status: string): Promise<Booking | null>;
  markPaymentFailed(bookingId: string, failedAt: Date, retryDeadline: Date): Promise<boolean>;
  findExpiredPaymentPendingBookings(): Promise<Booking[]>;
  updateAdminRemark(bookingId: string, remark: string): Promise<boolean>;
  updateFinancialsOnWalletDeduction(bookingId: string, walletDeducted: number): Promise<boolean>;
  updateFinancialsOnPaymentComplete(
    bookingId: string,
    data: {
      walletDeducted: number;
      stripeAmount: number;
      adminCommissionPercent: number;
      adminCommissionAmount: number;
      vendorNetAmount: number;
      modeOfPayment: string;
    }
  ): Promise<boolean>;
  updateFinancialsOnCancellation(
    bookingId: string,
    data: {
      cancellationScenario: "full_refund" | "partial_refund" | "no_refund";
      refundToUser: number;
      adminKeepsOnCancel: number;
      vendorCompensationOnCancel: number;
    }
  ): Promise<boolean>;
  getAdminRevenueDetails(start: Date, end: Date,
    groupBy:
      | {
          day: {
            $isoDayOfWeek: string;
          };
        }
      | {
          month: {
            $month: string;
          };
        }
      | {
          year: {
            $year: string;
          };
        },
    sortField: string
  ): Promise<Array<{ _id: { [key: string]: number }; totalRevenue: number }>>;
  getVendorRevenueDetails(vendorId: string, start: Date, end: Date,
    groupBy: 
      | {
          day: {
            $isoDayOfWeek: string;
          };
        }
      | {
          month: {
            $month: string;
          };
        }
      | {
          year: {
            $year: string;
          };
        },
    sortField: string
  ): Promise<{ _id: { day?: number; month?: number; year?: number }; totalRevenue: number }[]>;
}