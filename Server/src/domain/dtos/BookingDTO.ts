import { Booking } from "../entities/Booking";
import { UserDTO } from "./UserDTO";
import { VendorDTO } from "./VendorDTO";

export class BookingDTO {
  constructor(
    public id: string,
    public name: string,
    public date: string,
    public eventName: string,
    public city: string,
    public pin: number,
    public mobile: number,
    public vendorId: string | VendorDTO,
    public userId: string | UserDTO,
    public status: string,
    public payment_status: string,
    public totalServicePrice: number,
    public chargeAmount: number,
    public refundToUser: number,
    public createdAt: Date,
    public userNote: string | null,
    public adminRemark: string | null,
    public paymentFailedAt: Date | null,
    public retryDeadline: Date | null,
    public retryAllowed: boolean,
    public retrySecondsRemaining: number,
  ) {}

  static fromDomain(booking: Booking): BookingDTO {
    const vendorDTO = typeof booking.vendorId === "string" ? booking.vendorId : VendorDTO.fromDomain(booking.vendorId);
    const userDTO = typeof booking.userId === "string" ? booking.userId : UserDTO.fromDomain(booking.userId);
    return new BookingDTO(
      booking.id,
      booking.name,
      booking.date,
      booking.eventName,
      booking.city,
      booking.pin,
      booking.mobile,
      vendorDTO,
      userDTO,
      booking.status,
      booking.payment_status,
      booking.financials.totalServicePrice,
      booking.financials.chargeAmount,
      booking.financials.refundToUser ?? 0,
      booking.createdAt,
      booking.userNote ?? null,
      booking.adminRemark ?? null,
      booking.paymentFailedAt ?? null,
      booking.retryDeadline ?? null,
      booking.isRetryAllowed(),
      booking.retrySecondsRemaining(),
    );
  }

  static fromDomainList(bookings: Booking[]): BookingDTO[] {
    return bookings.map(BookingDTO.fromDomain);
  }
}

export type ExtendedBookingDTO = BookingDTO & {
  vendorCommission: number;
  commissionPaid: boolean;
  commissionPayable: boolean;
};