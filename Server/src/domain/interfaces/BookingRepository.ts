import { Booking } from "../entities/Booking";
export interface BookingRepository {
  create(booking: Booking): Promise<Booking>;

  findBookingsByVendorId(vendorId: string, page: number, pageSize: number): Promise<{bookings: Booking[], totalBookings: number}>;
  findBookingsByUserId(userId: string, page: number, pageSize: number): Promise<{bookings: Booking[], totalBookings: number}>;
}