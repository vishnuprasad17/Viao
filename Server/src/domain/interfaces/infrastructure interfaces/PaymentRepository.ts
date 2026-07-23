import { Payment } from "../../entities/Payment";

export interface PaymentRepository {
    create(payment: Payment): Promise<Payment>;
    findByBookingId(bookingId: string): Promise<Payment | null>;
    findOne(condition: Record<string, unknown>): Promise<Payment | null>;
    findAllPayments(page: number, pageSize: number): Promise<{ payment: Payment[], count: number }>;
}