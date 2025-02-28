import { BookingDTO } from "../../dtos/BookingDTO";

export interface BookingUseCase {
  addBooking(
    serviceId: string,
    name: string,
    city: string,
    date: string,
    pin: number,
    mobile: number,
    vendorId: string,
    userId: string
  ): Promise<{status: boolean, message: string}>;
  getAllBookingsByVendor(
    vendorId: string,
    page: number,
    pageSize: number,
    searchTerm: string,
    paymentStatus: string
  ): Promise<{ bookings: BookingDTO[]; totalPages: number }>;
  getAllBookingsByUser(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{ bookings: BookingDTO[]; totalPages: number }>;
  getTransactions(userId: string, page: number, pageSize: number): Promise<{ wallet: number, transaction: BookingDTO[], totalPages: number }>;
  getAllBookingsById(bookingId: string): Promise<BookingDTO[]>;
  updateStatusById(bookingId: string, status: string): Promise<BookingDTO>;
}