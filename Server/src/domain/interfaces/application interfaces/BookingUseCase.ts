import { BookingDTO, ExtendedBookingDTO } from "../../dtos/BookingDTO";

export interface BookingUseCase {
  addBooking(
    serviceId: string,
    name: string,
    city: string,
    date: string,
    pin: number,
    mobile: number,
    vendorId: string,
    userId: string,
    userNote?: string
  ): Promise<{status: boolean, message: string, bookingId?: string}>;
  getAllBookingsForAdmin(
    page: number,
    pageSize: number,
    searchTerm: string,
    paymentStatus: string,
    vendorId?: string,
    year?: number,
    month?: number
  ): Promise<{ bookings: ExtendedBookingDTO[]; totalPages: number }>;
  payVendorCommission(bookingId: string): Promise<{ status: boolean; message: string }>;
  getVerifiedVendorsForFilter(): Promise<{ id: string; name: string }[]>;
  getAllBookingsByVendor(
    vendorId: string,
    page: number,
    pageSize: number,
    searchTerm: string,
    paymentStatus: string
  ): Promise<{ bookings: ExtendedBookingDTO[]; totalPages: number }>;
  getAllBookingsByUser(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{ bookings: BookingDTO[]; totalPages: number }>;
  getAllBookingsById(bookingId: string): Promise<BookingDTO[]>;
  cancelBooking(bookingId: string): Promise<BookingDTO>;
  markPaymentFailed(bookingId: string): Promise<BookingDTO>;
  autoFailExpiredBookings(): Promise<number>;
  updateAdminRemark(bookingId: string, remark: string): Promise<BookingDTO>;
  markBookingCompleted(bookingId: string): Promise<BookingDTO>;
}