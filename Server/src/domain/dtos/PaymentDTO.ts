import { Payment } from "../entities/Payment";
import { BookingDTO } from "./BookingDTO";
import { UserDTO } from "./UserDTO";
import { VendorDTO } from "./VendorDTO";

export class PaymentDTO {
    id: string;
    amount: number;
    vendorId: string | VendorDTO;
    userId: string | UserDTO;
    bookingId: string | BookingDTO;
    modeOfPayment: string;
    transactionRef: string;
    createdAt: Date;
  
    constructor(payment: Payment) {
        this.id = payment.id;
        this.amount = payment.amount;
        if (typeof payment.vendorId === "string") {
            this.vendorId = payment.vendorId;
        } else {
            this.vendorId = VendorDTO.fromDomain(payment.vendorId);
        }
        if (typeof payment.userId === "string") {
            this.userId = payment.userId;
        } else {
            this.userId = UserDTO.fromDomain(payment.userId);
        }
        if (typeof payment.bookingId === "string") {
            this.bookingId = payment.bookingId;
        } else {
            this.bookingId = BookingDTO.fromDomain(payment.bookingId);
        }
        this.modeOfPayment = payment.modeOfPayment;
        this.transactionRef = payment.transactionRef;
        this.createdAt = payment.createdAt;
    }
  
    static fromDomain(payment: Payment): PaymentDTO {
      return new PaymentDTO(payment);
    }
  
    static fromDomainList(payments: Payment[]): PaymentDTO[] {
      return payments.map(payment => new PaymentDTO(payment));
    }
  }