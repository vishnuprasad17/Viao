import { Booking } from "../../entities/Booking";
export interface BookingRepository {
  create(booking: Booking): Promise<Booking>;
  getById(id: string): Promise<Booking | null>;
  countDocuments(condition?:Record<string,unknown>):Promise<number>;

  findBookingsByVendorId(vendorId: string, page: number, pageSize: number, searchTerm: string, paymentStatus: string): Promise<{bookings: Booking[], totalBookings: number}>;
  findBookingsByUserId(userId: string, page: number, pageSize: number): Promise<{bookings: Booking[], totalBookings: number}>;
  findRefundForUser(userId: string, page: number, pageSize: number): Promise<{refund: Booking[], totalRefund: number}>;
  findBookingsByBookingId(bookingId: string): Promise<Booking[]>;
  updatePaymentStatus(bookingId: string): Promise<Booking | null>;
  updateRefundAmount(bookingId:string, amount: number): Promise<boolean>;
  updateBookingStatus(bookingId: string, status: string): Promise<Booking | null>;
  updatedeductedAmount(bookingId:string, amount: number): Promise<boolean>;
}