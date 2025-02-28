import { Booking } from "./Booking";
import { User } from "./User";
import { Vendor } from "./Vendor";

export class Payment {
    constructor(
        public readonly id: string,
        public amount: number,
        public vendorId: string | Vendor,
        public userId: string | User,
        public bookingId: string | Booking,
        public modeOfPayment: string,
        public transactionRef: string,
        public createdAt: Date
    ) {}
}