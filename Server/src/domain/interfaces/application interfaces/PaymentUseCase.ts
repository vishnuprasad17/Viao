import { Session, SessionData } from "express-session";
import Stripe from "stripe";
import { PaymentDTO } from "../../dtos/PaymentDTO";

export interface PaymentUseCase {
    pay(userId: string, vendorId: string, bookingId: string, name: string, logoUrl: string, useWallet: boolean): Promise<string | null>;
    verifyAndAddNewPayment(sessionId: string): Promise<PaymentDTO>;
    getPayments (page: number, pageSize: number): Promise<{ payment: PaymentDTO[], totalPages: number }>;
}