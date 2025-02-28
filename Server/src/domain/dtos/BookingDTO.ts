import { Booking } from "../entities/Booking";
import { UserDTO } from "./UserDTO";
import { VendorDTO } from "./VendorDTO";

export class BookingDTO {
    id: string;
    date: string;
    name: string;
    eventName: string;
    city: string;
    pin: number;
    mobile: number;
    vendorId: string | VendorDTO;
    userId: string | UserDTO;
    status: string;
    payment_status: string;
    amount: number;
    refundAmount:number;
    deductedFromWallet: number;
    createdAt: Date;
  
    constructor(booking: Booking) {
      this.id = booking.id;
      this.date = booking.date;
      this.name = booking.name;
      this.eventName = booking.eventName;
      this.city = booking.city;
      this.pin = booking.pin;
      this.mobile = booking.mobile;
      if (typeof booking.vendorId === "string") {
        this.vendorId = booking.vendorId;
      } else {
        this.vendorId = VendorDTO.fromDomain(booking.vendorId);
      }
      if (typeof booking.userId === "string") {
        this.userId = booking.userId;
      } else {
        this.userId = UserDTO.fromDomain(booking.userId);
      }
      this.status = booking.status;
      this.payment_status = booking.payment_status;
      this.amount = booking.amount;
      this.refundAmount = booking.refundAmount;
      this.deductedFromWallet = booking.deductedFromWallet;
      this.createdAt = booking.createdAt;
    }
  
    static fromDomain(booking: Booking): BookingDTO {
      return new BookingDTO(booking);
    }
    
    static fromDomainList(bookings: Booking[]): BookingDTO[] {
      return bookings.map(booking => new BookingDTO(booking));
    }
  }