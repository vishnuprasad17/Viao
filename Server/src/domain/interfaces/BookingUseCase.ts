import { BookingDTO } from "../dtos/BookingDTO";

export interface BookingUseCase {
  addBooking(
    eventName: string,
    name: string,
    city: string,
    date: string,
    pin: number,
    mobile: number,
    vendorId: string,
    userId: string
  ): Promise<{ booking: BookingDTO; message: string }>;
  getAllBookingsByVendor(
    vendorId: string,
    page: number,
    pageSize: number
  ): Promise<{ bookings: BookingDTO[]; totalPages: number }>;
  getAllBookingsByUser(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{ bookings: BookingDTO[]; totalPages: number }>;
}