import { Booking } from "../entities/Booking";

export class BookingDTO {
    id: string;
    date: string;
    name: string;
    eventName: string;
    city: string;
    pin: number;
    mobile: number;
    vendorId: string;
    vendorName?: string;
    userId: string;
    status: string;
    payment_status: string;
    amount: number;
    refundAmount:number;
    createdAt: Date;
  
    constructor(booking: Booking) {
      this.id = booking.id;
      this.date = booking.date;
      this.name = booking.name;
      this.eventName = booking.eventName;
      this.city = booking.city;
      this.pin = booking.pin;
      this.mobile = booking.mobile;
      this.vendorId = booking.vendorId;
      this.userId = booking.userId;
      this.status = booking.status;
      this.payment_status = booking.payment_status;
      this.amount = booking.amount;
      this.refundAmount = booking.refundAmount;
      this.createdAt = booking.createdAt;
      if (booking.vendorName) {
        this.vendorName = booking.vendorName;
      }
    }
  
    static fromDomain(booking: Booking): BookingDTO {
      return new BookingDTO(booking);
    }
    
    static fromDomainList(bookings: Booking[]): BookingDTO[] {
      return bookings.map(booking => new BookingDTO(booking));
    }
  }